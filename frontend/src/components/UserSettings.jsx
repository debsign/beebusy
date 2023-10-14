import React, { useEffect, useState } from "react";
import { TextField, Button, Avatar, Grid } from "@mui/material";
import styled from "styled-components";

const avatars = [
  "./src/assets/images/avatar-woman.svg",
  "./src/assets/images/avatar-man.svg",
];

const UserSettings = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    avatar: "",
  });
  // Información
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userID");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/user/${userID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error("Error al obtener usuarios:", await response.text());
        }
      } catch (error) {
        console.error("Error al realizar fetch:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleAvatarClick = (avatar) => {
    setUser((prevUser) => ({ ...prevUser, avatar }));
  };

  const saveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/user/${user._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        console.log("Usuario actualizado");
      } else {
        console.error("Error al actualizar usuario:", await response.text());
      }
    } catch (error) {
      console.error("Error en fetch:", error);
    }
  };

  return (
    <SettingsContainer>
      <TextField
        label="Nombre"
        variant="filled"
        value={user.firstName}
        name="firstName"
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Apellido"
        variant="filled"
        value={user.lastName}
        name="lastName"
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Correo electrónico"
        variant="filled"
        value={user.email}
        name="email"
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Contraseña"
        variant="filled"
        value={user.password}
        name="password"
        type="password"
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <Grid container spacing={2}>
        {avatars.map((avatar, index) => (
          <Grid item key={index}>
            <StyledAvatar
              src={avatar}
              alt="Avatar"
              onClick={() => handleAvatarClick(avatar)}
              selected={user.avatar === avatar}
              sx={{ width: 56, height: 56 }}
            />
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="primary" onClick={saveChanges}>
        Guardar cambios
      </Button>
    </SettingsContainer>
  );
};

const SettingsContainer = styled.div`
  max-width: 500px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
  border: ${(props) => (props.selected ? "2px solid blue" : "none")};
`;

export default UserSettings;
