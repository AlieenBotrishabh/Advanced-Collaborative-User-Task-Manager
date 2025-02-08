import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Handle connection status
        socket.on('connect', () => {
            setConnected(true);
        });

        socket.on('disconnect', () => {
            setConnected(false);
        });

        // Handle existing tasks when first connecting
        socket.on('existingTasks', (existingTasks) => {
            setTasks(existingTasks);
        });

        // Handle new tasks
        socket.on('newTask', (task) => {
            setTasks((prevTasks) => [...prevTasks, task]);
        });

        // Cleanup on component unmount
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('existingTasks');
            socket.off('newTask');
        };
    }, []);

    const handleAddTask = () => {
        if (!newTask.trim()) return;

        const task = {
            id: Date.now(),
            title: newTask.trim()
        };

        // Emit the new task to the server
        socket.emit('createTask', task);
        setNewTask('');
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Real-Time Task Manager</h1>
            <div className="text-sm mb-2">
                Status: {connected ? 'Connected' : 'Disconnected'}
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    className="border p-2 mr-2"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter new task"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <button
                    onClick={handleAddTask}
                    className="bg-blue-500 text-white p-2 rounded"
                    disabled={!connected}
                >
                    Add Task
                </button>
            </div>
            <ul className="list-disc pl-5">
                {tasks.map((task) => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;