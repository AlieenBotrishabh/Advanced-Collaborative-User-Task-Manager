import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import image3 from '../assets/A3.gif';
import { Plus, X } from 'lucide-react';
import Footer from './Footer';

const Projects = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      ...Object.fromEntries(formData),
      username: 'default', // You might want to get this from your auth system
      progress: 0,
      status: 'pending'
    };

    try {
      const response = await fetch('http://localhost:5000/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowForm(false);
        navigate('/newproject');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit project');
      }
    } catch (err) {
      setError('An error occurred while creating the project');
      console.error('An error occurred:', err);
    }
  };

  const handleAddProjectClick = () => {
    setShowForm(!showForm);
    setError('');
  };

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-black text-white'>
        <div className='w-full border-b border-gray-800'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <h1 className='text-5xl font-bold text-center'>Welcome to Projects!</h1>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-gray-900 text-white shadow-lg p-6 rounded-lg w-full max-w-md relative border border-gray-800">
              <button 
                onClick={handleAddProjectClick} 
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors duration-200"
                aria-label="Close form"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-semibold mb-6 text-center">Add New Project</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-1">Project Name</label>
                  <input 
                    type="text"
                    name="name"
                    className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Enter project name" 
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-300 mb-1">Description</label>
                  <textarea
                    className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="description"
                    placeholder="Enter project description"
                    rows="3"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className='block text-gray-300 mb-1'>Language</label>
                  <select
                    name="language"
                    className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="" className="bg-gray-800">Select a language</option>
                    <option value="C++" className="bg-gray-800">C++</option>
                    <option value="Python" className="bg-gray-800">Python</option>
                    <option value="Dart" className="bg-gray-800">Dart</option>
                    <option value="Java" className="bg-gray-800">Java</option>
                    <option value="JavaScript" className="bg-gray-800">JavaScript</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className='block text-gray-300 mb-1'>Deadline</label>
                  <input 
                    className='w-full bg-gray-800 text-white border border-gray-700 p-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    type="date"
                    name="deadline"
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Create Project
                </button>
              </form>
            </div>
          </div>
        )}

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='flex flex-col items-center justify-center relative'>
            <div className='relative w-full max-w-lg aspect-square flex items-center justify-center'>
              <img 
                className='w-full h-full object-contain opacity-50' 
                src={image3} 
                alt="Project illustration" 
              />
              <button 
                className='absolute bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2'
                onClick={handleAddProjectClick}
              >
                <Plus size={20} />
                Add New Project
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Projects;