const mongoose = require('mongoose');

const connectDB = async() => {
    try
    {
        await mongoose.connect('mongodb://localhost:27017/');
        
        console.log('Database Connected Successfully');
    }
    catch(err)
    {
        console.log(`An error ocurred ${err}`);
    }
}

module.exports = connectDB;