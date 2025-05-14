const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const server = http.createServer(app);

// Models
const Task = require('./model/model'); // For employee model
const TaskModel = require('./schema/task'); // For task management 
const Team = require('./Team/team');

// Routes
const authRoutes = require('./routes/authroutes');
const homeRoutes = require('./routes/homeroutes');
const adminRoutes = require('./routes/adminroutes');

// MySQL and MongoDB connections
const mysql = require('./mysqlConnection');
const connectDB = require('./database/database');
const connectDB2 = require('./database/database2');
const connectDB3 = require('./database/database3');

const scheduleEmailReminder = require('./nodemailer');

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// WebSocket setup - FIXED CONFIGURATION
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
    },
    transports: ['websocket', 'polling'], // Explicitly define transports
    allowEIO3: true, // Enable compatibility mode
    path: '/socket.io/' // Make sure path matches client configuration
});

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);

// Socket.IO Event Handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('createTask', (task) => {
        // Emit to all clients except sender
        socket.broadcast.emit('newTask', task);
        console.log('New task created:', task.task);
    });

    socket.on('updateTask', (task) => {
        // Emit to all clients except sender
        socket.broadcast.emit('taskUpdated', task);
        console.log('Task updated:', task._id);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Routes
app.get('/', async (req, res) => {
    try {
        res.status(200).json({
            msg: 'Server is on the Home Page',
        });
    } catch (err) {
        res.status(400).json({
            msg: `An error occurred: ${err}`,
        });
        console.log(`An error occurred: ${err}`);
    }
});

// Employee Routes
app.get('/user', async (req, res) => {
    try {
        const users = await Task.find();
        res.status(200).json({
            msg: 'Employees Found',
            success: true,
            users,
        });
    } catch (err) {
        console.log(`An error occurred: ${err}`);
    }
});

app.post('/add', async (req, res) => {
    try {
        const { empid, name, email, password, taskId } = req.body;
        const user = await Task.create({ empid, name, email, password, taskId });
        res.status(200).json({
            msg: 'Employee Added',
            success: true,
            user,
        });
    } catch (err) {
        res.status(400).json({
            msg: `An error occurred: ${err}`,
        });
        console.log(`An error occurred: ${err}`);
    }
});

// Team Routes
app.get('/teams', async (req, res) => {
    try {
        // If teamId is provided, return just that team
        if (req.query.teamId) {
            const team = await Team.findById(req.query.teamId);
            if (!team) {
                return res.status(404).json({ message: 'Team not found' });
            }
            return res.json(team);
        }
        // Otherwise return all teams
        const teams = await Team.find().sort({ createdAt: -1 });
        res.json(teams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/teams', async (req, res) => {
    try {
        const team = new Team({
            name: req.body.name,
            members: req.body.members || [],
            description: req.body.description,
            createdAt: new Date()
        });
        
        const newTeam = await team.save();
        res.status(201).json({
            message: 'Team created successfully',
            team: newTeam
        });
    } catch (err) {
        console.error('Team creation error:', err);
        res.status(400).json({ message: 'Failed to create team', error: err.message });
    }
});

// Task Routes
app.get('/tasks', async (req, res) => {
    try {
        const filter = {};
        
        // Filter by teamId if provided
        if (req.query.teamId) {
            filter.teamId = req.query.teamId;
        }
        
        const tasks = await TaskModel.find(filter).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/tasks', async (req, res) => {
    try {
        const task = new TaskModel(req.body);
        const newTask = await task.save();
        scheduleEmailReminder(newTask);
        
        // Emit socket event for real-time updates
        io.emit('newTask', newTask);
        
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await TaskModel.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Emit socket event if needed
        io.emit('deleteTask', req.params.id);

        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        io.emit('updateTask', updatedTask);
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.patch('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const task = await TaskModel.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        // Update the task
        Object.keys(updates).forEach(key => {
            task[key] = updates[key];
        });
        
        const updatedTask = await task.save();
        
        // Emit socket event for real-time updates
        io.emit('taskUpdated', updatedTask);
        
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/tasks/analytics', async (req, res) => {
    try {
        // Get teamId from query params (optional filter)
        const teamId = req.query.teamId;
        const filter = teamId ? { teamId } : {};
        
        // Get all tasks (filtered by team if provided)
        const tasks = await TaskModel.find(filter);
        
        // Calculate status distribution
        const statusCounts = {
            'pending': 0,
            'in-progress': 0,
            'completed': 0
        };
        
        tasks.forEach(task => {
            statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
        });
        
        const statusDistribution = Object.keys(statusCounts).map(status => ({
            name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
            value: statusCounts[status],
            color: status === 'pending' ? '#FFBB28' : 
                   status === 'in-progress' ? '#0088FE' : '#00C49F'
        }));
        
        // Calculate priority distribution
        const priorityCounts = {
            'low': 0,
            'medium': 0,
            'high': 0
        };
        
        tasks.forEach(task => {
            priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1;
        });
        
        const priorityDistribution = Object.keys(priorityCounts).map(priority => ({
            name: priority.charAt(0).toUpperCase() + priority.slice(1),
            value: priorityCounts[priority],
            fill: priority === 'high' ? '#ef4444' : 
                  priority === 'medium' ? '#f59e0b' : '#22c55e'
        }));
        
        // Calculate task activity for the last 7 days
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            return {
                date: date.toISOString().split('T')[0],
                created: 0,
                completed: 0
            };
        }).reverse();
        
        // Calculate tasks created and completed by day
        tasks.forEach(task => {
            const createdDate = new Date(task.createdAt).toISOString().split('T')[0];
            const createdEntry = last7Days.find(day => day.date === createdDate);
            
            if (createdEntry) {
                createdEntry.created++;
            }
            
            // For completed tasks, use the updatedAt field if available
            // This is an approximation - ideally, you would track when a task status changes to 'completed'
            if (task.status === 'completed') {
                const completedDate = task.updatedAt ? 
                    new Date(task.updatedAt).toISOString().split('T')[0] : 
                    createdDate;
                    
                const completedEntry = last7Days.find(day => day.date === completedDate);
                
                if (completedEntry) {
                    completedEntry.completed++;
                }
            }
        });
        
        // Format dates for display
        const taskActivity = last7Days.map(day => ({
            ...day,
            formattedDate: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }));
        
        // Calculate summary stats
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const pendingTasks = tasks.filter(t => t.status === 'pending').length;
        
        // Return all analytics data
        res.json({
            statusDistribution,
            priorityDistribution,
            taskActivity,
            summary: {
                totalTasks,
                completedTasks,
                completionRate,
                pendingTasks,
                inProgressTasks: tasks.filter(t => t.status === 'in-progress').length
            }
        });
        
    } catch (err) {
        console.error("Error generating task analytics:", err);
        res.status(500).json({ message: err.message });
    }
});

// Database Connections
connectDB();
connectDB2();
connectDB3();

// Start server
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});