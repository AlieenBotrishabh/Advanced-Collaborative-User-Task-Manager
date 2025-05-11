
import React, { useState } from 'react';
import { Link } from 'react-router';
import image from '../assets/A.png';
import image6 from '../assets/A6.png';

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleSetActive = (linkName) => {
    setActiveLink(linkName);
    setMobileMenuOpen(false);
  };
  
  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50">
      {/* Main container with subtle gradient background */}
      <div className="bg-gradient-to-r from-white to-indigo-50">
        <div className="flex items-center justify-between mx-auto max-w-7xl px-4 py-3">
          {/* Left Section */}
          <div className="flex items-center space-x-8">
            {/* Logo with enhanced styling */}
            <div className="flex items-center">
              <Link to='/' className="flex items-center transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <img
                    src={image6}
                    alt="Logo"
                    className="w-12 h-12 rounded-full shadow-lg border-2 border-indigo-200"
                  />
                  <div className="absolute -inset-1 bg-indigo-500 rounded-full blur-sm opacity-20 -z-10"></div>
                </div>
              </Link>
            </div>
            
            {/* Nav Links - Hidden on mobile */}
            <div className="hidden md:flex space-x-1 text-gray-700 font-medium">
              {['dashboard', 'task', 'reminder', 'project', 'allprojects', 'Teams'].map((link) => {
                const paths = {
                  dashboard: '/',
                  task: '/task',
                  reminder: '/reminder',
                  project: '/project',
                  allprojects: '/newproject',
                  Teams: '/Teams'
                };
                
                const labels = {
                  dashboard: 'Dashboard',
                  task: 'Task',
                  reminder: 'Reminder',
                  project: 'Projects',
                  allprojects: 'All Projects',
                  Teams: 'Teams'
                };
                
                return (
                  <Link
                    key={link}
                    to={paths[link]}
                    className={`py-2 px-4 transition-all duration-200 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 relative group ${
                      activeLink === link ? 'text-indigo-600 font-semibold' : 'text-gray-600'
                    }`}
                    onClick={() => handleSetActive(link)}
                  >
                    {labels[link]}
                    {activeLink === link && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full"></span>
                    )}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-indigo-500 rounded-full group-hover:w-full group-hover:left-0 transition-all duration-300 ease-in-out"></span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Login Button with improved gradient and hover effect */}
            <Link
              to='/login'
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-medium py-2 px-5 rounded-lg shadow-md hover:shadow-indigo-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Login
            </Link>
            
            {/* Profile Picture with enhanced styling */}
            <Link to="/users" className="relative group">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-200 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:border-indigo-400 transform group-hover:scale-105">
                <img
                  className="w-full h-full object-cover"
                  src={image}
                  alt="User Profile"
                />
              </div>
              <div className="absolute -inset-1 bg-indigo-400 rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
            </Link>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden flex items-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-gray-700 hover:text-indigo-600 transition-colors duration-200" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-inner">
          <div className="flex flex-col space-y-2 p-4 text-gray-700">
            {['dashboard', 'task', 'reminder', 'project', 'allprojects', 'Teams'].map((link) => {
              const paths = {
                dashboard: '/',
                task: '/task',
                reminder: '/reminder',
                project: '/project',
                allprojects: '/newproject',
                Teams: '/Teams'
              };
              
              const labels = {
                dashboard: 'Dashboard',
                task: 'Task',
                reminder: 'Reminder',
                project: 'Projects',
                allprojects: 'All Projects',
                Teams: 'Teams'
              };
              
              return (
                <Link
                  key={link}
                  to={paths[link]}
                  className={`py-3 px-4 transition-colors duration-200 rounded-lg ${
                    activeLink === link 
                      ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSetActive(link)}
                >
                  {labels[link]}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;