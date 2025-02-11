import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const HomePage = () => {
  return (
    <>
    <div className='Home bg-white bg-cover bg-center font-sans w-full h-screen min-h-screen flex flex-col'>
      <Navbar />
  {/* Home Page Content - Now Below the Navbar */}
  <div className='flex-grow w-full bg-white flex flex-col justify-center items-center'>
    <h1 className='text-5xl font-bold text-gray-800 mb-4'>
        Manage Organize, and Prioritize Your Tasks</h1>
    <p className='text-xl text-gray-800 mb-6'>Stay productive with our easy-to-use task management system.</p>
    <Link className='bg-green-600 text-white px-6 py-2 rounded-lg text-lg hover:bg-green-700 transition duration-300' to="/register">
    Get Started
    </Link>
  </div>
</div>
</>
  )
}

export default HomePage