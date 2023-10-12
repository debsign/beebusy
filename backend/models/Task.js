const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  dueDate: Date,
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  lists: [
    {
      type: Schema.Types.ObjectId,
      ref: "List",
    },
  ],
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
