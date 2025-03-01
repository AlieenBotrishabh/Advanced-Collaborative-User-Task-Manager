import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { AlertTriangle, Clock, GitBranch, Trash2, FileText, Bell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// Update socket connection to match backend CORS settings
const socket = io('http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket', 'polling']
});

const CustomAlert = ({ message }) => (
    <div className="bg-red-500 text-white px-4 py-3 rounded-md mb-4">
        <span>{message}</span>
    </div>
);

const NotificationBanner = ({ message, onDismiss }) => (
    <div className="fixed top-20 right-4 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg max-w-md z-50 flex items-center justify-between">
        <div className="flex items-center">
            <Bell className="w-5 h-5 mr-3" />
            <span>{message}</span>
        </div>
        <button 
            onClick={onDismiss} 
            className="ml-4 text-white hover:text-blue-200"
        >
            ×
        </button>
    </div>
);

const AnalyticsChart = ({ analyticsData, error }) => {
    const fallbackData = [
        { date: '2024-01', updates: 12 },
        { date: '2024-02', updates: 19 },
        { date: '2024-03', updates: 15 },
        { date: '2024-04', updates: 25 },
        { date: '2024-05', updates: 22 },
        { date: '2024-06', updates: 30 }
    ];

    const displayData = error ? fallbackData : analyticsData;

    return (
        <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-xl shadow-lg mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Project Activity</h2>
                {error && (
                    <div className="flex items-center text-yellow-400 text-sm">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span>Using sample data - Unable to load analytics</span>
                    </div>
                )}
            </div>
            <LineChart width={800} height={300} data={displayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} 
                    labelStyle={{ color: '#9CA3AF' }} 
                />
                <Legend />
                <Line 
                    type="monotone" 
                    dataKey="updates" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    name="Project Updates" 
                />
            </LineChart>
        </div>
    );
};

