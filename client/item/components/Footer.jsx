import React from 'react';
import { Link } from 'react-router';
import image4 from '../assets/A4.png';
import image5 from '../assets/A5.png';

const Footer = () => {
  return (
    <div className='w-full bg-black flex flex-col space-y-2 items-center p-4 m-4'>
        <h1 className='text-white text-xl'>Follow me GitHub and LinkedIn</h1>
        <Link to='https://github.com/AlieenBotrishabh'>
        <img src={image4} lt="image" className="w-[40px] transition-transform duration-300 ease-in-out hover:scale-125" />
        </Link>
        <Link to='https://www.linkedin.com/in/rishabh-kumar-932692291/'>
        <img src={image5} alt="" className='w-[40px] transition-transform duration-300 ease-in-out hover:scale-125' />
        </Link>
    </div>
  )
}

export default Footer