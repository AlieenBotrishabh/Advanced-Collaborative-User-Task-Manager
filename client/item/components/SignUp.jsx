import React from 'react';
import { useNavigate } from 'react-router';
import Navbar from './Navbar';
import { Link } from 'react-router';

const SignUp = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        console.log(data);

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                navigate('/login');
            } else {
                const errorData = await response.json();
                console.log(errorData.msg);
            }
        } catch (err) {
            console.log(`An error occurred: ${err}`);
        }
    };

    return (
        <>
        <Navbar />
        <div className='flex items-center justify-center min-h-screen bg-white'>
            <form className='w-full sm:w-1/3 md:w-2/4 bg-white p-8 rounded-lg shadow-lg' onSubmit={handleSubmit}>
                <div className='text-center mb-6'>
                    <div className='text-3xl font-bold text-gray-800'>Sign Up</div>
                </div>
                <div className='flex flex-col space-y-4'>
                    <div>
                        <label className='text-lg font-medium text-gray-700' htmlFor="empid">Username</label>
                        <input
                            className='w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition duration-300'
                            type="text"
                            id="empid"
                            name='empid'
                            placeholder='Username'
                            required
                        />
                    </div>

                    <div>
                        <label className='text-lg font-medium text-gray-700' htmlFor="name">Name</label>
                        <input
                            className='w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition duration-300'
                            type="text"
                            id="name"
                            name='name'
                            placeholder='Name'
                            required
                        />
                    </div>

                    <div>
                        <label className='text-lg font-medium text-gray-700' htmlFor="email">Email</label>
                        <input
                            className='w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition duration-300'
                            type="email"
                            id="email"
                            name='email'
                            placeholder='Type your registered email'
                            required
                        />
                    </div>

                    <div>
                        <label className='text-lg font-medium text-gray-700' htmlFor="password">Password</label>
                        <input
                            className='w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition duration-300'
                            type="password"
                            id="password"
                            name="password"
                            placeholder='Password'
                            required
                        />
                    </div>

                    <div className='mt-6'>
                        <button
                            type="submit"
                            className='w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none transition duration-300'
                        >
                            Sign Up
                        </button>
                    </div>
                    <div className='flex justify-center items-end'>
                        <p className='mr-2'>Already have an account</p>
                        <Link to='/login' className='text-blue-500'>Log In</Link>
                    </div>
                </div>
            </form>
        </div>
        </>
    );
};

export default SignUp;
