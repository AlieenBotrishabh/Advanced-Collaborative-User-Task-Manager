const express = require('express');

const app = express();

const cors = require('cors')

const http = require('http');

const server = http.createServer(app);

const ProjectDB = require('./projects/project');

const { Server } = require('socket.io');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/authroutes');

const homeRoutes = require('./routes/homeroutes');

//a

const adminRoutes = require('./routes/adminroutes');

const connectDB = require('./database/database');

const connectDB2 = require('./database/database2');

const connectDB3 = require('./database/database3');

const Task = require('./model/model');

const Model = require('./schema/task');

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5175',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
        allowedHeaders: ['Content-Type']
    },
    allowEIO3: true // Enable compatibility mode
});

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);

const tasks = [];

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('createTask', (task) => {
        console.log('New Task Created', task);
        socket.broadcast.emit('newTask', task);
    })

    socket.on('disconnect', () => {
        console.log('A user disconencted', socket.id);
    })
})

app.get('/', async(req, res) => {

    try
    {
        res.status(200).json({
        msg : 'Server is on the Home Page',
    })
    }
    catch(err)
    {
        res.status(400).json({
            msg : `An error ocurred ${err}`
        })
        console.log(`An error ocurred ${err}`);
    }
})

app.get('/user', async(req, res) => {
    try
    {
        const user = await Task.find();
        console.log(user);

        res.status(200).json({
            msg : 'Employee Found',
            success : true,
            user
        })
    }
    catch(err)
    {
        console.log(`An error ocurred ${err}`);
    }
})

app.post('/add', async(req, res) => {
    try
    {
        const { empid, name, email, password } = req.body;
        const user = await Task.create({
            empid : empid,
            name : name,
            email : email,
            password : password
        })

        res.status(200).json({
            msg : 'Employee Added',
            success : true,
            user
        })
    }
    catch(err)
    {
        res.status(400).json({
            msg : `An error ocurred ${err}`
        })

        console.log(`An error ocurred ${err}`);
    }
})

app.put('/user/:id', async(req, res) => {
    try
    {
        const { id } = req.params;

        const { name, email, password } = req.body;

        const user = await Task.findByIdAndUpdate(
            id,
            { name, email, password },
            { new : true, runValidators: true}
        );

        if(!user)
        {
            res.status(404).json({
                msg : 'User not found'
            })
        }

        res.status(200).json({
            msg : 'Employee found',
            success : true,
            user
        })
    }
    catch(err)
    {
        res.status(400).json({
            msg : `An error ocurred ${err}`
        })

        console.log(`An error ocurred ${err}`);
    }
})

// GET /tasks
app.get('/tasks', async(req, res) => {
    try {
        const tasks = await Model.find({});
        res.status(200).json(tasks); // Send array directly
    }
    catch(err) {
        res.status(400).json({
            msg: 'Tasks not found',
            error: err.message
        });
    }
});

// POST /tasks
app.post('/tasks', async(req, res) => {
    try {
        const { task, description, priority, deadline, status, progress } = req.body;
        const newTask = await Model.create({
            task,
            description,
            priority,
            deadline,
            status: status || 'pending',
            progress: progress || 0
        });

        res.status(200).json(newTask); // Send task directly
    }
    catch(err) {
        res.status(400).json({
            msg: 'Task not created',
            error: err.message
        });
    }
});

// Add PATCH endpoint for updating status
app.patch('/tasks/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { status, progress } = req.body;
        
        const updatedTask = await Model.findByIdAndUpdate(
            id,
            { status, progress },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch(err) {
        res.status(400).json({
            msg: 'Failed to update task',
            error: err.message
        });
    }
});

app.get('/projects', async (req, res) => {
    try {
        const projects = await ProjectDB.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new project
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
            msg : 'Project added successfully',
            newProject
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update project
app.patch('/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, progress } = req.body;
        
        if (!status || progress === undefined) {
            return res.status(400).json({ 
                message: 'Status and progress are required fields' 
            });
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
            newProgress: progress
        });

        project.status = status;
        project.progress = progress;

        const updatedProject = await project.save();
        
        io.emit('projectUpdated', updatedProject);
        
        res.json(updatedProject);
    } catch (err) {
        console.error('Project update error:', err);
        res.status(400).json({ 
            message: 'Failed to update project',
            error: err.message 
        });
    }
});


// Get project analytics
app.get('/projects/analytics', async (req, res) => {
    try {
        const projects = await ProjectDB.find();
        
        // Create analytics data for the last 7 days
        const analytics = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return {
                date: date.toISOString().split('T')[0],
                updates: 0
            };
        }).reverse();

        // Count updates for each day
        projects.forEach(project => {
            project.updates.forEach(update => {
                const updateDate = new Date(update.timestamp).toISOString().split('T')[0];
                const analyticsEntry = analytics.find(a => a.date === updateDate);
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

app.delete('/projects/:id', async (req, res) => {
    try {
        const project = await ProjectDB.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await ProjectDB.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


connectDB();

connectDB2();

connectDB3();

// app.listen(PORT, () => {
//     console.log(`Server is listening on the port ${PORT}`);
// })

server.listen(PORT, () => {
    console.log(`Server is listening on the port ${PORT}`);
})

