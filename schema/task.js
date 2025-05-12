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
    deadline: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
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
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Remove the unique index to allow duplicate task names within the same team
// schema.index({ task: 1, teamId: 1 }, { unique: true });

module.exports = mongoose.model('Taskdb', schema);