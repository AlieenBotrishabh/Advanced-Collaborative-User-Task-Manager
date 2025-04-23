import { useState, useEffect } from 'react';
import { User, Calendar, Mail, Shield, LogOut, Activity, Clock } from 'lucide-react';
import Navbar from './Navbar';

export default function Users() {
  const [user, setUser] = useState(null);
  const [loginTime, setLoginTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      // If token exists, check if login timestamp is present, if not, store it
      if (!localStorage.getItem('loginTimestamp')) {
        localStorage.setItem('loginTimestamp', new Date().toISOString());
      }
      setLoginTime(new Date(localStorage.getItem('loginTimestamp')));
      fetchUserData(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        // If the user is not found, use localStorage data (demo user fallback)
        const savedUserData = localStorage.getItem('userData');
        if (savedUserData) {
          setUser(JSON.parse(savedUserData));
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      const savedUserData = localStorage.getItem('userData');
      if (savedUserData) {
        setUser(JSON.parse(savedUserData));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all data and redirect to login page
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('loginTimestamp');
    window.location.href = '/login';
  };

  const formatTime = (date) => new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);

  const formatDate = (date) => new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);

  const getSessionDuration = () => {
    if (!loginTime) return 'N/A';
    const now = new Date();
    const diffMs = now - loginTime;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Active User</h2>
            <Activity className="text-white" />
          </div>
        </div>

        {user ? (
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-500 p-4 rounded-full text-white">
                <User size={28} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield size={14} className="mr-1" />
                  <span>{user.role || 'Employee'}</span>
                </div>
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <Mail className="mr-3 text-blue-500" size={20} />
                <span>{user.email}</span>
              </li>
              <li className="flex items-center text-gray-700">
                <User className="mr-3 text-blue-500" size={20} />
                <span>ID: {user.empid}</span>
              </li>
              <li className="flex items-center text-gray-700">
                <Calendar className="mr-3 text-blue-500" size={20} />
                <span>Login Date: {loginTime ? formatDate(loginTime) : 'N/A'}</span>
              </li>
              <li className="flex items-center text-gray-700">
                <Clock className="mr-3 text-blue-500" size={20} />
                <span>Login Time: {loginTime ? formatTime(loginTime) : 'N/A'}</span>
              </li>
              <li className="flex items-center text-gray-700">
                <Activity className="mr-3 text-blue-500" size={20} />
                <span>Session Duration: {getSessionDuration()}</span>
              </li>
            </ul>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-300"
            >
              <LogOut size={18} className="mr-2" />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-600">
            <p>No active user found. Please login.</p>
            <a href="/login" className="text-blue-500 hover:underline mt-2 inline-block">
              Go to Login
            </a>
          </div>
        )}
      </div>
    </>
  );
}
