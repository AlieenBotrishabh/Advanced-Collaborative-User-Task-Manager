const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    // Your existing fields
    empid: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // Add these new fields
    role: {
        type: String,
        default: 'Employee'
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    // You can add more user-related fields here
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;