const express = require('express');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/authroutes');

const homeRoutes = require('./routes/homeroutes');

const adminRoutes = require('./routes/adminroutes');

const connectDB = require('./database/database');

const connectDB2 = require('./database/database2');

const Task = require('./model/model');

const Model = require('./schema/task');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);

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

app.get('/task', async(req, res) => {
    try
    {
        const task = await Model.find({});

        res.status(200).json({
            msg : 'Task found successfully',
            task
        })
    }
    catch(err)
    {
        res.status(400).json({
            msg : 'Task not found'
        })
    }
})

app.post('/task', async(req, res) => {
    try
    {
        const { task, description, priority, deadline } = req.body;

    const Task = await Model.create({
        task : task,
        description : description,
        priority : priority,
        deadline : deadline
    })

    res.status(200).json({
        msg : 'Task created successfully',
        Task
    })
    }
    catch(err)
    {
        res.status(400).json({
            msg : 'Task not created'
        })

        console.log(`An error ocurred ${err}`);
    }
})

connectDB();

connectDB2();

app.listen(PORT, () => {
    console.log(`Server is listening on the port ${PORT}`);
})

