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
  Trash2,
  Calendar,
  Mail,
  Edit,
  Save,
  XCircle
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
  // State for the task being edited
  const [editingTask, setEditingTask] = useState(null);

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

    const onTaskDeleted = (deletedTaskId) => {
      console.log('Task deletion received:', deletedTaskId);
      setTasks((prevTasks) => prevTasks.filter(task => task._id !== deletedTaskId));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('newTask', onNewTask);
    socket.on('taskUpdated', onTaskUpdated);
    socket.on('taskDeleted', onTaskDeleted);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('newTask', onNewTask);
      socket.off('taskUpdated', onTaskUpdated);
      socket.off('taskDeleted', onTaskDeleted);
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

  // Modified handleSubmit function to include teamId
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      task: formData.get('task'),
      description: formData.get('description'),
      deadline: formData.get('deadline'),
      email: formData.get('email'),
      priority: formData.get('priority'),
      teamId: teamId, // Make sure to include the teamId
      status: 'pending',
      progress: 0
    };

    console.log('Submitting task:', data);

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include' // Add credentials for cookies if needed
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
        credentials: 'include', // Add credentials for cookies if needed
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

  // Fixed delete task function
  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'DELETE',
        credentials: 'include', // Add credentials for cookies if needed
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete task');
      }
      
      console.log('Task deleted successfully:', taskId);
      
      // Update local state
      setTasks((prevTasks) => prevTasks.filter(task => task._id !== taskId));
      
      // Emit socket event
      socket.emit('deleteTask', taskId);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // New function to handle editing a task
  const startEditingTask = (task) => {
    setEditingTask({...task});
    // Close the new task form if it's open
    setShowForm(false);
  };

  // Function to save edited task
  const saveEditedTask = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/tasks/${editingTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingTask),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task');
      }
      
      const updatedTask = await response.json();
      console.log('Task updated successfully:', updatedTask);
      
      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
      
      // Emit socket event
      socket.emit('updateTask', updatedTask);
      
      // Clear editing state
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const cancelEditing = () => {
    setEditingTask(null);
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
    return 'bg-gray-200 hover:bg-gray-300 text-gray-700';
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
          <Link to="/teams" className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Tasks</h1>
            <p className="text-sm text-gray-500">
              Team: {team?.name || 'Loading...'} {teamId && `(ID: ${teamId})`}
            </p>
            <div className={`text-xs ${connected ? 'text-green-500' : 'text-red-500'} flex items-center gap-1 mt-1`}>
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {connected ? 'Connected to server' : 'Disconnected from server'}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
            <button 
              className="ml-auto text-sm bg-red-100 px-2 py-1 rounded hover:bg-red-200 transition-colors"
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${getFilterButtonClass(status)}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              // Close editing if opening new task form
              if (!showForm) setEditingTask(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showForm ? 'Cancel' : 'New Task'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 mb-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Task</h3>
            
            <div>
              <label htmlFor="task" className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                id="task"
                name="task"
                placeholder="Enter task title"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter task description"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors h-24"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input 
                  type="date" 
                  id="deadline" 
                  name="deadline" 
                  required 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                >
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email for Notifications
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="Enter email for reminders"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Task
            </button>
          </form>
        )}

        {/* Edit Task Form */}
        {editingTask && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Task</h3>
            
            <div>
              <label htmlFor="edit-task" className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                id="edit-task"
                name="task"
                value={editingTask.task}
                onChange={handleEditInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="edit-description"
                name="description"
                value={editingTask.description}
                onChange={handleEditInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors h-24"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input 
                  type="date" 
                  id="edit-deadline" 
                  name="deadline" 
                  value={editingTask.deadline ? editingTask.deadline.split('T')[0] : ''}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                />
              </div>

              <div>
                <label htmlFor="edit-priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="edit-priority"
                  name="priority"
                  value={editingTask.priority || ''}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email for Notifications
                </label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={editingTask.email || ''}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="edit-status"
                  name="status"
                  value={editingTask.status || 'pending'}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={saveEditedTask}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
              <button 
                type="button" 
                onClick={cancelEditing}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium shadow-sm flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading && tasks.length > 0 ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-lg shadow-md border border-gray-100">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
              <div key={task._id} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                <div className={`h-2 ${task.status === 'completed' ? 'bg-emerald-500' : task.status === 'in-progress' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <h2 className="text-lg font-bold text-gray-800 truncate">{task.task}</h2>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {task.priority || 'No priority'}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                  
                  <div className="flex flex-col gap-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Deadline: {new Date(task.deadline).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {task.email}
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <div className="flex gap-1">
                      {task.status !== 'in-progress' && (
                        <button
                          onClick={() => updateTaskStatus(task._id, 'in-progress', 50)}
                          className="text-xs px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                        >
                          <Activity className="w-3 h-3" />
                          Start
                        </button>
                      )}
                      {task.status !== 'completed' && (
                        <button
                          onClick={() => updateTaskStatus(task._id, 'completed', 100)}
                          className="text-xs px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Complete
                        </button>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="text-xs px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                      <button
                        className="text-xs px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors flex items-center gap-1"
                        onClick={() => startEditingTask(task)}
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                  </div>
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