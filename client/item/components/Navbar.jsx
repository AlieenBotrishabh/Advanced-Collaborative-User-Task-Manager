import React from 'react';
import { Link } from 'react-router';
import image from '../assets/A.png';

const Navbar = () => {
  return (
          <nav className="bg-white shadow-sm rounded-lg p-4 flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-indigo-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75V19.5a.75.75 0 00.75.75H9.75a.75.75 0 00.75-.75v-4.125c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125V19.5a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V9.75"
                  />
                </svg>
              </div>
      
              {/* Nav Links */}
              <div className="flex space-x-6 text-gray-500">
                <Link to="/" className="text-black hover:text-black hover:border-b-2 hover:border-indigo-500 pb-1">
                  Dashboard
                </Link>
                <Link to="/task" className="text-black hover:text-black hover:border-b-2 hover:border-indigo-500 pb-1">Task</Link>
                <Link to="/project" className="text-black hover:text-black hover:border-b-2 hover:border-indigo-500 pb-1">Projects</Link>
                <Link to="/calender" className="text-black hover:text-black hover:border-b-2 hover:border-indigo-500 pb-1">Calender</Link>
              </div>
            </div>
      
            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="border rounded-lg pl-10 pr-4 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="absolute left-3 top-1.5 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                    />
                  </svg>
                </div>
              </div>
      
              {/* Notification Icon */}
              <button className="text-indigo-500 hover:text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.25 17.25v1.5a2.25 2.25 0 11-4.5 0v-1.5m9-5.25c0-3.45-2.126-6-6.75-6s-6.75 2.55-6.75 6v4.5L4.5 17.25h15l-1.5-1.5v-4.5z"
                  />
                </svg>
              </button>
      
              {/* Profile Picture */}
              <img className="w-6 h-6" src={image} alt="Logo" />
            </div>
          </nav>
  )
}

export default Navbar