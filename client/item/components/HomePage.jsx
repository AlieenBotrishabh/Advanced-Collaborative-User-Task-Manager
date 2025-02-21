import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import image7 from '../assets/A7.png';
import image8 from '../assets/A8.png';
import image9 from '../assets/A9.png';

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

<div className='w-full bg-gray-900 p-4 m-4 flex flex-col items-center'>
  <div className='flex justify-center items-center'>
    <h1 className='text-white text-5xl font-bold p-4 m-4'>Key Features</h1>
  </div>

  <div className='w-full flex flex-row items-center p-4 m-4 space-x-4'>
    {/* Card 1 - Create tasks */}
    <div className='w-[400px] h-[300px] bg-gray-900 flex flex-col items-center border border-gray-600 rounded-xl 
                    shadow-md transition-all duration-300 ease-in-out 
                    hover:scale-105 hover:border-gray-400 hover:shadow-lg hover:bg-white group'>
      <div className='w-full h-2/5 flex justify-center items-center p-2'>
        <img src={image7} alt="" className='w-[80px] transition-transform duration-300 hover:scale-110' />
      </div>
      <div className='w-full h-3/5 flex flex-col items-center p-6'>
        <h2 className='text-white text-2xl font-semibold group-hover:text-black transition-colors duration-300'>Create tasks</h2>
        <p className='text-gray-400 text-lg text-center leading-relaxed group-hover:text-black transition-colors duration-300'>
          Save your Daily Activity and analyze your daily progress
        </p>
      </div>
    </div>

    {/* Card 2 - Collaborate */}
    <div className='w-[400px] h-[300px] bg-gray-900 flex flex-col items-center border border-gray-600 rounded-xl 
                    shadow-md transition-all duration-300 ease-in-out 
                    hover:scale-105 hover:border-gray-400 hover:shadow-lg hover:bg-white group'>
      <div className='w-full h-2/5 flex justify-center items-center p-2'>
        <img src={image8} alt="" className='w-[80px] transition-transform duration-300 hover:scale-110' />
      </div>
      <div className='w-full h-3/5 flex flex-col items-center p-6'>
        <h2 className='text-white text-2xl font-semibold group-hover:text-black transition-colors duration-300'>Collaborate</h2>
        <p className='text-gray-400 text-lg text-center leading-relaxed group-hover:text-black transition-colors duration-300'>
          Collaboration with other users and update progress of other user's tasks
        </p>
      </div>
    </div>

    {/* Card 3 - Reminders */}
    <div className='w-[400px] h-[300px] bg-gray-900 flex flex-col items-center border border-gray-600 rounded-xl 
                    shadow-md transition-all duration-300 ease-in-out 
                    hover:scale-105 hover:border-gray-400 hover:shadow-lg hover:bg-white group'>
      <div className='w-full h-2/5 flex justify-center items-center p-2'>
        <img src={image9} alt="" className='w-[80px] transition-transform duration-300 hover:scale-110' />
      </div>
      <div className='w-full h-3/5 flex flex-col items-center p-6'>
        <h2 className='text-white text-2xl font-semibold group-hover:text-black transition-colors duration-300'>Reminders</h2>
        <p className='text-gray-400 text-lg text-center leading-relaxed group-hover:text-black transition-colors duration-300'>
          Get reminders with deadlines assigned to each task and project
        </p>
      </div>
    </div>
  </div>
</div>


  <div className='w-full h-[200px] flex items-center justify-center'>
  <h1 className='text-5xl font-bold text-white'>Meet The Creator</h1>
  </div>
  <div className='w-full p-4'>
    <div className='w-full h-2/4 border border-gray-600 rounded-lg flex flex-row items-center p-4 mb-4'>
    <div className='w-2/4 h-[400px] border border-gray-600 rounded-lg'>
      <img src="" alt="image" />
    </div>
    <div className='w-2/4 h-[400px] flex flex-col items-center p-4'>
      <h1 className='text-5xl font-bold text-white p-2'>Rishabh Kumar</h1>
      <p className='text-xl text-gray-400 p-2'>Hi devs, My name is Rishabh Kumar. I am passionate CS undergrad who is keen to develop and solve problem through my projects</p>
    </div>
    </div>

  </div>
  <Footer />
  <div className='bg-black text-white flex flex-col items-center p-4 m-4'>
  <div className='flex justify-center items-center'>
<h2 className='text-5xl font-bold p-4 m-4'>Find us at this location</h2>
</div>
  </div>
</div>
</>
  )
}

export default HomePage