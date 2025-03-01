import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { AlertTriangle, Clock } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const socket = io('http://localhost:5000');

function NewTask() {
    const [tasks, setTasks] = useState([]);
    const [connected, setConnected] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const TaskCard = ({ task }) => (
        <div className="w-full md:w-[500px] h-auto border border-gray-200 rounded-xl shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{task.task}</h2>
                    <span className={`px-3 py-1 rounded-full text-white text-sm ${
                        task.status === 'completed' ? 'bg-green-500' :
                        task.status === 'in-progress' ? 'bg-blue-500' :
                        'bg-yellow-500'
                    }`}>
                        {task.status}
                    </span>
                </div>
                
                <p className="text-gray-600 mb-4">{task.description}</p>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-5 h-5 ${
                            task.priority >= 8 ? 'text-red-500' :
                            task.priority >= 5 ? 'text-orange-500' :
                            'text-green-500'
                        }`} />
                        <span className="text-sm">Priority: {task.priority}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span className="text-sm">
                            Deadline: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${task.progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={() => updateTaskStatus(task._id, 'pending', 0)}
                            className="flex-1 px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            onClick={() => updateTaskStatus(task._id, 'in-progress', 50)}
                            className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            In Progress
                        </button>
                        <button
                            onClick={() => updateTaskStatus(task._id, 'completed', 100)}
                            className="flex-1 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                            Complete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="p-6 text-center">Loading tasks...</div>;
    if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

    return (
        <>
        <Navbar />
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Real-Time Task Manager</h1>
                    <div className="text-sm mt-2">
                        Status: {connected ? 
                            <span className="text-green-500">Connected</span> : 
                            <span className="text-red-500">Disconnected</span>
                        }
                    </div>
                </div>
                <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => setShowForm(true)}
                >
                    Add Task
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md relative">
                        <button 
                            onClick={() => setShowForm(false)} 
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
                        >
                            ✖
                        </button>

                        <h2 className="text-xl font-semibold mb-4 text-center">Add New Task</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Task Name</label>
                                <input 
                                    type="text" 
                                    name="task"
                                    className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter task name" 
                                    required 
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter task description"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Priority (1-10)</label>
                                <input 
                                    type="number" 
                                    name="priority"
                                    min="1" 
                                    max="10"
                                    className="w-full border p-2 rounded mt-1"
                                    placeholder="Task priority" 
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Deadline</label>
                                <input 
                                    type="date" 
                                    name="deadline"
                                    className="w-full border p-2 rounded mt-1" 
                                    required 
                                />
                            </div>
                            <button 
                                type="submit"
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-700 transition-colors"
                            >
                                Save Task
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="w-full flex flex-wrap gap-6 justify-center p-4">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard key={task._id} task={task} />
                    ))
                ) : (
                    <p className="text-gray-500">No tasks available. Create one to get started!</p>
                )}
            </div>
        </div>
        <Footer />
        </>
    );
}

export default NewTask;