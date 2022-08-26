const mongoose = require('mongoose')
    , Schema = mongoose.Schema



const todoListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model('TodoList',todoListSchema);