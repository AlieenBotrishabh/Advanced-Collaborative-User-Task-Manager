import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import image3 from '../assets/A3.gif';
import { Plus, X, Calendar, Code, FileText } from 'lucide-react';
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      <main className="flex-grow">
        <div className="w-full border-b border-indigo-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
              Welcome to Projects
            </h1>
            <p className="text-center text-gray-400 mt-4 max-w-2xl mx-auto">
              Create and manage your coding projects with ease. Track progress, set deadlines, and bring your ideas to life.
            </p>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
            <div className="bg-gray-900 text-white shadow-2xl p-8 rounded-xl w-full max-w-md relative border border-indigo-800/50 animate-scaleIn">
              <button 
                onClick={handleAddProjectClick} 
                className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors duration-200"
                aria-label="Close form"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-semibold mb-6 text-center text-blue-300">Create New Project</h2>

              {error && (
                <div className="mb-4 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-200 text-sm flex items-center gap-2">
                  <X size={16} className="text-red-400" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-blue-300 mb-2 font-medium">Project Name</label>
                  <input 
                    type="text"
                    name="name"
                    className="w-full bg-gray-800/70 text-white border border-indigo-800/50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    placeholder="Enter project name" 
                    required
                  />
                </div>

                <div>
                  <label className="block text-blue-300 mb-2 font-medium flex items-center gap-2">
                    <FileText size={16} />
                    Description
                  </label>
                  <textarea
                    className="w-full bg-gray-800/70 text-white border border-indigo-800/50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    name="description"
                    placeholder="Enter project description"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-blue-300 mb-2 font-medium flex items-center gap-2">
                    <Code size={16} />
                    Language
                  </label>
                  <select
                    name="language"
                    className="w-full bg-gray-800/70 text-white border border-indigo-800/50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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

                <div>
                  <label className="block text-blue-300 mb-2 font-medium flex items-center gap-2">
                    <Calendar size={16} />
                    Deadline
                  </label>
                  <input 
                    className="w-full bg-gray-800/70 text-white border border-indigo-800/50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    type="date"
                    name="deadline"
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-900/30"
                >
                  <Plus size={20} />
                  Create Project
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl"></div>
              <img 
                className="w-full h-full object-contain relative z-10" 
                src={image3} 
                alt="Project illustration" 
              />
              <button 
                className="absolute bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 flex items-center gap-3 font-medium shadow-lg shadow-blue-900/30 transform hover:scale-105 z-20"
                onClick={handleAddProjectClick}
              >
                <Plus size={20} />
                Add New Project
              </button>
            </div>
            
            <div className="w-full mt-16 flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-center text-blue-300 mb-4">No Projects Yet</h2>
              <p className="text-center text-gray-400 max-w-md">
                Start your coding journey by creating your first project. Track your progress and meet your deadlines.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Projects;