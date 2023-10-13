import React, { useEffect, useState } from "react";
import styled from "styled-components";

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

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import { useTheme } from "@mui/material/styles";

const ProjectsSearchComponent = () => {
  const theme = useTheme();
  const bgColor = theme.palette.dialog.background;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newProject, setnewProject] = useState({
    title: "",
    description: "",
    lists: [],
    users: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);

  // Usuarios del proyecto
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error(
            "Error al obtener los usuarios:",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Error al realizar fetch de usuarios:", error);
      }
    };

    fetchUsers();
  }, []);
  // Listas del proyecto
  const [lists, setLists] = useState([]);
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
        } else {
          console.error("Error al obtener las listas:", await response.text());
        }
      } catch (error) {
        console.error("Error al realizar fetch de las listas:", error);
      }
    };

    fetchLists();
  }, []);
  // Información de los proyectos
  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/projects`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(data);
          setIsLoading(false);
        } else {
          console.error(
            "Error al obtener los proyectos:",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Error al realizar fetch:", error);
      }
    };

    fetchProjects();
  }, []);
  if (isLoading) {
    return <div className="loader"></div>;
  }
  // Buscar proyecto
  const projectsFiltrados = Array.isArray(projects)
    ? projects.filter(
        (project) =>
          project.title &&
          project.title.toLowerCase().includes(busqueda.toLowerCase())
      )
    : [];
  // Crear proyecto
  const addProject = (project) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    fetch(`${BASE_URL}/api/projects`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Recargar los proyectos después de añadir uno nuevo
        const token = localStorage.getItem("token");
        fetch(`${BASE_URL}/api/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => setProjects(data));
        setnewProject({
          title: "",
          description: "",
          lists: [],
          users: [],
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  // Borrar proyecto
  const deleteProject = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    fetch(`${BASE_URL}/api/project/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(() => {
      setProjects(projects.filter((project) => project._id !== id));
    });
  };
  // Modificar proyecto
  const updateProject = (id, updatedProject) => {
    console.log("updatedProject:", updatedProject);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }

    fetch(`${BASE_URL}/api/project/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProject),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            console.error("Error 400:", data);
            throw new Error(`HTTP error! status: ${response.status}`);
          });
        }
        return response.json();
      })
      .then(() => {
        // Recargar los proyectos después de actualizar uno
        return fetch(`${BASE_URL}/api/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  // Dialog para añadir proyecto
  const handleAddDialogOpen = () => {
    setEditMode(false);
    setnewProject({
      title: "",
      description: "",
      lists: "",
      users: "",
    });
    setOpenDialog(true);
  };
  // Dialog para editar proyecto
  const handleEditDialogOpen = (projectId, projectData) => {
    setEditMode(true);
    setCurrentProjectId(projectId);

    const userNames = projectData.users
      ?.map((user) => {
        return user ? `${user.firstName} ${user.lastName}` : null;
      })
      .filter((userName) => userName !== null);

    const listNames = projectData.lists
      ?.map((listId) => {
        const list = lists.find((l) => l._id === listId);
        return list ? list.name : null;
      })
      .filter((listName) => listName !== null);

    setnewProject({
      title: projectData.title,
      description: projectData.description,
      lists: listNames,
      users: userNames,
    });

    setOpenDialog(true);
  };
  // Cerrar el dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentProjectId(null);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setnewProject((prevProject) => {
      if (name === "users") {
        // Nos aseguramos que los usuarios sean únicos
        const uniqueUsers = [...new Set(value)];
        return { ...prevProject, users: uniqueUsers };
      }

      return { ...prevProject, [name]: value };
    });
  };
  const saveProject = (project) => {
    const projectWithUserAndListIds = {
      ...project,
      users: project.users
        .map((userName) => {
          const user = users.find(
            (user) => `${user.firstName} ${user.lastName}` === userName
          );
          return user ? user._id : null;
        })
        .filter((userId) => userId !== null),
      lists: project.lists
        .map((listName) => {
          const list = lists.find((list) => list.name === listName);
          return list ? { _id: list._id, name: list.name } : null;
        })
        .filter((list) => list !== null),
    };

    // console.log('Proyecto con IDs de usuarios y listas:', projectWithUserAndListIds);

    if (editMode) {
      updateProject(currentProjectId, projectWithUserAndListIds);
    } else {
      addProject(projectWithUserAndListIds);
    }
  };
  // console.log(projectsFiltrados);

  return (
    <>
      <div
        style={{ paddingBlock: "1rem", display: "flex" }}
        className="contentSearch"
      >
        <TextField
          label="Buscar proyecto"
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
          Añadir proyecto
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
          {editMode ? "Editar proyecto" : "Añadir nuevo proyecto"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Título"
            type="text"
            fullWidth
            variant="standard"
            value={newProject.title || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Descripción"
            type="text"
            fullWidth
            variant="standard"
            value={newProject.description || ""}
            onChange={handleChange}
          />
          <StyledFormControl fullWidth variant="standard">
            <InputLabel id="lists-label">Listas</InputLabel>
            <Select
              labelId="lists-label"
              id="lists"
              name="lists"
              multiple
              value={newProject.lists || []}
              onChange={handleChange}
            >
              {lists.map((list) => (
                <MenuItem key={list._id} value={`${list.name}`}>
                  {list.name}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
          <StyledFormControl fullWidth variant="standard">
            <InputLabel id="users-label">Usuarios</InputLabel>
            <Select
              labelId="users-label"
              id="users"
              name="users"
              multiple
              value={newProject.users || []}
              onChange={handleChange}
            >
              {users.map((user) => (
                <MenuItem
                  key={user._id}
                  value={`${user.firstName} ${user.lastName}`}
                >
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancelar</Button>
          <Button
            onClick={() => {
              saveProject(newProject);
              handleDialogClose();
            }}
          >
            {editMode ? "Guardar" : "Añadir"}
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer>
        <Table sx={{ minWidth: 700 }} aria-label="projects table">
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Listas</TableCell>
              <TableCell>Usuarios</TableCell>
              <TableCell>Editar</TableCell>
              <TableCell>Borrar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectsFiltrados.map((project, index) => (
              <TableRow key={index}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  {project.lists && project.lists.length > 0
                    ? project.lists.map((list) => list.name).join(", ")
                    : "No hay listas asignadas"}
                </TableCell>
                <TableCell>
                  {project.users
                    .map((user) => `${user.firstName} ${user.lastName}`)
                    .join(", ")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditDialogOpen(project._id, project)}
                  >
                    <EditIcon />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => deleteProject(project._id)}
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

const StyledFormControl = styled(FormControl)`
  && {
    margin-block: 10px;
  }
`;

export default ProjectsSearchComponent;
