import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const HomePage = () => {
  return (
    <>
    <div className='Home bg-white bg-cover bg-center font-sans w-full h-full min-h-screen flex flex-col'>
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

<div className='w-full h-full bg-black'>
  <div className='w-full h-[200px] flex items-center justify-center'>
  <h1 className='text-5xl font-bold text-white'>About Us</h1>
  </div>
  <div className='w-full h-[1000px] p-4'>
    <div className='w-full h-2/4 border border-gray-600 rounded-lg flex flex-row items-center p-4'>
    <div className='w-2/4 h-[400px] border border-gray-600 rounded-lg'>
      <img src="" alt="image" />
    </div>
    <div className='w-2/4 h-[400px] flex flex-col items-center p-4'>
      <h1 className='text-5xl font-bold text-white p-2'>Rishabh Kumar</h1>
      <h2 className='text-xl text-green-500 p-2'>A CS student in India</h2>
      <p className='text-xl text-gray-700 p-2'>Hi devs, My name is Rishabh Kumar. I am passionate CS undergrad who is keen to develop and solve problem through my projects</p>
    </div>
    </div>
  </div>
</div>

</>
  )
}

export default HomePage