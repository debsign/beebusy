const mongoose = require('mongoose');
// const Task = require('./Task.js');

const ListSchema = new mongoose.Schema({
    name: String,
    // tasks: [Task]
});

const List = mongoose.model('List', ListSchema);
module.exports = List;
