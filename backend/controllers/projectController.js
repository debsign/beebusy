// Importamos el modelo
const Project = require("../models/Project");
// GET projects
// Obtiene todos los proyectos desde la base de datos
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("users", "firstName lastName") //Obtener nombre y apellido
      .populate("lists", "name") // Obtener el nombre de las listas
      .exec();
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ message: "Error al obtener los proyectos", error });
  }
};
// GET proyecto
// Obtiene un proyecto específico
exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id; // Obtener el ID del proyecto de los parámetros de la ruta
    const project = await Project.findById(projectId) // Buscar el proyecto por ID
      .populate("users", "firstName lastName") // Obtener nombre y apellido
      .populate("lists", "name") // Obtener el nombre de las listas
      .exec();
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: "Error al obtener el proyecto", error });
  }
};
// POST proyecto
// Añade un proyecto
exports.addProject = async (req, res) => {
  try {
    console.log(req.body);
    const newProject = new Project(req.body);
    await newProject.save();
    console.log("Proyecto a guardar:", newProject);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: "Error al crear el proyecto", error });
  }
};
// POST list to project
// Añade listas al proyecto
exports.addListToProject = async (req, res) => {
  try {
    const { projectId, listId } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    // Añade la lista a las listas del proyecto
    project.lists.push(listId);
    await project.save();
    res.status(200).json({ message: "Lista añadida al proyecto", project });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(400)
      .json({ message: "Error al añadir la lista al proyecto", error });
  }
};
// UPDATE proyecto
// Actualiza un proyecto
exports.updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    console.log(projectId);
    // Encuentra el proyecto por ID y actualiza con los datos enviados en el cuerpo del request
    const project = await Project.findByIdAndUpdate(projectId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    console.log("Proyecto a guardar:", project);
    res.status(200).json({ message: "Proyecto actualizado", project });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar el proyecto", error });
  }
};
// DELETE proyecto
// Borrar un proyecto
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    // Encuentra el proyecto por ID y lo elimina
    const project = await Project.findByIdAndRemove(projectId);

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.status(200).json({ message: "Proyecto eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar el proyecto", error });
  }
};
