import { useState, useEffect } from 'react';
import { User, Calendar, Mail, Shield, LogOut, Activity, Clock, Users as UsersIcon } from 'lucide-react';
import Navbar from './Navbar';

export default function Users() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
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
      fetchActiveUsers();
    } else {
      setIsLoading(false);
    }
    
    // Set up polling for active users
    const interval = setInterval(() => {
      fetchActiveUsers();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
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
        setCurrentUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        // If the user is not found, use localStorage data (demo user fallback)
        const savedUserData = localStorage.getItem('userData');
        if (savedUserData) {
          setCurrentUser(JSON.parse(savedUserData));
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      const savedUserData = localStorage.getItem('userData');
      if (savedUserData) {
        setCurrentUser(JSON.parse(savedUserData));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActiveUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/auth/active-users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const users = await response.json();
        setActiveUsers(users);
      }
    } catch (error) {
      console.error('Error fetching active users:', error);
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
  }).format(new Date(date));

  const formatDate = (date) => new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));

  const getSessionDuration = (startTime) => {
    if (!startTime) return 'N/A';
    const now = new Date();
    const start = new Date(startTime);
    const diffMs = now - start;
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
      <div className="max-w-6xl mx-auto mt-8 px-4">
        {/* Current User Card */}
        <div className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Your Session</h2>
              <User className="text-white" />
            </div>
          </div>

          {currentUser ? (
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-500 p-4 rounded-full text-white">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{currentUser.name}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield size={14} className="mr-1" />
                    <span>{currentUser.role || 'Employee'}</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <Mail className="mr-3 text-blue-500" size={20} />
                  <span>{currentUser.email}</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <User className="mr-3 text-blue-500" size={20} />
                  <span>ID: {currentUser.empid}</span>
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
                  <span>Session Duration: {getSessionDuration(loginTime)}</span>
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

        {/* Active Users Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-teal-700 p-5">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Active Users</h2>
              <UsersIcon className="text-white" />
            </div>
          </div>

          <div className="p-6">
            {activeUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeUsers.map((user) => (
                  <div key={user._id || user.empid} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-full ${user.empid === currentUser?.empid ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
                        <User size={18} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{user.name}</h4>
                        <span className="text-xs text-gray-500">{user.role || 'Employee'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail size={14} className="mr-2 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User size={14} className="mr-2 text-gray-400" />
                        <span>ID: {user.empid}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock size={14} className="mr-2 text-gray-400" />
                        <span>Last Active: {formatTime(user.lastActive)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Activity size={14} className="mr-2 text-gray-400" />
                        <span>Session: {getSessionDuration(user.loginTimestamp)}</span>
                      </div>
                    </div>
                    
                    {user.empid === currentUser?.empid && (
                      <div className="mt-2 text-xs bg-green-100 text-green-800 py-1 px-2 rounded text-center">
                        This is you
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UsersIcon size={40} className="mx-auto mb-4 text-gray-300" />
                <p>No other users are currently active</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}