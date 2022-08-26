const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const todoTaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    list_id: {
        type: ObjectId,
        required: true
    }
})
module.exports = mongoose.model('TodoTask',todoTaskSchema);