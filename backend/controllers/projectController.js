const Project = require("../models/Project");
const jwt = require("jsonwebtoken");

// GET projects
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
// GET un proyecto específico
exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id; // Obtener el ID del proyecto de los parámetros de la ruta
    const project = await Project.findById(projectId) // Buscar el proyecto por ID
      .populate("users", "firstName lastName") // Obtener nombre y apellido
      .populate("lists", "name") // Obtener el nombre de las listas
      .exec();

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" }); // Enviar un error si el proyecto no se encuentra
    }

    res.status(200).json(project); // Enviar el proyecto como respuesta
  } catch (error) {
    res.status(400).json({ message: "Error al obtener el proyecto", error });
  }
};
// POST proyecto
exports.addProject = async (req, res) => {
  try {
    console.log(req.body);
    const newProject = new Project(req.body);
    await newProject.save();
    console.log("Proyecto a guardar:", newProject);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: "Error al crear un proyecto", error });
  }
};
// Añade listas al proyecto
exports.addListToProject = async (req, res) => {
  console.log("entra");
  try {
    const { projectId, listId } = req.body; // Aquí, asegúrate de que projectId y listId se están recibiendo correctamente
    console.log("Project ID:", projectId, "List ID:", listId);
    const project = await Project.findById(projectId);
    console.log("Project:", project); // Verifica si el proyecto se recupera correctamente
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    project.lists.push(listId);
    await project.save();
    res.status(200).json({ message: "Lista añadida al proyecto", project });
  } catch (error) {
    console.error("Error:", error); // Imprime el error para entender qué está mal
    res
      .status(400)
      .json({ message: "Error al añadir la lista al proyecto", error });
  }
};

// UPDATE proyecto
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
    res.status(400).json({ message: "Error al actualizar proyecto", error });
  }
};

// DELETE proyecto
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findByIdAndRemove(projectId); // Encuentra el proyecto por ID y lo elimina

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.status(200).json({ message: "Proyecto eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar proyecto", error });
  }
};
