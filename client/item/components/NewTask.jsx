import React, { useState, useEffect } from 'react';
import image2 from '../assets/A2.webp';
import { io } from 'socket.io-client';
import Navbar from './Navbar';
import { Link, useAsyncError, useNavigate } from 'react-router';

const socket = io('http://localhost:5000');

function NewTask() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [connected, setConnected] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try
        {
            const response = await fetch('http://localhost:5000/task', {
                method : "POST",
                headers : {
                    'Content-type' : 'application/json',
                    body : JSON.stringify(data)
                }
            })

            if(response.ok)
            {
                navigate('/task');
            }

            else
            {
                const errorData = await response.json();
                console.log(errorData);
            }
        }
        catch(err)
        {
            console.log(`An error ocurred`);
        }
    }

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
    
        // Toggle the form visibility
        const handleAddTaskClick = () => {
          setShowForm(!showForm);
        };

    return (
        <>
        <Navbar />
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Real-Time Task Manager</h1>
            <div className="text-sm mb-2">
                Status: {connected ? 'Connected' : 'Disconnected'}
            </div>
            <div className='flex justify-end m-4'>
            <div className={`${showForm ? 'blur-sm' : ''} transition-all duration-300`}>
        <Link 
          className="w-[94px] h-[40px] bg-blue-600 text-center text-white m-4 p-2 rounded-lg cursor-pointer"
          onClick={handleAddTaskClick}
        >
          Add Task
        </Link>
        </div>

      {/* Overlay and Add Task Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          
          {/* Form Container */}
          <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md relative">
            <button 
              onClick={handleAddTaskClick} 
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center">Add New Task</h2>

            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Task Name</label>
                <input 
                  type="text"
                  id="name"
                  name="name"
                  className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Enter task name" 
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea 
                  className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="description"
                  name="description"
                  placeholder="Enter task description"
                />
              </div>

              <div className="mb-4">
                <label className='block text-gray-700'>Priority</label>
                <input className='w-full border p-2 rounded mt-1'
                type="number"
                id="priority"
                name="priority"
                placeholder="Add task priority"
                ></input>
              </div>

              <div className="mb-4">
                <label className='block text-gray-700'>Deadline</label>
                <input className='w-full border p-2 rounded mt-1'
                type="date"
                id="deadline"
                name="deadline"
                placeholder="Add task deadline" />
              </div>

              <button 
                type="submit" 
                className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-700"
              >
                Save Task
              </button>
            </form>
          </div>
        </div>
      )}
      </div>

      <div>
      <div className="w-full flex flex-wrap gap-4 justify-center p-4">
  <div className='w-[250px] h-[350px] border-2 border-gray-950 rounded-lg shadow-lg overflow-hidden bg-white'>
    <img src={image2} alt='Task Image' className='w-full h-[150px] object-cover' />
    <div className='p-4'>
      <h2 className='text-lg font-bold text-gray-800'>Task Name</h2>
      <p className='text-sm text-gray-600 mt-2'>This is a description of the task detailing what needs to be done.</p>
      <div className='mt-4'>
        <p className='text-sm'><span className='font-semibold'>Priority:</span> <span className='text-red-500'>High</span></p>
        <p className='text-sm mt-1'><span className='font-semibold'>Deadline:</span> 2025-02-20</p>
      </div>
    </div>
  </div>

  <div className='w-[250px] h-[350px] border-2 border-gray-950 rounded-lg shadow-lg overflow-hidden bg-white'>
    <img src={image2} alt='Task Image' className='w-full h-[150px] object-cover' />
    <div className='p-4'>
      <h2 className='text-lg font-bold text-gray-800'>Task Name</h2>
      <p className='text-sm text-gray-600 mt-2'>This is a description of the task detailing what needs to be done.</p>
      <div className='mt-4'>
        <p className='text-sm'><span className='font-semibold'>Priority:</span> <span className='text-red-500'>High</span></p>
        <p className='text-sm mt-1'><span className='font-semibold'>Deadline:</span> 2025-02-20</p>
      </div>
    </div>
  </div>

  <div className='w-[250px] h-[350px] border-2 border-gray-950 rounded-lg shadow-lg overflow-hidden bg-white'>
    <img src={image2} alt='Task Image' className='w-full h-[150px] object-cover' />
    <div className='p-4'>
      <h2 className='text-lg font-bold text-gray-800'>Task Name</h2>
      <p className='text-sm text-gray-600 mt-2'>This is a description of the task detailing what needs to be done.</p>
      <div className='mt-4'>
        <p className='text-sm'><span className='font-semibold'>Priority:</span> <span className='text-red-500'>High</span></p>
        <p className='text-sm mt-1'><span className='font-semibold'>Deadline:</span> 2025-02-20</p>
      </div>
    </div>
  </div>

  <div className='w-[250px] h-[350px] border-2 border-gray-950 rounded-lg shadow-lg overflow-hidden bg-white'>
    <img src={image2} alt='Task Image' className='w-full h-[150px] object-cover' />
    <div className='p-4'>
      <h2 className='text-lg font-bold text-gray-800'>Task Name</h2>
      <p className='text-sm text-gray-600 mt-2'>This is a description of the task detailing what needs to be done.</p>
      <div className='mt-4'>
        <p className='text-sm'><span className='font-semibold'>Priority:</span> <span className='text-red-500'>High</span></p>
        <p className='text-sm mt-1'><span className='font-semibold'>Deadline:</span> 2025-02-20</p>
      </div>
    </div>
  </div>

  <div className='w-[250px] h-[350px] border-2 border-gray-950 rounded-lg shadow-lg overflow-hidden bg-white'>
    <img src={image2} alt='Task Image' className='w-full h-[150px] object-cover' />
    <div className='p-4'>
      <h2 className='text-lg font-bold text-gray-800'>Task Name</h2>
      <p className='text-sm text-gray-600 mt-2'>This is a description of the task detailing what needs to be done.</p>
      <div className='mt-4'>
        <p className='text-sm'><span className='font-semibold'>Priority:</span> <span className='text-red-500'>High</span></p>
        <p className='text-sm mt-1'><span className='font-semibold'>Deadline:</span> 2025-02-20</p>
      </div>
    </div>
  </div>
      </div>

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
        </>
    );
}

export default NewTask;