function NewProject() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analyticsData, setAnalyticsData] = useState([]);
    const [analyticsError, setAnalyticsError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [notificationTimers, setNotificationTimers] = useState({});

    useEffect(() => {
        socket.on('projectUpdated', (updatedProject) => {
            setProjects(prev =>
                prev.map(project =>
                    project._id === updatedProject._id ? updatedProject : project
                )
            );
            fetchAnalytics();
        });
    
        return () => {
            socket.off('projectUpdated');
        };
    }, []);

    useEffect(() => {
        fetchProjects();
        fetchAnalytics();

        // Set up socket connection status
        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));
        setConnected(socket.connected);

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            // Clear all timers when component unmounts
            Object.values(notificationTimers).forEach(timer => clearTimeout(timer));
        };
    }, []);

    // Set up deadline notification timers whenever projects change
    useEffect(() => {
        // Clear existing timers first
        Object.values(notificationTimers).forEach(timer => clearTimeout(timer));
        const newTimers = {};
        
        projects.forEach(project => {
            const deadlineTime = new Date(project.deadline).getTime();
            const tenMinutesBefore = deadlineTime - (10 * 60 * 1000);
            const now = new Date().getTime();
            
            // Only set timer if deadline is in the future and project is not completed
            if (tenMinutesBefore > now && project.status !== 'completed') {
                const timeUntilNotification = tenMinutesBefore - now;
                
                newTimers[project._id] = setTimeout(() => {
                    const notificationMessage = `Deadline approaching in 10 minutes: ${project.name}`;
                    setNotifications(prev => [...prev, { id: Date.now(), message: notificationMessage, projectId: project._id }]);
                    
                    // Play notification sound if browser supports it
                    try {
                        const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU9vT18=');
                        audio.play();
                    } catch (e) {
                        console.log('Notification sound not supported');
                    }
                }, timeUntilNotification);
            }
        });
        
        setNotificationTimers(newTimers);
        
        return () => {
            // Clean up timers when dependency changes
            Object.values(newTimers).forEach(timer => clearTimeout(timer));
        };
    }, [projects]);

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:5000/projects');
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const data = await response.json();
            setProjects(data);
            setError(null);
        } catch (err) {
            setError('Failed to load projects');
            console.error(err);
        }
    };

    const deleteProject = async (projectId) => {
        try {
            const response = await fetch(`http://localhost:5000/projects/${projectId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete project');
            }
            
            // Remove project from state
            setProjects(prev => prev.filter(project => project._id !== projectId));
            
            // Clear notification timer for this project
            if (notificationTimers[projectId]) {
                clearTimeout(notificationTimers[projectId]);
                const updatedTimers = { ...notificationTimers };
                delete updatedTimers[projectId];
                setNotificationTimers(updatedTimers);
            }
            
            // Remove any notifications for this project
            setNotifications(prev => prev.filter(notification => notification.projectId !== projectId));
            
            // Refresh analytics after deletion
            fetchAnalytics();
        } catch (err) {
            setError('Failed to delete project');
            console.error(err);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('http://localhost:5000/projects/analytics');
            if (!response.ok) {
                throw new Error('Failed to fetch analytics');
            }
            const data = await response.json();
            setAnalyticsData(data);
            setAnalyticsError(null);
        } catch (err) {
            setAnalyticsError('Failed to load analytics');
            console.error(err);
        }
    };

    const navigateToNotes = (projectId) => {
        navigate(`/notes/${projectId}`);
    };
    
    const updateProjectStatus = async (projectId, status, progress) => {
        try {
            const response = await fetch(`http://localhost:5000/projects/${projectId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ status, progress, timestamp: new Date().toISOString() })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error Response:", errorData);
                throw new Error(errorData.message || 'Failed to update project');
            }
    
            const updatedProject = await response.json();
            setProjects(prev =>
                prev.map(project =>
                    project._id === projectId ? updatedProject : project
                )
            );
            fetchAnalytics();
        } catch (err) {
            console.error('Update project error:', err);
            setError(err.message || 'Failed to update project');
        }
    };

    const dismissNotification = (notificationId) => {
        setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
    };

    const getRemainingTime = (deadline) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffMs = deadlineDate - now;
        
        if (diffMs <= 0) return "Overdue";
        
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffDays > 0) {
            return `${diffDays}d ${diffHours}h remaining`;
        } else if (diffHours > 0) {
            return `${diffHours}h ${diffMinutes}m remaining`;
        } else {
            return `${diffMinutes}m remaining`;
        }
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const ProjectCard = ({ project }) => {
        const remainingTime = getRemainingTime(project.deadline);
        const isNearDeadline = 
            new Date(project.deadline) - new Date() < 24 * 60 * 60 * 1000 && // less than 24 hours
            new Date(project.deadline) > new Date() && // not overdue
            project.status !== 'completed';
            
        return (
            <div className="w-full md:w-[500px] h-auto border border-gray-700 rounded-xl shadow-lg overflow-hidden bg-gray-800 hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-white">{project.name}</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <GitBranch className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-400">{project.language}</span>
                            </div>
                            <button
                                onClick={() => navigateToNotes(project._id)}
                                className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                                title="Project Notes"
                            >
                                <FileText className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => deleteProject(project._id)}
                                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                title="Delete Project"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Clock className={`w-5 h-5 ${isNearDeadline ? 'text-yellow-400' : 'text-gray-400'}`} />
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-400">
                                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                                </span>
                                <span className={`text-xs ${isNearDeadline ? 'text-yellow-400 font-semibold' : 'text-gray-500'}`}>
                                    {remainingTime}
                                </span>
                            </div>
                        </div>
        
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Progress</span>
                                <span>{project.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        isNearDeadline && project.progress < 50 ? 'bg-yellow-600' : 'bg-blue-600'
                                    }`}
                                    style={{ width: `${project.progress || 0}%` }}
                                />
                            </div>
                        </div>
        
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => updateProjectStatus(project._id, 'pending', 0)}
                                className="flex-1 px-3 py-2 text-sm bg-yellow-900 text-yellow-300 rounded-lg hover:bg-yellow-800 transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => updateProjectStatus(project._id, 'in-progress', 50)}
                                className="flex-1 px-3 py-2 text-sm bg-blue-900 text-blue-300 rounded-lg hover:bg-blue-800 transition-colors"
                            >
                                In Progress
                            </button>
                            <button
                                onClick={() => updateProjectStatus(project._id, 'completed', 100)}
                                className="flex-1 px-3 py-2 text-sm bg-green-900 text-green-300 rounded-lg hover:bg-green-800 transition-colors"
                            >
                                Complete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-900 text-white">
                <div className="container mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-6">
                            <h1 className="text-3xl font-bold">Project Dashboard</h1>
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="text-sm mt-2 text-gray-400">
                            Status: {connected ? <span className="text-green-500">Connected</span> : <span className="text-red-500">Disconnected</span>}
                        </div>
                    </div>

                    {error && <CustomAlert message={error} />}
                    <AnalyticsChart analyticsData={analyticsData} error={analyticsError} />
                    
                    <div className="w-full flex flex-wrap gap-6 justify-center">
                        {filteredProjects.length > 0 ? filteredProjects.map((project) => (
                            <ProjectCard key={project._id} project={project} />
                        )) : (
                            <p className="text-gray-400">No projects available.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Notification banners */}
            {notifications.map((notification) => (
                <NotificationBanner 
                    key={notification.id}
                    message={notification.message}
                    onDismiss={() => dismissNotification(notification.id)}
                />
            ))}
            <Footer />
        </>
    );
}

export default NewProject;