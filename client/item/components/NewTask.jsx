import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  RotateCw,
  Activity,
  Plus,
  X,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

// Fixed Socket.IO connection with proper configuration
const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
  withCredentials: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

function NewTask() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [connected, setConnected] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!teamId) {
      navigate('/teams');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch team details
        const teamResponse = await fetch(`http://localhost:5000/teams?teamId=${teamId}`);
        if (!teamResponse.ok) {
          const errorData = await teamResponse.json();
          throw new Error(errorData.message || 'Team not found');
        }
        const teamData = await teamResponse.json();
        setTeam(teamData);

        // Fetch tasks separately
        await fetchTasks();
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();

    // Socket event setup
    const onConnect = () => {
      console.log('Connected to socket server');
      setConnected(true);
    };
    
    const onDisconnect = () => {
      console.log('Disconnected from socket server');
      setConnected(false);
    };
    
    const onNewTask = (task) => {
      console.log('New task received:', task);
      if (task.teamId === teamId) {
        setTasks((prevTasks) => [task, ...prevTasks]);
      }
    };
    
    const onTaskUpdated = (updatedTask) => {
      console.log('Task update received:', updatedTask);
      if (updatedTask.teamId === teamId) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
        );
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('newTask', onNewTask);
    socket.on('taskUpdated', onTaskUpdated);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('newTask', onNewTask);
      socket.off('taskUpdated', onTaskUpdated);
    };
  }, [teamId, navigate]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/tasks?teamId=${teamId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }
      
      const data = await response.json();
      console.log('Tasks fetched:', data);
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      task: formData.get('task'),
      description: formData.get('description'),
      deadline: formData.get('deadline'),
      priority: parseInt(formData.get('priority')),
      teamId,
      progress: 0,
      status: 'pending',
    };

    console.log('Submitting task:', data);

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task');
      }

      const newTask = await response.json();
      console.log('Task created:', newTask);
      
      // Update local state
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      
      // Emit socket event
      socket.emit('createTask', newTask);
      
      // Reset form
      setShowForm(false);
      e.target.reset();
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.message);
    }
  };

  const updateTaskStatus = async (taskId, status, progress) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, progress }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task');
      }
      
      const updatedTask = await response.json();
      console.log('Task updated:', updatedTask);
      
      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
      );
      
      // Emit socket event
      socket.emit('updateTask', updatedTask);
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'in-progress':
        return <Activity className="w-5 h-5 text-blue-500" />;
      default:
        return <RotateCw className="w-5 h-5 text-amber-500" />;
    }
  };

  const getFilterButtonClass = (filterName) => {
    if (filter === filterName) {
      if (filterName === 'completed') return 'bg-emerald-600 text-white';
      if (filterName === 'in-progress') return 'bg-blue-600 text-white';
      if (filterName === 'pending') return 'bg-amber-600 text-white';
      return 'bg-blue-600 text-white';
    }
    return 'bg-gray-200';
  };

  if (loading && !tasks.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center p-12">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <Link to="/teams" className="mr-4">
            <ArrowLeft className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Manage Tasks</h1>
            <p className="text-sm text-gray-500">
              Team: {team?.name || 'Loading...'} {teamId && `(ID: ${teamId})`}
            </p>
            <p className="text-xs text-gray-400">
              {connected ? 'Connected to server' : 'Disconnected from server'}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
            <button 
              className="ml-auto text-sm bg-red-100 px-2 py-1 rounded hover:bg-red-200"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {['all', 'pending', 'in-progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-full text-sm ${getFilterButtonClass(status)}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showForm ? 'Cancel' : 'New Task'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-6 space-y-4">
            <div>
              <label htmlFor="task" className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                id="task"
                name="task"
                placeholder="Task Title"
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Description"
                required
                className="w-full p-2 border rounded h-24"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input type="date" id="deadline" name="deadline" required className="w-full p-2 border rounded" />
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority (1-10)
                </label>
                <input
                  type="number"
                  id="priority"
                  name="priority"
                  min="1"
                  max="10"
                  defaultValue="5"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Add Task
            </button>
          </form>
        )}

        {loading && tasks.length > 0 ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-lg shadow">
            <Clock className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="text-gray-500 mt-1">
              {filter !== 'all' 
                ? `There are no ${filter} tasks for this team.` 
                : 'Create a new task to get started.'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {filteredTasks.map((task) => (
              <div key={task._id} className="bg-white shadow rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{task.task}</h2>
                  {getStatusIcon(task.status)}
                </div>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-xs text-gray-500">
                  Deadline: {new Date(task.deadline).toLocaleDateString()} | Priority: {task.priority}
                </p>
                <div className="flex gap-2 mt-2">
                  {task.status !== 'in-progress' && (
                    <button
                      onClick={() => updateTaskStatus(task._id, 'in-progress', 50)}
                      className="text-sm px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Start
                    </button>
                  )}
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => updateTaskStatus(task._id, 'completed', 100)}
                      className="text-sm px-3 py-1 bg-emerald-600 text-white rounded"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default NewTask;