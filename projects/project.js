const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
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
    },
    updates: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            required: true
        },
        newStatus: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            required: true
        },
        newProgress: {
            type: Number,
            min: 0,
            max: 100
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('projectdbs', projectSchema);
