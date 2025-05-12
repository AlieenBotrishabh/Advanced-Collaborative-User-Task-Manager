const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const server = http.createServer(app);

// Models
const ProjectDB = require('./projects/project');
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
        const { empid, name, email, password } = req.body;
        const user = await Task.create({ empid, name, email, password });
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

// Project Routes
app.get('/projects', async (req, res) => {
    try {
        const projects = await ProjectDB.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/projects', async (req, res) => {
    const project = new ProjectDB({
        name: req.body.name,
        username: req.body.username,
        language: req.body.language,
        deadline: req.body.deadline,
        description: req.body.description,
        progress: 0,
        status: 'pending',
        updates: [],
    });

    try {
        const newProject = await project.save();
        res.status(201).json({
            msg: 'Project added successfully',
            newProject,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update project route
app.patch('/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, progress } = req.body;
        if (!status || progress === undefined) {
            return res.status(400).json({ message: 'Status and progress are required fields' });
        }

        const project = await ProjectDB.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Ensure updates are pushed as an object
        project.updates.push({
            timestamp: new Date(),
            type: 'status_change',
            newStatus: status,
            newProgress: progress,
        });

        project.status = status;
        project.progress = progress;

        const updatedProject = await project.save();

        io.emit('projectUpdated', updatedProject);

        res.json(updatedProject);
    } catch (err) {
        console.error('Project update error:', err);
        res.status(400).json({ message: 'Failed to update project', error: err.message });
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

// Project analytics route
app.get('/projects/analytics', async (req, res) => {
    try {
        const projects = await ProjectDB.find();

        const analytics = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return {
                date: date.toISOString().split('T')[0],
                updates: 0,
            };
        }).reverse();

        projects.forEach((project) => {
            project.updates.forEach((update) => {
                const updateDate = new Date(update.timestamp).toISOString().split('T')[0];
                const analyticsEntry = analytics.find((a) => a.date === updateDate);
                if (analyticsEntry) {
                    analyticsEntry.updates++;
                }
            });
        });

        res.json(analytics);
    } catch (err) {
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