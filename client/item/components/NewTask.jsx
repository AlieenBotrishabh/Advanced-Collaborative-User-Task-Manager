import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { AlertTriangle, Clock, CheckCircle, RotateCw, Activity, Plus, X, Loader2 } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const socket = io('http://localhost:5000');

function NewTask() {
    const [tasks, setTasks] = useState([]);
    const [connected, setConnected] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchTasks();

        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));
        
        socket.on('newTask', (task) => {
            setTasks((prevTasks) => [...prevTasks, task]);
        });
        
        socket.on('taskUpdated', (updatedTask) => {
            setTasks(prevTasks => prevTasks.map(task => 
                task._id === updatedTask._id ? updatedTask : task
            ));
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('newTask');
            socket.off('taskUpdated');
        };
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/tasks');
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            ...Object.fromEntries(formData),
            progress: 0,
            status: 'pending'
        };

        try {
            const response = await fetch('http://localhost:5000/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Failed to create task');
            const newTask = await response.json();
            setTasks(prevTasks => [newTask, ...prevTasks]);
            socket.emit('createTask', newTask);
            setShowForm(false);
            e.target.reset();
        } catch (err) {
            setError(err.message);
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

    const getStatusIcon = (status) => {
        switch(status) {
            case 'completed': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'in-progress': return <Activity className="w-5 h-5 text-blue-500" />;
            default: return <RotateCw className="w-5 h-5 text-amber-500" />;
        }
    };

    const TaskCard = ({ task }) => {
        const daysUntilDeadline = () => {
            const today = new Date();
            const deadline = new Date(task.deadline);
            const diffTime = deadline - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        };

        const days = daysUntilDeadline();
        const isUrgent = days <= 2 && task.status !== 'completed';

        return (
            <div className="w-full md:w-96 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`h-2 w-full ${
                    task.status === 'completed' ? 'bg-emerald-500' :
                    task.status === 'in-progress' ? 'bg-blue-500' :
                    'bg-amber-500'
                }`}></div>
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <h2 className="text-xl font-bold text-gray-800 line-clamp-2">{task.task}</h2>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                        }`}>
                            {getStatusIcon(task.status)}
                            <span className="capitalize">{task.status.replace('-', ' ')}</span>
                        </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-3">{task.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className={`w-4 h-4 ${
                                task.priority >= 8 ? 'text-red-500' :
                                task.priority >= 5 ? 'text-orange-500' :
                                'text-green-500'
                            }`} />
                            <span>Priority: <strong>{task.priority}</strong></span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-500' : 'text-gray-500'}`} />
                            <span className={isUrgent ? 'text-red-500 font-medium' : ''}>
                                {days === 0 ? 'Today!' : 
                                 days < 0 ? `${Math.abs(days)} days ago` : 
                                 `${days} days left`}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-xs font-medium">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div 
                                className={`h-2 rounded-full transition-all duration-700 ease-in-out ${
                                    task.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${task.progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                        <button
                            onClick={() => updateTaskStatus(task._id, 'pending', 0)}
                            className="flex justify-center items-center gap-1 py-2 px-2 text-xs font-medium bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors border border-amber-200"
                        >
                            <RotateCw className="w-4 h-4" />
                            <span>Reset</span>
                        </button>
                        <button
                            onClick={() => updateTaskStatus(task._id, 'in-progress', 50)}
                            className="flex justify-center items-center gap-1 py-2 px-2 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                        >
                            <Activity className="w-4 h-4" />
                            <span>Progress</span>
                        </button>
                        <button
                            onClick={() => updateTaskStatus(task._id, 'completed', 100)}
                            className="flex justify-center items-center gap-1 py-2 px-2 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
                        >
                            <CheckCircle className="w-4 h-4" />
                            <span>Complete</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex flex-col items-center justify-center flex-1 p-6">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="mt-4 text-gray-600 font-medium">Loading tasks...</p>
            </div>
            <Footer />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex flex-col items-center justify-center flex-1 p-6">
                <AlertTriangle className="w-16 h-16 text-red-500" />
                <h2 className="mt-4 text-lg font-bold text-gray-800">Something went wrong</h2>
                <p className="mt-2 text-gray-600">{error}</p>
                <button 
                    onClick={fetchTasks}
                    className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-sm text-gray-500">
                                    {connected ? 'Connected' : 'Disconnected'}
                                </span>
                                <span className="text-xs text-gray-400">Real-time updates {connected ? 'enabled' : 'disabled'}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="inline-flex rounded-md shadow-sm">
                                <button 
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                                        filter === 'all' 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } border border-gray-200`}
                                >
                                    All
                                </button>
                                <button 
                                    onClick={() => setFilter('pending')}
                                    className={`px-4 py-2 text-sm font-medium ${
                                        filter === 'pending' 
                                            ? 'bg-amber-500 text-white' 
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } border-t border-b border-gray-200`}
                                >
                                    Pending
                                </button>
                                <button 
                                    onClick={() => setFilter('in-progress')}
                                    className={`px-4 py-2 text-sm font-medium ${
                                        filter === 'in-progress' 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } border-t border-b border-gray-200`}
                                >
                                    In Progress
                                </button>
                                <button 
                                    onClick={() => setFilter('completed')}
                                    className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                                        filter === 'completed' 
                                            ? 'bg-emerald-500 text-white' 
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    } border border-gray-200`}
                                >
                                    Completed
                                </button>
                            </div>
                            
                            <button 
                                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                                onClick={() => setShowForm(true)}
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Task</span>
                            </button>
                        </div>
                    </div>

                    {filteredTasks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTasks.map((task) => (
                                <TaskCard key={task._id} task={task} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-12 text-center">
                            <img 
                                src="/api/placeholder/200/200" 
                                alt="No tasks" 
                                className="w-32 h-32 mb-4 opacity-50" 
                            />
                            <h3 className="text-xl font-semibold text-gray-700">No tasks found</h3>
                            <p className="text-gray-500 mt-2 max-w-md">
                                {filter !== 'all' 
                                    ? `You don't have any ${filter} tasks yet.` 
                                    : "You don't have any tasks yet. Add your first task to get started!"}
                            </p>
                            <button 
                                onClick={() => setShowForm(true)}
                                className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Your First Task</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for adding new task */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white shadow-xl rounded-2xl w-full max-w-md relative animate-scaleIn overflow-hidden">
                        <div className="bg-blue-600 p-6 text-white">
                            <h2 className="text-xl font-semibold">Create New Task</h2>
                            <p className="text-blue-100 text-sm mt-1">Fill in the details below to add a new task</p>
                            <button 
                                onClick={() => setShowForm(false)} 
                                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                                <input 
                                    type="text" 
                                    name="task"
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="What needs to be done?" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Add some details about this task"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority (1-10)</label>
                                    <input 
                                        type="number" 
                                        name="priority"
                                        min="1" 
                                        max="10"
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="1-10" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                                    <input 
                                        type="date" 
                                        name="deadline"
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                                >
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
            <Footer />
        </div>
    );
}

export default NewTask;