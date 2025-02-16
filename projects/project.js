const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    username : {
        type : String,
        required : true
    },
    language : {
        type : String,
        required : true
    },
    deadline : {
        type : Date,
        required : true
    }
})