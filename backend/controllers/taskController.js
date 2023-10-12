const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

// GET tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("users") // Poblar información de usuarios
      .populate("projects") // Poblar información de proyectos
      .populate("lists"); // Poblar información de listas

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No se encontraron tareas" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error al obtener tareas:", error); // Log detallado del error
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

// POST tasks
exports.addTask = async (req, res) => {
  try {
    // Para la creación de tareas en el tablero del proyecto
    // necesitamos asignarle el id de la lista y el del proyecto
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
    res.status(400).json({ message: "Error al añadir la tarea", error });
  }
};
// UPDATE tasks
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    // Encuentra la tarea por ID y actualiza con los datos enviados en el cuerpo del request
    const task = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true, // Esto retornará el documento modificado y no el original
      runValidators: true, // Valida el nuevo documento antes de guardarlo
    });

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.status(200).json({ message: "Tarea actualizada", task });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar tarea", error });
  }
};

// DELETE tasks
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByIdAndRemove(taskId); // Encuentra el usuario por ID y lo elimina

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.status(200).json({ message: "Tarea eliminada" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar tarea", error });
  }
};
