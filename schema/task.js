const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    teamId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        required: true,
    },
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    }
});

// Enforce unique task names per team
schema.index({ task: 1, teamId: 1 }, { unique: true });

module.exports = mongoose.model('Taskdb', schema);
