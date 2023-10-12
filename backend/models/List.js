const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  name: String,
});

const List = mongoose.model("List", ListSchema);
module.exports = List;
