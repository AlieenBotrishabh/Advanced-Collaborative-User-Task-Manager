import React from 'react';
import { Link } from 'react-router';
import image from '../assets/A.png';
import image6 from '../assets/A6.png'

const Navbar = () => {
  return (
          <nav className="bg-white shadow-sm rounded-lg p-4 flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <Link to='/'>
                <img src={image6} alt="" className='w-[40px] rounded-2xl' />
                </Link>
              </div>
      
              {/* Nav Links */}
              <div className="flex space-x-6 text-gray-500">
                <Link to="/" className="text-black hover:text-black hover:border-b-2 hover:border-indigo-500 pb-1">
                  Dashboard
                </Link>
                <Link to="/task" className="text-black hover:text-black hover:border-b-2 hover:border-indigo-500 pb-1">Task</Link>
                <Link to="/project" className="text-black hover:text-black hover:border-b-2 hover:border-indigo-500 pb-1">Projects</Link>
                <Link to="/calender" className="text-black hover:text-black hover:border-b-2 hover:border-indigo-500 pb-1">Calender</Link>
                <Link to="/newproject" className="text-black hover:text-black hover:border-b-2 hover:border-indigo-500 pb-1">All Projects</Link>
              </div>
            </div>
      
            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <Link to='/login' className='w-[100px] bg-indigo-500 hover:bg-indigo-600 text-white text-center rounded-lg p-2'>Login</Link>
                <div className="absolute left-3 top-1.5 text-gray-400">
              </div>
      
              {/* Profile Picture */}
              <img className="w-6 h-6" src={image} alt="Logo" />
            </div>
          </nav>
  )
}

export default Navbar