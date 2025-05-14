import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const LoginPage = () => {
    const navigate = useNavigate();

    const [empid, setEmpid] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Employee');
    const [taskId, setTaskId] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ empid, password, email, role, taskId }),
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
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-200 flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-md p-8 sm:p-10 bg-white/70 backdrop-blur-md shadow-xl rounded-xl border border-gray-200">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back 👋</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="empid" className="block mb-1 text-sm font-medium text-gray-700">Employee ID</label>
                            <input
                                id="empid"
                                type="text"
                                value={empid}
                                onChange={(e) => setEmpid(e.target.value)}
                                required
                                disabled={isLoading}
                                placeholder="Enter your employee ID"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        <div>
                            <label htmlFor="taskId" className="block mb-1 text-sm font-medium text-gray-700">Task ID (optional)</label>
                            <input
                                id="taskId"
                                type="text"
                                value={taskId}
                                onChange={(e) => setTaskId(e.target.value)}
                                disabled={isLoading}
                                placeholder="Enter task ID"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 text-center">{error}</div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:bg-blue-300"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className="text-sm text-center mt-6">
                        Don't have an account?
                        <Link to="/register" className="text-blue-600 font-semibold ml-1 hover:underline">Sign Up</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LoginPage;
