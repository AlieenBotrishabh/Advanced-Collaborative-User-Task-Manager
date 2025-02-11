import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className='Home bg-white bg-cover bg-center font-sans w-full h-screen min-h-screen flex flex-col'>
  
  {/* Navbar */}
  <nav className='bg-white w-full h-14 p-4'>
    <div className='flex justify-between items-center'>
      <div className='text-pink-600 text-2xl font-bold'>Task
        <span className='text-gray-800'> Flow </span>
      </div>
      <div className='space-x-20 text-xl'>
        <Link className='text-gray-800 hover:text-white' to="/">Home</Link>
        <Link className='text-gray-800 hover:text-white' to="/task">Task</Link>
        <Link className='text-gray-800 hover:text-white' to="#">About Us</Link>
        <Link className='bg-blue-600 text-white px-4 py-1 rounded-lg text-lg hover:bg-blue-700 transition duration-300' to="/login">Login</Link>
      </div>
    </div>
  </nav>

  {/* Home Page Content - Now Below the Navbar */}
  <div className='flex-grow w-full bg-white flex flex-col justify-center items-center'>
    <h1 className='text-4xl font-bold text-gray-800 mb-4'>
        <span className='text-pink-600'>Manage</span>, Organize, and 
        <span className='text-blue-600'> Prioritize</span> Your Tasks</h1>
    <p className='text-lg text-gray-800 mb-6'>Stay productive with our easy-to-use task management system.</p>
    <Link className='bg-green-600 text-white px-6 py-2 rounded-lg text-lg hover:bg-green-700 transition duration-300' to="/register">
    Get Started
    </Link>
  </div>
</div>
  )
}

export default HomePage