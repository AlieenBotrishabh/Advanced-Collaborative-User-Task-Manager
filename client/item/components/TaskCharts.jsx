import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import Navbar from './Navbar';

const TaskCharts = ({ teamId }) => {
  const [analyticsData, setAnalyticsData] = useState({
    statusDistribution: [],
    priorityDistribution: [],
    taskActivity: [],
    summary: {
      totalTasks: 0,
      completedTasks: 0,
      completionRate: 0,
      pendingTasks: 0,
      inProgressTasks: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const url = teamId 
        ? `http://localhost:5000/tasks/analytics?teamId=${teamId}`
        : 'http://localhost:5000/tasks/analytics';

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [teamId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <span>Error loading analytics data: {error}</span>
      </div>
    );
  }

  const { statusDistribution, priorityDistribution, taskActivity, summary } = analyticsData;
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <>
    <Navbar />
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Task Analytics</h2>
        <button 
          onClick={fetchAnalyticsData}
          className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Status Distribution */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Task Status Distribution</h3>
          {statusDistribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No task data available
            </div>
          )}
        </div>

        {/* Task Activity */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Task Activity (Last 7 Days)</h3>
          {taskActivity?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="created" name="Tasks Created" fill="#8884d8" />
                <Bar dataKey="completed" name="Tasks Completed" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No activity data available
            </div>
          )}
        </div>

        {/* Task Priority Distribution */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Task Priority Distribution</h3>
          {priorityDistribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Task Count">
                  {priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No priority data available
            </div>
          )}
        </div>

        {/* Completion Progress */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Task Completion Progress</h3>
          {taskActivity?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={taskActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="created" 
                  name="Created" 
                  stroke="#8884d8" 
                  activeDot={{ r: 6 }} 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  name="Completed" 
                  stroke="#82ca9d" 
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No completion data available
            </div>
          )}
        </div>
      </div>

      {/* Task Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-xl font-bold text-blue-700">{summary.totalTasks}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-xl font-bold text-green-700">{summary.completedTasks}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-xl font-bold text-yellow-700">{summary.pendingTasks}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-xl font-bold text-purple-700">{summary.inProgressTasks}</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default TaskCharts;
