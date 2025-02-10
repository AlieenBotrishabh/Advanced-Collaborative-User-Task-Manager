import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className='Home bg-gray-800 bg-cover bg-center font-sans w-full h-screen min-h-screen flex flex-col'>
  
  {/* Navbar */}
  <nav className='bg-gray-800 w-full h-14 p-4'>
    <div className='flex justify-between items-center'>
      <div className='text-pink-600 text-2xl font-bold'>Task
        <span className='text-white'> Flow </span>
      </div>
      <div className='space-x-20 text-xl'>
        <Link className='text-gray-300 hover:text-white' to="/">Home</Link>
        <Link className='text-gray-300 hover:text-white' to="/task">Task</Link>
        <Link className='text-gray-300 hover:text-white' to="#">About Us</Link>
        <button className='bg-blue-600 text-white px-4 py-1 rounded-lg text-lg hover:bg-blue-700 transition duration-300'>Login</button>
      </div>
    </div>
  </nav>

  {/* Home Page Content - Now Below the Navbar */}
  <div className='flex-grow w-full bg-white flex flex-col justify-center items-center'>
    <h1 className='text-4xl font-bold text-gray-800 mb-4'>Manage, Organize, and Prioritize Your Tasks</h1>
    <p className='text-lg text-gray-600 mb-6'>Stay productive with our easy-to-use task management system.</p>
    <button className='bg-green-600 text-white px-6 py-2 rounded-lg text-lg hover:bg-green-700 transition duration-300'>
      Get Started
    </button>
  </div>

</div>
  )
}

export default HomePage