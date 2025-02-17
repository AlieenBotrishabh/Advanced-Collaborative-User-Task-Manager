const mongoose = require('mongoose');

const connectDB = async() => {
    try
    {
        await mongoose.connect('mongodb://localhost:27017/Task');

        console.log('Database Connected Successfully');
    }
    catch(err)
    {
        console.log(`An error occured`);
    }
}

module.exports = connectDB;