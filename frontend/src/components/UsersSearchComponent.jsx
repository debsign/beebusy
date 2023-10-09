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



const UsersSearchComponent = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setnewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "worker"
  });
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Información
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
          setIsLoading(false);
        } else {
          console.error('Error al obtener usuarios:', await response.text());
        }

      } catch (error) {
        console.error('Error al realizar fetch:', error);
      }
    };

    fetchUsers();
  }, []);
  if (isLoading) {
    return <div className='loader'></div>;
  }
  // Buscar user
  const usersFiltrados = Array.isArray(users) ? users.filter(user => 
    user.email && user.email.toLowerCase().includes(busqueda.toLowerCase())
  ) : [];
  // Crear user
  const addUser = user => {
    const token = localStorage.getItem('token');
    if (!token){
        console.error('Token no encontrado');
        return;
    }
    fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Recargar los users después de añadir uno nuevo
      const token = localStorage.getItem('token');
      fetch(`${BASE_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => setUsers(data));
      setnewUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "worker"
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  
  // Borrar user
  const deleteUser = id => {
    const token = localStorage.getItem('token');
    if (!token){
        console.error('Token no encontrado');
        return;
    }
    fetch(`${BASE_URL}/api/user/${id}`, {
        method: 'DELETE',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    }).then(() => {
        setUsers(users.filter(user => user._id !== id));
    });
  };
  // Modificar user
  const updateUser = (id, updatedUser) => {
    const token = localStorage.getItem('token');
    if (!token){
        console.error('Token no encontrado');
        return;
    }
    fetch(`${BASE_URL}/api/user/${id}`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser),
    })
      .then(() => {
        // Recargar los users después de actualizar uno
        fetch(`${BASE_URL}/api/users`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
            },
        })
          .then(response => response.json())
          .then(data => setUsers(data));
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  // Dialog para añadir user
  const handleAddDialogOpen = () => {
    setEditMode(false);
    setnewUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "worker"
    });
    setOpenDialog(true);
  };
  // Dialog para editar user
  const handleEditDialogOpen = (userId, userData) => {
    setEditMode(true);
    setCurrentUserId(userId);
    setnewUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      role: userData.role
    });
    setOpenDialog(true);
  };
  // Cerrar el dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentUserId(null);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;

    setnewUser((prevUser) => ({
        ...prevUser,
        [name]: value,
    }));
};

  const saveUser = user => {
    if (editMode) {
      updateUser(currentUserId, user);
    } else {
      addUser(user);
    }
  };

  return (
    <>
        <div style={{paddingBlock: '1rem', display: 'flex'}} className='contentSearch'>
            <TextField 
                label="Buscar usuario" 
                variant="outlined" 
                value={busqueda} 
                onChange={e => setBusqueda(e.target.value)} 
            />
            <Button style={{marginLeft: 'auto'}} variant="contained" color="primary" onClick={handleAddDialogOpen}>Añadir user</Button>
        </div>
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>{editMode ? 'Editar user' : 'Añadir nuevo user'}</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="dense" name="firstName" label="Nombre" type="text" fullWidth variant="standard" value={newUser.firstName || ''} onChange={handleChange} />
            <TextField margin="dense" name="lastName" label="Apellido" type="text" fullWidth variant="standard" value={newUser.lastName || ''} onChange={handleChange} />
            <TextField margin="dense" name="email" label="Email" type="email" fullWidth variant="standard" value={newUser.email || ''} onChange={handleChange} />
            <TextField margin="dense" name="password" label="Contraseña" type="password" fullWidth variant="standard" value={newUser.password || ''} onChange={handleChange} />
            <TextField margin="dense" name="role" label="Rol" type="text" fullWidth variant="standard" value={newUser.role || ''} onChange={handleChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancelar</Button>
            <Button onClick={() => { saveUser(newUser); handleDialogClose(); }}>{editMode ? 'Guardar' : 'Añadir'}</Button>
          </DialogActions>
        </Dialog>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contraseña</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Editar</TableCell>
                <TableCell>Borrar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersFiltrados.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.password}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleEditDialogOpen(user._id, user)}><EditIcon /></Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => deleteUser(user._id)}><DeleteIcon /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </>
  );
};

export default UsersSearchComponent;