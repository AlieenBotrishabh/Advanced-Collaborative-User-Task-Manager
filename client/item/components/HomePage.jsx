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

<div className='w-full h-full bg-black p-4 mb-4'>
  <div className='w-full h-[200px] flex items-center justify-center'>
  <h1 className='text-5xl font-bold text-white'>About Us</h1>
  </div>
  <div className='w-full h-[1000px] p-4'>
    <div className='w-full h-2/4 border border-gray-600 rounded-lg flex flex-row items-center p-4 mb-4'>
    <div className='w-2/4 h-[400px] border border-gray-600 rounded-lg'>
      <img src="" alt="image" />
    </div>
    <div className='w-2/4 h-[400px] flex flex-col items-center p-4'>
      <h1 className='text-5xl font-bold text-white p-2'>Rishabh Kumar</h1>
      <h2 className='text-xl text-green-500 p-2'>A CS Student in India</h2>
      <p className='text-xl text-gray-700 p-2'>Hi devs, My name is Rishabh Kumar. I am passionate CS undergrad who is keen to develop and solve problem through my projects</p>
    </div>
    </div>

    <div className='w-full h-2/4 border border-gray-600 rounded-lg flex flex-row items-center p-4 mb-4'>

    <div className='w-2/4 h-[400px] flex flex-col items-center p-4'>
      <h1 className='text-5xl font-bold text-white p-2'>Rishabh Kumar</h1>
      <h2 className='text-xl text-green-500 p-2'>A CS Student in India</h2>
      <p className='text-xl text-gray-700 p-2'>Hi devs, My name is Rishabh Kumar. I am passionate CS undergrad who is keen to develop and solve problem through my projects</p>
    </div>
    
    <div className='w-2/4 h-[400px] border border-gray-600 rounded-lg'>
      <img src="" alt="image" />
    </div>
    

    
  </div>

<div className='flex justify-center items-center'>
<h2 className='text-5xl font-bold p-4 m-4'>Find us at this location</h2>
</div>

  <div className='flex justify-center items-center p-4 m-4'>
  <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83937457612!2d77.06889901730158!3d28.527582007475844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03bc9a1b5c41%3A0x29589a0e67ff54b2!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1618372206398!5m2!1sen!2sin"
        style={{ width: "78%", height: "400px", border: "0" }}
        allowFullScreen
        loading="lazy"
      ></iframe>
  </div>

    

    
  </div>
</div>

</>
  )
}

export default HomePage