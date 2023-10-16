// Importamos el modelo
const Task = require("../models/Task");
// GET tasks
// Obtiene todos las tareas desde la base de datos
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("users") // Poblar información de usuarios
      .populate("projects") // Poblar información de proyectos
      .populate("lists"); // Poblar información de listas

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No se encontraron las tareas" });
    }
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};
// POST tasks ADMIN
// Añade una tarea en el admin
exports.addTask = async (req, res) => {
  try {
    const { name, listId, projectId } = req.body;
    const taskData = {
      name: name,
      lists: listId ? [listId] : undefined,
      projects: projectId ? [projectId] : undefined,
    };
    const newTask = new Task(taskData);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error al guardar en la BD:", error);
    res.status(400).json({ message: "Error al añadir la tarea", error });
  }
};
// POST tasks TABLERO
// Añade una tarea en el tablero
exports.addTaskAdmin = async (req, res) => {
  try {
    // Para la creación de tareas en el tablero del proyecto
    // necesitamos asignarle el id de la lista y el del proyecto
    const { name, lists, projects, users, startDate, dueDate } = req.body;
    const taskData = {
      name: name,
      lists: lists ? lists : undefined,
      projects: projects ? [projects] : undefined,
      users: users ? users : undefined,
      startDate: startDate ? startDate : undefined,
      dueDate: dueDate ? dueDate : undefined,
    };
    const newTask = new Task(taskData);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error al guardar en la BD:", error);
    res.status(400).json({ message: "Error al añadir la tarea", error });
  }
};
// UPDATE tasks
// Actualiza una tarea
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    // Encuentra la tarea por ID y actualiza con los datos enviados en el cuerpo del request
    const task = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true, // Devuelve el documento modificado y no el original
      runValidators: true, // Valida el nuevo documento antes de guardarlo
    });
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.status(200).json({ message: "Tarea actualizada", task });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar la tarea", error });
  }
};
// DELETE tasks
// Borra una tarea
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    // Encuentra el usuario por ID y lo elimina
    const task = await Task.findByIdAndRemove(taskId);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.status(200).json({ message: "Tarea eliminada" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar la tarea", error });
  }
};
