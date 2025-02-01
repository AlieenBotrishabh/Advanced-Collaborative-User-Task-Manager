const express = require('express');

const PORT = process.env.PORT || 5000;

const connectDB = require('./database/database');

const Task = require('./model/model');

const app = express();

app.use(express.json());

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

connectDB();

app.listen(PORT, () => {
    console.log(`Server is listening on the port ${PORT}`);
})

