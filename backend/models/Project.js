const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
