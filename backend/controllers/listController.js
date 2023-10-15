// Importamos el modelo
const List = require("../models/List");
// GET lists
// Obtiene todos las listas desde la base de datos
exports.getAllLists = async (req, res) => {
  try {
    const lists = await List.find();
    res.status(200).json(lists);
  } catch (error) {
    res.status(400).json({ message: "Error al obtener las listas", error });
  }
};
// POST list
// Añade una lista
exports.addList = async (req, res) => {
  try {
    const newList = new List(req.body);
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
    res.status(400).json({ message: "Error al añadir la lista", error });
  }
};
// UPDATE list
// Actualiza una lista
exports.updateList = async (req, res) => {
  try {
    const listId = req.params.id;
    // Encuentra la lista por ID y actualiza con los datos enviados en el cuerpo del request
    const list = await List.findByIdAndUpdate(listId, req.body, {
      new: true, // Devuelve el documento modificado
      runValidators: true, // Valida el nuevo documento antes de guardarlo
    });
    if (!list) {
      return res.status(404).json({ message: "Lista no encontrada" });
    }
    res.status(200).json({ message: "Lista actualizada", user });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar la lista", error });
  }
};

// DELETE list
// Borra una lista
exports.deleteList = async (req, res) => {
  try {
    const listId = req.params.id;
    // Encuentra la lista por ID y la elimina
    const list = await List.findByIdAndRemove(listId);
    if (!list) {
      return res.status(404).json({ message: "Lista no encontrada" });
    }
    res.status(200).json({ message: "Lista eliminada" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar la lista", error });
  }
};
