import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { AlertTriangle, Clock, GitBranch, Trash2, FileText, Bell, Layout, ArrowUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// Update socket connection to match backend CORS settings
const socket = io('http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket', 'polling']
});

const CustomAlert = ({ message }) => (
    <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-4 rounded-lg mb-6 shadow-lg flex items-center">
        <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
    </div>
);

const NotificationBanner = ({ message, onDismiss }) => (
    <div className="fixed top-20 right-4 bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-4 rounded-lg shadow-xl max-w-md z-50 flex items-center justify-between backdrop-blur-sm border border-blue-400 border-opacity-30">
        <div className="flex items-center">
            <Bell className="w-5 h-5 mr-3 text-blue-200" />
            <span className="font-medium">{message}</span>
        </div>
        <button 
            onClick={onDismiss} 
            className="ml-4 text-white hover:text-blue-200 focus:outline-none transition-colors"
        >
            <span className="text-xl font-semibold">×</span>
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
        <div className="w-full max-w-6xl p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl mb-10 mx-auto border border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Layout className="w-5 h-5 mr-3 text-blue-400" />
                    <h2 className="text-xl font-bold text-white">Project Activity</h2>
                </div>
                {error && (
                    <div className="flex items-center text-yellow-300 text-sm bg-yellow-900 bg-opacity-30 px-3 py-1 rounded-full">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span>Using sample data - Unable to load analytics</span>
                    </div>
                )}
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={displayData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.6} />
                    <XAxis 
                        dataKey="date" 
                        stroke="#9CA3AF" 
                        tick={{ fill: '#9CA3AF' }}
                        axisLine={{ stroke: '#4B5563' }}
                    />
                    <YAxis 
                        stroke="#9CA3AF" 
                        tick={{ fill: '#9CA3AF' }}
                        axisLine={{ stroke: '#4B5563' }}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '0.5rem',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }} 
                        labelStyle={{ color: '#D1D5DB', fontWeight: 'bold', marginBottom: '0.5rem' }}
                        itemStyle={{ color: '#60A5FA' }}
                        cursor={{ stroke: '#60A5FA', strokeWidth: 1, strokeDasharray: '5 5' }}
                    />
                    <Legend 
                        wrapperStyle={{ paddingTop: '1rem' }}
                        formatter={(value) => <span className="text-gray-300">{value}</span>}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="updates" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        name="Project Updates"
                        dot={{ r: 4, fill: '#2563EB', stroke: '#1D4ED8', strokeWidth: 1 }}
                        activeDot={{ r: 6, fill: '#60A5FA', stroke: '#3B82F6', strokeWidth: 2 }}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
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
    const [showScrollToTop, setShowScrollToTop] = useState(false);

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

        // Add scroll listener for scroll-to-top button
        const handleScroll = () => {
            setShowScrollToTop(window.scrollY > 300);
        };
        
        window.addEventListener('scroll', handleScroll);

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            // Clear all timers when component unmounts
            Object.values(notificationTimers).forEach(timer => clearTimeout(timer));
            window.removeEventListener('scroll', handleScroll);
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
            setLoading(false);
        } catch (err) {
            setError('Failed to load projects');
            setLoading(false);
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

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed':
                return 'bg-green-500';
            case 'in-progress':
                return 'bg-blue-500';
            case 'pending':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    const ProjectCard = ({ project }) => {
        const remainingTime = getRemainingTime(project.deadline);
        const statusColor = getStatusColor(project.status);
        const isNearDeadline = 
            new Date(project.deadline) - new Date() < 24 * 60 * 60 * 1000 && // less than 24 hours
            new Date(project.deadline) > new Date() && // not overdue
            project.status !== 'completed';
        const isOverdue = new Date(project.deadline) < new Date() && project.status !== 'completed';
            
        return (
            <div className="w-full md:w-[500px] h-auto border border-gray-700 rounded-xl shadow-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3 ${statusColor}`}></div>
                            <h2 className="text-xl font-bold text-white">{project.name}</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-gray-700 bg-opacity-50 px-3 py-1 rounded-full">
                                <GitBranch className="w-4 h-4 text-blue-300" />
                                <span className="text-sm text-gray-300">{project.language}</span>
                            </div>
                            <button
                                onClick={() => navigateToNotes(project._id)}
                                className="p-2 text-blue-400 hover:text-blue-300 transition-colors hover:bg-blue-900 hover:bg-opacity-30 rounded-full"
                                title="Project Notes"
                            >
                                <FileText className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => deleteProject(project._id)}
                                className="p-2 text-red-400 hover:text-red-300 transition-colors hover:bg-red-900 hover:bg-opacity-30 rounded-full"
                                title="Delete Project"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    
                    <p className="text-gray-300 mb-5 bg-gray-800 bg-opacity-50 p-3 rounded-lg">{project.description}</p>
                    
                    <div className="space-y-5">
                        <div className="flex items-center gap-3 bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                            <Clock className={`w-5 h-5 flex-shrink-0 ${
                                isOverdue ? 'text-red-400' : 
                                isNearDeadline ? 'text-yellow-400' : 
                                'text-blue-400'
                            }`} />
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-300">
                                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                                </span>
                                <span className={`text-xs font-medium ${
                                    isOverdue ? 'text-red-400' : 
                                    isNearDeadline ? 'text-yellow-400' : 
                                    'text-gray-400'
                                }`}>
                                    {remainingTime}
                                </span>
                            </div>
                        </div>
        
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-300">
                                <span>Progress</span>
                                <span className="font-medium">{project.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                <div 
                                    className={`h-2.5 rounded-full transition-all duration-500 ${
                                        isOverdue ? 'bg-red-600' :
                                        isNearDeadline && project.progress < 50 ? 'bg-yellow-500' : 
                                        project.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${project.progress || 0}%` }}
                                />
                            </div>
                        </div>
        
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => updateProjectStatus(project._id, 'pending', 0)}
                                className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-yellow-800 to-yellow-700 text-yellow-200 rounded-lg hover:from-yellow-700 hover:to-yellow-600 transition-all duration-300 font-medium"
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => updateProjectStatus(project._id, 'in-progress', 50)}
                                className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-blue-800 to-blue-700 text-blue-200 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 font-medium"
                            >
                                In Progress
                            </button>
                            <button
                                onClick={() => updateProjectStatus(project._id, 'completed', 100)}
                                className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-green-800 to-green-700 text-green-200 rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-300 font-medium"
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
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
                <div className="container mx-auto p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-gray-800 bg-opacity-50 p-4 rounded-xl shadow-lg">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">Project Dashboard</h1>
                            <div className="relative w-full md:w-64">
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    {searchQuery && (
                                        <span className="text-xs text-gray-400">
                                            {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600">
                            <span className="text-sm text-gray-300">Status:</span>
                            <span className={`text-sm font-medium flex items-center gap-1 ${connected ? 'text-green-400' : 'text-red-400'}`}>
                                <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                {connected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                    </div>

                    {error && <CustomAlert message={error} />}
                    
                    <AnalyticsChart analyticsData={analyticsData} error={analyticsError} />
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="w-full flex flex-wrap gap-6 justify-center">
                            {filteredProjects.length > 0 ? filteredProjects.map((project) => (
                                <ProjectCard key={project._id} project={project} />
                            )) : (
                                <div className="text-center py-10 px-6 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg w-full max-w-lg">
                                    <p className="text-gray-300 text-lg">No projects match your search criteria.</p>
                                    {searchQuery && (
                                        <button 
                                            onClick={() => setSearchQuery('')}
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
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

            {/* Scroll to top button */}
            {showScrollToTop && (
                <button 
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 z-50"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            )}
            <Footer />
        </>
    );
}

export default NewProject;