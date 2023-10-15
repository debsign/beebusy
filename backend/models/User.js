// Importamos mongoose
const mongoose = require("mongoose");
// Definición de esquema Alert que añadimos en User
const AlertSchema = new mongoose.Schema({
  message: String,
  createdAt: { type: Date, default: Date.now }, // Añade la fecha de cuando se crea la alerta
});
// Definición de esquema User
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "worker" }, // 'admin' o 'worker'
  avatar: { type: String, default: "default" },
  alerts: [AlertSchema],
});
// Creamos y exportamos modelo User
const User = mongoose.model("User", UserSchema);
module.exports = User;
