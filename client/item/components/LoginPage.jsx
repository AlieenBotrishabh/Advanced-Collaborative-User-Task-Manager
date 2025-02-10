import React from 'react'

const LoginPage = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
    <form className='w-full sm:w-1/3 md:w-1/4 bg-white p-8 rounded-lg shadow-lg' action="http://localhost:5000/api/auth/login" method='POST'>
        <div className='text-center mb-6'>
            <div className='text-3xl font-bold text-gray-800'>Login</div>
        </div>

        <div className='flex flex-col space-y-4'>
            <div>
                <label className='text-lg font-medium text-gray-700' htmlFor="employeeId">Employee Id</label>
                <input 
                    className='w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition duration-300' 
                    type="text" 
                    id="employeeId" 
                    name='EmployeeId' 
                    placeholder='Employee Id' 
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
                    required 
                />
            </div>

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