// Importamos mongoose (y sacamos Schema para usarlo más tarde)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Definición de esquema Task
// Las listas, usuarios y proyectos están asociados a los modelos List, User y Project
const TaskSchema = new mongoose.Schema({
  name: String,
  description: String,
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
// Creamos y exportamos modelo Task
const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
