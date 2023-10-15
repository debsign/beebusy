// Importamos mongoose
const mongoose = require("mongoose");
// Definición de esquema List
const ListSchema = new mongoose.Schema({
  name: String,
});
// Creamos y exportamos modelo List
const List = mongoose.model("List", ListSchema);
module.exports = List;
