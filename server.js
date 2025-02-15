const express = require('express');

const app = express();

const cors = require('cors')

const http = require('http');

const server = http.createServer(app);

const { Server } = require('socket.io');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/authroutes');

const homeRoutes = require('./routes/homeroutes');

//a

const adminRoutes = require('./routes/adminroutes');

const connectDB = require('./database/database');

const connectDB2 = require('./database/database2');

const Task = require('./model/model');

const Model = require('./schema/task');

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const io = new Server(server, {
    cors : {
        origin : 'http://localhost:5173',
        methods : ["GET", "POST", "PUT", "DELETE"]
    }
})

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

connectDB();

connectDB2();

// app.listen(PORT, () => {
//     console.log(`Server is listening on the port ${PORT}`);
// })

server.listen(PORT, () => {
    console.log(`Server is listening on the port ${PORT}`);
})

