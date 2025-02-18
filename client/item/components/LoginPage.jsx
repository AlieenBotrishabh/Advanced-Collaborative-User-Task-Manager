import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [empid, setEmpid] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [serverStatus, setServerStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {

            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ empid, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('accessToken', data.accessToken);
                navigate('/task');
            } else {
                setError(data.msg || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (!navigator.onLine) {
                setError('You are offline. Please check your internet connection.');
            } else if (serverStatus !== 'connected') {
                setError('Cannot reach the server. Please ensure the backend server is running.');
            } else {
                setError('Network error. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        <Navbar />
        <div className='flex items-center justify-center min-h-screen bg-white'>
            <form className='w-full sm:w-1/3 md:w-2/4 bg-white p-8 rounded-lg shadow-lg' onSubmit={handleSubmit}>
                <div className='text-center mb-6'>
                    <div className='text-3xl font-bold text-gray-800'>Login to Existing Account</div>
                </div>

                <div className='flex flex-col space-y-4'>
                    <div>
                        <label className='text-lg font-medium text-gray-700' htmlFor="empid">
                            Username
                        </label>
                        <input
                            className='w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition duration-300'
                            type="text"
                            placeholder='Username'
                            id="empid"
                            value={empid}
                            onChange={(e) => setEmpid(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className='text-lg font-medium text-gray-700' htmlFor="password">
                            Password
                        </label>
                        <input
                            className='w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition duration-300'
                            type="password"
                            placeholder='Password'
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <div className='text-red-500 text-center'>{error}</div>
                    )}

                    <button
                        type="submit"
                        className='w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none transition duration-300 disabled:bg-blue-300'
                        disabled={isLoading || serverStatus === 'disconnected'}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </div>

                <div className='flex justify-center items-end m-2'>
                    <p className='mr-2'>Not Having Account</p>
                    <Link to='/register'><span className='text-blue-500'>Sign Up</span></Link>
                </div>
            </form>
        </div>
        </>
    );
};

export default LoginPage;