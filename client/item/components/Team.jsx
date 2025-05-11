import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Users, CheckCircle, Activity, RotateCw, ArrowLeft } from 'lucide-react';
import { io } from 'socket.io-client';
import Navbar from './Navbar';
import Footer from './Footer';

const socket = io('http://localhost:5000');

function Team() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!teamId) return;

    const fetchTeamData = async () => {
      try {
        setLoading(true);
        
        // Fetch team information
        const teamResponse = await fetch(`http://localhost:5000/teams?teamId=${teamId}`);
        if (!teamResponse.ok) throw new Error('Failed to fetch team');
        const teamData = await teamResponse.json();
        setTeam(teamData);
        
        // Fetch team tasks
        const tasksResponse = await fetch(`http://localhost:5000/tasks?teamId=${teamId}`);
        if (!tasksResponse.ok) throw new Error('Failed to fetch tasks');
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeamData();

    // Socket connections
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    
    socket.on('newTask', (task) => {
      if (task.teamId === teamId) {
        setTasks((prevTasks) => [...prevTasks, task]);
      }
    });

    socket.on('taskUpdated', (updatedTask) => {
      if (updatedTask.teamId === teamId) {
        setTasks(prevTasks => prevTasks.map(task => 
          task._id === updatedTask._id ? updatedTask : task
        ));
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('newTask');
      socket.off('taskUpdated');
    };
  }, [teamId]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'in-progress': return <Activity className="w-5 h-5 text-blue-500" />;
      default: return <RotateCw className="w-5 h-5 text-amber-500" />;
    }
  };

  const updateTaskStatus = async (taskId, status, progress) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, progress })
      });

      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === taskId ? updatedTask : task)
      );
      socket.emit('updateTask', updatedTask);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  if (loading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            Error: {error}
          </div>
          <Link to="/" className="mt-4 flex items-center text-blue-600">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
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
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold">{team?.teamName || 'Team'}</h1>
            </div>
            <p className="text-sm text-gray-500">Team ID: {teamId}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Task Status Filters</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('pending')} 
              className={`px-3 py-1 rounded-full text-sm ${filter === 'pending' ? 'bg-amber-500 text-white' : 'bg-gray-200'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilter('in-progress')} 
              className={`px-3 py-1 rounded-full text-sm ${filter === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              In Progress
            </button>
            <button 
              onClick={() => setFilter('completed')} 
              className={`px-3 py-1 rounded-full text-sm ${filter === 'completed' ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Team Tasks</h2>
          
          {filteredTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tasks found with the selected filter.</p>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <TaskCard key={task._id} task={task} updateTaskStatus={updateTaskStatus} getStatusIcon={getStatusIcon} />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Link to={`/tasks/${teamId}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Manage Tasks
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function TaskCard({ task, updateTaskStatus, getStatusIcon }) {
  const daysUntilDeadline = () => {
    const today = new Date();
    const deadline = new Date(task.deadline);
    const diffTime = deadline - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const days = daysUntilDeadline();
  const isUrgent = days <= 2 && task.status !== 'completed';

  return (
    <div className="p-4 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">{task.task}</h3>
        <span className="flex items-center gap-1 text-xs capitalize font-medium px-2 py-1 rounded-full bg-gray-100">
          {getStatusIcon(task.status)}
          {task.status.replace('-', ' ')}
        </span>
      </div>
      <p className="text-sm mt-2 text-gray-600">{task.description}</p>
      
      <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
        <div>Priority: {task.priority}</div>
        <div className={isUrgent ? 'text-red-500 font-semibold' : ''}>
          {days < 0 ? `${Math.abs(days)} days ago` : days === 0 ? 'Today!' : `${days} days left`}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 h-2 rounded mt-2 overflow-hidden">
        <div className="h-2 bg-blue-500 rounded" style={{ width: `${task.progress}%` }} />
      </div>
      
      <div className="flex gap-2 mt-3 text-xs">
        <button onClick={() => updateTaskStatus(task._id, 'pending', 0)} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Reset</button>
        <button onClick={() => updateTaskStatus(task._id, 'in-progress', 50)} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Progress</button>
        <button onClick={() => updateTaskStatus(task._id, 'completed', 100)} className="bg-green-100 text-green-700 px-2 py-1 rounded">Complete</button>
      </div>
    </div>
  );
}

export default Team;