const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    empid : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
    }
})

const Task = mongoose.model('Task', schema);

module.exports = Task;