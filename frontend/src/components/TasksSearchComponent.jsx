import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import moment from 'moment';

const TasksSearchComponent = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setnewTask] = useState({
    name: "",
    startDate: "",
    dueDate: "",
    users: [],
    projects: "",
    lists: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [projectUsers, setProjectUsers] = useState([]);
  const [projectLists, setProjectLists] = useState([]);
  // Proyectos de la tarea
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchProjects = async () => {
        const token = localStorage.getItem('token');
        if (!token){
            console.error('Token no encontrado');
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/api/projects`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            } else {
                console.error('Error al obtener los usuarios:', await response.text());
            }

        } catch (error) {
            console.error('Error al realizar fetch de usuarios:', error);
        }
    };
    fetchProjects();
  }, []);

  // Usuarios del proyecto
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token){
            console.error('Token no encontrado');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error('Error al obtener los usuarios:', await response.text());
            }

        } catch (error) {
            console.error('Error al realizar fetch de usuarios:', error);
        }
    };

    fetchUsers();
  }, []);

  // Listas del proyecto
  const [lists, setLists] = useState([]);
  useEffect(() => {
    const fetchLists = async () => {
        const token = localStorage.getItem('token');
        if (!token){
            console.error('Token no encontrado');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/lists`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setLists(data);
            } else {
                console.error('Error al obtener las listas:', await response.text());
            }

        } catch (error) {
            console.error('Error al realizar fetch de listas:', error);
        }
    };

    fetchLists();
  }, []);

  // Información de las tareas
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token){
        console.error('Token no encontrado');
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/tasks`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
          setIsLoading(false);
        } else {
          console.error('Error al obtener usuarios:', await response.text());
        }

      } catch (error) {
        console.error('Error al realizar fetch:', error);
      }
    };

    fetchTasks();
  }, []);
  if (isLoading) {
    return <div>Cargando...</div>;
  }
  // Buscar tarea
  const tasksFiltradas = Array.isArray(tasks) ? tasks.filter(task => 
    task.name && task.name.toLowerCase().includes(busqueda.toLowerCase())
  ) : [];
  // Crear task
  const addTask = task => {
    const token = localStorage.getItem('token');
    if (!token){
        console.error('Token no encontrado');
        return;
    }
    fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Recargar los tasks después de añadir uno nuevo
      const token = localStorage.getItem('token');
      fetch(`${BASE_URL}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => setTasks(data));
      setnewTask({
        name: "",
        startDate: "",
        dueDate: "",
        users: [],
        projects: "",
        lists: [],
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  // Borrar task
  const deleteTask = id => {
    const token = localStorage.getItem('token');
    if (!token){
        console.error('Token no encontrado');
        return;
    }
    fetch(`${BASE_URL}/api/task/${id}`, {
        method: 'DELETE',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    }).then(() => {
        setTasks(tasks.filter(task => task._id !== id));
    });
  };
  // Modificar task
  const updateTask = (id, updatedTask) => {
    const token = localStorage.getItem('token');
    if (!token){
        console.error('Token no encontrado');
        return;
    }
    fetch(`${BASE_URL}/api/task/${id}`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask),
    })
      .then(() => {
        // Recargar los tasks después de actualizar uno
        fetch(`${BASE_URL}/api/tasks`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
            },
        })
          .then(response => response.json())
          .then(data => setTasks(data));
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  // Dialog para añadir task
  const handleAddDialogOpen = () => {
    // console.log('Valor actual de newTask.projects:', newTask.projects);
    setEditMode(false);
    setnewTask({
        name: "",
        startDate: "",
        dueDate: "",
        users: [],
        projects: "",
        lists: [],
    });
    setOpenDialog(true);
  };
  // Dialog para editar task
  const handleEditDialogOpen = (taskId, taskData) => {
    setEditMode(true);
    setCurrentTaskId(taskId);

    const userNames = taskData.users?.map(user => {
      return user ? `${user.firstName} ${user.lastName}` : null;
    }).filter(userName => userName !== null);

    const projectName = taskData.projects?.map(project => {
      return project ? `${project.title}` : null;
    }).filter(projectName => projectName !== null);

    const listName = taskData.lists?.map(list => {
      return list ? `${list.name}` : null;
    }).filter(listName => listName !== null);

    setnewTask({
      name: taskData.name,
      startDate: taskData.startDate,
      dueDate: taskData.dueDate,
      users: userNames,
      projects: projectName,
      lists: listName,
    });
    setOpenDialog(true);
  };
  // Cerrar el dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentTaskId(null);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setnewTask((prevTask) => {
      const updatedTask = { ...prevTask, [name]: value };
      // console.log("newTask updated:", updatedTask);
      return updatedTask;
  });
  // Solamente muestra los usuarios y las listas del proyecto seleccionado
  if (name === 'projects') {
    const selectedProject = projects.find(project => project.title === value);
    if (selectedProject) {
      setProjectUsers(selectedProject.users);
      setProjectLists(selectedProject.lists);
    } else {
      setProjectUsers([]);
      setProjectLists([]);
    }
  }
};

  const saveTask = task => {
    const taskWithUserIds = {
      ...task,
      users: task.users.map(userName => {
        const user = users.find(user => `${user.firstName} ${user.lastName}` === userName);
        return user ? user._id : null;
      }).filter(userId => userId !== null),
      projects: projects.find(project => project.title === task.projects)?._id || null,
      lists: task.lists.map(listName => {
        const list = lists.find(list => list.name === listName);
        return list ? list._id : null;
    }).filter(listId => listId !== null),
    };

    // console.log('taskWithUserIds', taskWithUserIds);
  
    if (editMode) {
        updateTask(currentTaskId, taskWithUserIds);
    } else {
        addTask(taskWithUserIds);
    }
  };
  // console.log('tasksFiltradas', tasksFiltradas);

  return (
    <>
        <div style={{paddingBlock: '1rem', display: 'flex'}} className='contentSearch'>
            <TextField 
                label="Buscar tarea" 
                variant="outlined" 
                value={busqueda} 
                onChange={e => setBusqueda(e.target.value)} 
            />
            <Button style={{marginLeft: 'auto'}} variant="contained" color="primary" onClick={handleAddDialogOpen}>Añadir tarea</Button>
        </div>
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>{editMode ? 'Editar tarea' : 'Añadir nuevo tarea'}</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="dense" name="name" label="Nombre de la tarea" type="text" fullWidth variant="standard" value={newTask.name || ''} onChange={handleChange} />
            <FormControl fullWidth>
              <InputLabel id="projects-label">Proyectos</InputLabel>
              <Select
                labelId="projects-label"
                id="projects"
                name="projects"
                
                value={newTask.projects || ''}
                onChange={handleChange}
              >
                {projects.map((project) => (
                  <MenuItem key={project._id} value={`${project.title}`}>
                    {project.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="lists-label">Listas</InputLabel>
              <Select
                  labelId="lists-label"
                  id="lists"
                  name="lists"
                  multiple
                  value={newTask.lists || ""}
                  onChange={handleChange}
              >
                  {projectLists.map((list) => (
                      <MenuItem 
                        key={list._id} 
                        value={`${list.name}`}
                        disabled={newTask.lists && newTask.lists.length > 0 && !newTask.lists.includes(list.name)}
                        >
                          {list.name}
                      </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="users-label">Usuarios</InputLabel>
              <Select
                labelId="users-label"
                id="users"
                name="users"
                multiple
                value={newTask.users || []}
                onChange={handleChange}
              >
                {projectUsers.map((user) => (
                  <MenuItem key={user._id} value={`${user.firstName} ${user.lastName}`}>
                    {user.firstName} {user.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField margin="dense" name="startDate" label="Fecha de inicio" type="date" focused fullWidth value={newTask.startDate ? moment(newTask.startDate).format('YYYY-MM-DD') : ''} onChange={handleChange} />
            <TextField margin="dense" name="dueDate" label="Fecha de final" type="date" focused fullWidth value={newTask.dueDate ? moment(newTask.dueDate).format('YYYY-MM-DD') : ''} onChange={handleChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancelar</Button>
            <Button onClick={() => { saveTask(newTask); handleDialogClose(); }}>{editMode ? 'Guardar' : 'Añadir'}</Button>
          </DialogActions>
        </Dialog>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="tasks table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre tarea</TableCell>
                <TableCell>Proyecto</TableCell>
                <TableCell>Lista</TableCell>
                <TableCell>Usuarios</TableCell>
                <TableCell>Fecha de inicio</TableCell>
                <TableCell>Fecha de final</TableCell>
                <TableCell>Editar</TableCell>
                <TableCell>Borrar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasksFiltradas.map((task, index) => (
                <TableRow key={index}>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>
                  {task.projects ? task.projects.map(project => `${project.title}`).join(', ') : ""}
                  </TableCell>
                  <TableCell>
                  {Array.isArray(task.lists) ? task.lists.map(list => `${list.name}`).join(', ') : ""}
                  </TableCell>
                  <TableCell>
                  {task.users.map(user => `${user.firstName} ${user.lastName}`).join(', ')}
                    </TableCell>
                  <TableCell>{moment(task.startDate).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>{moment(task.dueDate).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleEditDialogOpen(task._id, task)}><EditIcon /></Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => deleteTask(task._id)}><DeleteIcon /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </>
  );
};

export default TasksSearchComponent;