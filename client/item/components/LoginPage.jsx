import React from 'react';
import { useState, useNavigate } from 'react-router';

const LoginPage = () => {

    const navigate = useNavigate();
  const [empid, setEmpid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      empid,
      password,
    };

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken); // Store the token
        navigate('/home'); // Redirect to the home page
      } else {
        setError(data.msg); // Show error message if login fails
      }
    } catch (err) {
      console.log('An error occurred:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100' onSubmit={handleSubmit}>
    <form className='w-full sm:w-1/3 md:w-1/4 bg-white p-8 rounded-lg shadow-lg'>
        <div className='text-center mb-6'>
            <div className='text-3xl font-bold text-gray-800'>Login</div>
        </div>

        <div className='flex flex-col space-y-4'>
            <div>
                <label className='text-lg font-medium text-gray-700' htmlFor="employeeId">Employee Id</label>
                <input 
                    className='w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition duration-300' 
                    type="text" 
                    id="empid" 
                    name="empid"
                    placeholder='Employee Id' 
                    onChange={(e) => setEmpid(e.target.value)}
                    required 
                />
            </div>

            <div>
                <label className='text-lg font-medium text-gray-700' htmlFor="password">Password</label>
                <input 
                    className='w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition duration-300' 
                    type="password" 
                    id="password" 
                    name='password' 
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
            </div>

            {error && <div className='text-red-500 text-center'>{error}</div>}

            <div className='mt-6'>
                <button 
                    type="submit"
                    className='w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none transition duration-300'
                >
                    Login
                </button>
            </div>
        </div>
    </form>
</div>
  )
}

export default LoginPage