import React, { useState } from 'react';
import { Link } from 'react-router';
import image from '../assets/A.png';
import image6 from '../assets/A6.png';

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('dashboard');
  
  const handleSetActive = (linkName) => {
    setActiveLink(linkName);
  };

  return (
    <nav className="bg-white shadow-lg w-full p-4">
      {/* Container for content */}
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        {/* Left Section */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link to='/' className="flex items-center transition-transform hover:scale-105">
              <img 
                src={image6} 
                alt="Logo" 
                className="w-10 h-10 rounded-full shadow-md border-2 border-indigo-100" 
              />
            </Link>
          </div>
          
          {/* Nav Links */}
          <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <Link 
              to="/" 
              className={`py-2 px-3 transition-all duration-200 rounded-lg hover:bg-indigo-50 ${activeLink === 'dashboard' ? 'text-indigo-600 border-b-2 border-indigo-500' : ''}`}
              onClick={() => handleSetActive('dashboard')}
            >
              Dashboard
            </Link>
            <Link 
              to="/task" 
              className={`py-2 px-3 transition-all duration-200 rounded-lg hover:bg-indigo-50 ${activeLink === 'task' ? 'text-indigo-600 border-b-2 border-indigo-500' : ''}`}
              onClick={() => handleSetActive('task')}
            >
              Task
            </Link>
            <Link 
              to="/reminder" 
              className={`py-2 px-3 transition-all duration-200 rounded-lg hover:bg-indigo-50 ${activeLink === 'reminder' ? 'text-indigo-600 border-b-2 border-indigo-500' : ''}`}
              onClick={() => handleSetActive('reminder')}
            >
              Reminder
            </Link>
            <Link 
              to="/project" 
              className={`py-2 px-3 transition-all duration-200 rounded-lg hover:bg-indigo-50 ${activeLink === 'project' ? 'text-indigo-600 border-b-2 border-indigo-500' : ''}`}
              onClick={() => handleSetActive('project')}
            >
              Projects
            </Link>
            <Link 
              to="/newproject" 
              className={`py-2 px-3 transition-all duration-200 rounded-lg hover:bg-indigo-50 ${activeLink === 'allprojects' ? 'text-indigo-600 border-b-2 border-indigo-500' : ''}`}
              onClick={() => handleSetActive('allprojects')}
            >
              All Projects
            </Link>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center space-x-5">
          {/* Login Button */}
          <Link 
            to='/login' 
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Login
          </Link>
          
          {/* Profile Picture */}
          <Link to="/users" className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-100 shadow-md hover:shadow-lg transition-all hover:border-indigo-300">
              <img 
                className="w-full h-full object-cover" 
                src={image} 
                alt="User Profile" 
              />
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Button - Placeholder for mobile implementation */}
    </nav>
  );
};

export default Navbar;