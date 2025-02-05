const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    task : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    priority : {
        type : Number,
        required : true,
    },
    deadline : {
        type : Date,
        required : true
    }

})

module.exports = mongoose.model('Taskdb', schema);