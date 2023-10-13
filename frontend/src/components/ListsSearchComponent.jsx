import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

const ListsSearchComponent = () => {
  const theme = useTheme();
  const bgColor = theme.palette.dialog.background;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [lists, setLists] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newList, setnewList] = useState({
    name: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentListId, setCurrentListId] = useState(null);

  // Información
  useEffect(() => {
    const fetchLists = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/lists`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLists(data);
          setIsLoading(false);
        } else {
          console.error("Error al obtener las listas:", await response.text());
        }
      } catch (error) {
        console.error("Error al realizar fetch:", error);
      }
    };

    fetchLists();
  }, []);
  if (isLoading) {
    return <div className="loader"></div>;
  }
  // Buscar lista
  const listsFiltrados = Array.isArray(lists)
    ? lists.filter(
        (list) =>
          list.name && list.name.toLowerCase().includes(busqueda.toLowerCase())
      )
    : [];
  // Crear lista
  const addList = (list) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    fetch(`${BASE_URL}/api/lists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(list),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Recargar las listas después de añadir una nueva
        const token = localStorage.getItem("token");
        fetch(`${BASE_URL}/api/lists`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => setLists(data));
        setnewList({
          name: "",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Borrar lista
  const deleteList = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    fetch(`${BASE_URL}/api/list/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(() => {
      setLists(lists.filter((list) => list._id !== id));
    });
  };
  // Modificar lista
  const updateList = (id, updatedList) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    fetch(`${BASE_URL}/api/list/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedList),
    })
      .then(() => {
        // Recargar las listas después de actualizar una
        fetch(`${BASE_URL}/api/lists`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => setLists(data));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  // Dialog para añadir una lista
  const handleAddDialogOpen = () => {
    setEditMode(false);
    setnewList({
      name: "",
    });
    setOpenDialog(true);
  };
  // Dialog para editar una lista
  const handleEditDialogOpen = (listId, listData) => {
    setEditMode(true);
    setCurrentListId(listId);
    setnewList({
      name: listData.name,
    });
    setOpenDialog(true);
  };
  // Cerrar el dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentListId(null);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;

    setnewList((prevList) => ({
      ...prevList,
      [name]: value,
    }));
  };

  const saveList = (list) => {
    if (editMode) {
      updateList(currentListId, list);
    } else {
      addList(list);
    }
  };

  return (
    <>
      <div
        style={{ paddingBlock: "1rem", display: "flex" }}
        className="contentSearch"
      >
        <TextField
          label="Buscar lista"
          variant="outlined"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Button
          style={{ marginLeft: "auto" }}
          variant="contained"
          color="primary"
          onClick={handleAddDialogOpen}
        >
          Añadir lista
        </Button>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            backgroundColor: bgColor,
          },
        }}
      >
        <DialogTitle>
          {editMode ? "Editar lista" : "Añadir nueva lista"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nombre"
            type="text"
            fullWidth
            variant="standard"
            value={newList.name || ""}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancelar</Button>
          <Button
            onClick={() => {
              saveList(newList);
              handleDialogClose();
            }}
          >
            {editMode ? "Guardar" : "Añadir"}
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer>
        <Table sx={{ minWidth: 700 }} aria-label="lists table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre de la lista</TableCell>
              <TableCell>Editar</TableCell>
              <TableCell>Borrar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listsFiltrados.map((list, index) => (
              <TableRow key={index}>
                <TableCell>{list.name}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditDialogOpen(list._id, list)}
                  >
                    <EditIcon />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => deleteList(list._id)}
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ListsSearchComponent;
