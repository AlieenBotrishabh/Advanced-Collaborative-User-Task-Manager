const mongoose = require('mongoose');

const connectDB = async() => {
    try
    {
        const connection = await mongoose.connect('mongodb://localhost:27017/Task');

        console.log('Database Connection Successfully');
    }
    catch(err)
    {
        console.log(`An error ocurred ${err}`);
    }
}

module.exports = connectDB;