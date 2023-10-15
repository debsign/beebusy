// Importamos mongoose (y sacamos Schema para usarlo más tarde)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Definición de esquema Project
// Las listas y usuarios están asociados a los modelos List y User
const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  lists: [
    {
      type: Schema.Types.ObjectId,
      ref: "List",
    },
  ],
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
// Creamos y exportamos modelo Project
const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
