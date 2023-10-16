import { useEffect, useState } from "react";
import {
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import moment from "moment";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
// Redux
import { useDispatch } from "react-redux";
import { setHasNewNotifications } from "../../features/notificationSlice";

const BeebusyCard = ({
  projectId,
  taskid,
  content,
  onUpdateTask,
  projectName,
}) => {
  const theme = useTheme();
  const bgColor = theme.palette.dialog.background;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [tasks, setTasks] = useState([]);
  const [initialTask, setInitialTask] = useState({
    name: "",
    description: "",
    startDate: "",
    dueDate: "",
    users: [],
    projects: "",
    lists: [],
  });

  const [newTask, setNewTask] = useState(initialTask);
  const [openDialog, setOpenDialog] = useState(false);
  const [projectUsers, setProjectUsers] = useState([]);
  const dispatch = useDispatch();

  // Info de las tareas
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/tasks`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error("Error al obtener tareas:", await response.text());
        }
      } catch (error) {
        console.error("Error al realizar fetch:", error);
      }
    };

    fetchTasks();
  }, []); // tasks
  // Info del proyecto
  useEffect(() => {
    const fetchProjectUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/project/${projectId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const project = await response.json();
          setProjectUsers(project.users);
        } else {
          console.error(
            "Error al obtener usuarios del proyecto:",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Error al realizar fetch:", error);
      }
    };

    if (openDialog) {
      fetchProjectUsers();
    }
  }, [openDialog]);
  const handleEditDialogOpen = (taskId) => {
    const taskData = tasks.find((task) => task._id === taskId);
    if (!taskData) return;

    const task = {
      name: taskData.name,
      description: taskData.description || "",
      startDate: taskData.startDate,
      dueDate: taskData.dueDate,
      users: taskData.users.map((user) => `${user.firstName} ${user.lastName}`),
    };

    setInitialTask(task);
    setNewTask(task);
    setOpenDialog(true);
  };
  const handleDialogClose = () => {
    setNewTask(initialTask);
    setOpenDialog(false);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewTask((prevTask) => {
      const updatedTask = { ...prevTask, [name]: value };
      return updatedTask;
    });
  };
  const notifyUser = async (userId, message, taskAlert, projectName) => {
    // Si el ID del usuario al que se le asigna la tarea no es igual al ID del usuario logueado, no notificamos
    const currentUserId = localStorage.getItem("userID");
    if (userId !== currentUserId) {
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/user/${userId}/alert`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `${message} (${taskAlert}) en el proyecto "${projectName}"`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Redux
      dispatch(setHasNewNotifications(true));
    } catch (error) {
      console.error("Error al enviar la alerta:", error);
    }
  };
  const saveTask = (updatedTask) => {
    // Convierte los nombres de los usuarios a sus ids
    const userIds = projectUsers
      .filter((user) =>
        updatedTask.users.includes(`${user.firstName} ${user.lastName}`)
      )
      .map((user) => user._id);
    // Prepara la tarea actualizada
    const taskToUpdate = {
      name: updatedTask.name,
      description: updatedTask.description,
      startDate: updatedTask.startDate,
      dueDate: updatedTask.dueDate,
      users: userIds.map((id) => ({ _id: id })),
    };
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }

    fetch(`${BASE_URL}/api/task/${taskid}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskToUpdate),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Error en la respuesta del servidor:", response);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const updatedTasks = tasks.map((task) =>
          task._id === taskid ? { ...task, ...data.task } : task
        );
        setTasks(updatedTasks);
        const updatedTaskData = { ...data.task, _id: taskid };
        onUpdateTask(updatedTaskData);

        // Notifica a los usuarios
        taskToUpdate.users.forEach((user) => {
          notifyUser(
            user._id,
            "Te han asignado una nueva tarea",
            data.task.name,
            projectName
          );
        });

        // Actualiza initialTask y newTask con los datos más recientes
        const taskData = tasks.find((task) => task._id === taskid);
        if (taskData) {
          const updatedUsers = taskData.users.map(
            (user) => `${user.firstName} ${user.lastName}`
          );
          const finalUpdatedTask = { ...taskData, users: updatedUsers };
          setInitialTask(finalUpdatedTask);
          setNewTask(finalUpdatedTask);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            backgroundColor: bgColor,
          },
        }}
      >
        <DialogTitle>Editar tarea</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4}>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Nombre de la tarea"
                type="text"
                fullWidth
                variant="standard"
                value={newTask.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                autoFocus
                margin="dense"
                name="description"
                label="Descripción de la tarea"
                type="text"
                fullWidth
                variant="standard"
                multiline
                value={newTask.description}
                onChange={handleChange}
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <StyledFormControl fullWidth variant="standard">
                <InputLabel id="users-label">Usuarios</InputLabel>
                <Select
                  labelId="users-label"
                  id="users"
                  name="users"
                  multiple
                  value={newTask.users}
                  onChange={handleChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {projectUsers.map((user) => (
                    <MenuItem
                      key={user._id}
                      value={`${user.firstName} ${user.lastName}`}
                    >
                      <Checkbox
                        checked={
                          newTask.users.indexOf(
                            `${user.firstName} ${user.lastName}`
                          ) > -1
                        }
                      />
                      <ListItemText
                        primary={`${user.firstName} ${user.lastName}`}
                      />
                      {/* {user.firstName} {user.lastName} */}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                margin="dense"
                name="startDate"
                label="Fecha de inicio"
                type="date"
                fullWidth
                value={moment(newTask.startDate).format("YYYY-MM-DD")}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                margin="dense"
                name="dueDate"
                label="Fecha de finalización"
                type="date"
                fullWidth
                value={moment(newTask.dueDate).format("YYYY-MM-DD")}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              saveTask(newTask);
              handleDialogClose();
              window.location.reload();
            }}
            color="primary"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <StyledPaper>
        <p style={{ color: "black", fontWeight: "bold" }} id={taskid}>
          {content}
        </p>
        <IconButton onClick={() => handleEditDialogOpen(taskid)}>
          <EditIcon />
        </IconButton>
      </StyledPaper>
    </>
  );
};

const StyledPaper = styled(Paper)`
  && {
    background-color: var(--yellowjslighter);
    margin-bottom: 1rem;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  p {
    margin: 0;
  }
`;
const StyledFormControl = styled(FormControl)`
  && {
    margin-block: 10px;
  }
`;
export default BeebusyCard;
