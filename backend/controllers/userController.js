// Importamos el modelo
const User = require("../models/User");
// Importamos jwt porque lo necesitamos para generar el token al loguearse el usuario
const jwt = require("jsonwebtoken");
// POST registro
// Registro de un usuario
exports.register = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "Error al registrar el usuario", error });
  }
};
// POST login
// Login de un usuario
exports.login = async (req, res) => {
  try {
    // Recibimos los datos del body de la request
    const { email, password } = req.body;
    // Buscamos el usuario que tenga el mismo email que en el body
    const user = await User.find({ email: email });
    // Si el user está vacío
    if (user.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    // Si la contraseña asignada no coincide con la que aparece en el body
    if (user[0].password !== password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    // Generamos el token único
    const token = jwt.sign(
      { id: user[0]._id, role: user[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    // Todo bien
    res.status(200).json({
      message: "Logueado",
      role: user[0].role,
      userID: user[0]._id.toString(),
      token,
    });
  } catch (error) {
    // Algo ha fallado
    res.status(400).json({ message: "Error al iniciar sesión", error });
  }
};
// GET users
// Obtiene todos las usuarios desde la base de datos
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: "Error al obtener los usuarios", error });
  }
};
// GET user
// Obtiene un solo usuario
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id; // Obtenemos ID del usuario de los parámetros de la ruta
    const user = await User.findById(userId); // Buscamos un usuario por ID
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "Error al obtener el usuario", error });
  }
};
// POST user
// Añade un usuario desde el admin
exports.addUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "Error al añadir el usuario", error });
  }
};
// UPDATE user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // Encontramos el usuario por ID y actualizamos con los datos enviados en el cuerpo del request
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario actualizado", user });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar usuario", error });
  }
};
// DELETE user
// Borra un usuario
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // Buscamos el usuario por ID y lo eliminamos
    const user = await User.findByIdAndRemove(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar usuario", error });
  }
};
// POST alert
// Añade una notificación
exports.addAlert = async (req, res) => {
  try {
    const userId = req.params.id;
    const alertMessage = req.body.message;
    // Busca al usuario al que le han añadido la tarea
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Añade la notificación a las alertas del usuario
    user.alerts.push({ message: alertMessage });
    await user.save();
    res.status(200).json({ message: "Alerta añadida", alert: alertMessage });
  } catch (error) {
    res.status(400).json({ message: "Error al añadir la alerta", error });
  }
};
// DELETE alert
// Borra una notificación el usuario desde su dashboard
exports.deleteAlert = async (req, res) => {
  try {
    const userId = req.params.id;
    const alertId = req.params.alertId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Encontramos el índice de la alerta a eliminar
    const alertIndex = user.alerts.findIndex(
      (alert) => alert._id.toString() === alertId
    );
    if (alertIndex === -1) {
      return res.status(404).json({ message: "Alerta no encontrada" });
    }
    // Eliminamos la alerta
    user.alerts.splice(alertIndex, 1);
    await user.save();
    res.status(200).json({ message: "Alerta eliminada" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar la alerta", error });
  }
};
