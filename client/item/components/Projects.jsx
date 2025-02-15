import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import image3 from '../assets/A3.gif';
import { Link } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate('/newproject');
      } else {
        console.error('Failed to submit task');
      }
    } catch (err) {
      console.error('An error occurred:', err);
    }
  };

  const handleAddTaskClick = () => {
    setShowForm(!showForm);
  };

  return (
    <>
      <Navbar />
      <div className='w-full h-full bg-black text-white flex flex-col items-center'>
        <div className='w-full h-[100px] flex justify-center items-center border-gray-800 border-b-2'>
          <h1 className='text-5xl font-bold'>Welcome to Projects!</h1>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-black text-white shadow-lg p-6 rounded-lg w-full max-w-md relative">
              <button 
                onClick={handleAddTaskClick} 
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              >
                ✖
              </button>

              <h2 className="text-xl font-semibold mb-4 text-center">Add New Project</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-white">Project Name</label>
                  <input 
                    type="text"
                    id="task"
                    name="task"
                    className="w-full bg-gray-800 text-white border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Enter task name" 
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-white">Description</label>
                  <input
                    className="w-full bg-gray-800 text-white border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="description"
                    name="description"
                    placeholder="Enter task description"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className='block text-white'>Language</label>
                  <select
                    name="language"
                    className="w-full bg-gray-800 text-white border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  >
                    <option value="">Select a language</option>
                    <option value="C++">C++</option>
                    <option value="Python">Python</option>
                    <option value="Dart">Dart</option>
                    <option value="Java">Java</option>
                    <option value="JavaScript">JavaScript</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className='block text-white'>Deadline</label>
                  <input className='w-full bg-gray-800 text-white border p-2 rounded mt-1'
                    type="date"
                    id="deadline"
                    name="deadline"
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-700"
                >
                  Save Project
                </button>
              </form>
            </div>
          </div>
        )}

        <div className='w-full h-[700px] flex flex-col items-center'>
          <div className='w-full h-[700px] flex justify-center items-center p-4 m-4 relative'>
            <img className='w-[400px] h-[400px] opacity-50 z-0' src={image3} alt="" />
            <button 
              className='bg-blue-700 text-white p-2 m-4 rounded-lg z-10 absolute' 
              onClick={handleAddTaskClick}
            >
              Add New Task
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
