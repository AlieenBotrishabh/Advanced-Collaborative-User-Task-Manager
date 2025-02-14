import React from 'react';
import Navbar from './Navbar';
import image3 from '../assets/A3.gif';
import { Link } from 'react-router';

const Projects = () => {
  return (
    <>
      <Navbar />
      <div className='w-full h-full bg-black text-white flex flex-col items-center'>
        <div className='w-full h-[100px] flex justify-center items-center border-gray-800 border-b-2'>
          <h1 className='text-5xl font-bold'>Welcome to Projects!</h1>
        </div>

        <div className='w-full h-[700px] flex flex-col items-center'>
          <div className='w-full h-[700px] flex justify-center items-center p-4 m-4 relative'>
            <div className=''></div>
          </div>
          <div className='w-full h-2/4 flex justify-center items-center'>
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;
