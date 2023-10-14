import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import StyledLink from "./style/StyledLink";

function Register() {
  const theme = useTheme();
  const bgColor = theme.palette.background.default;
  const color = theme.palette.text.primary;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async () => {
    let errors = {};
    // Validar si los campos están vacíos
    if (!firstName) errors.firstName = "El nombre es obligatorio";
    if (!lastName) errors.lastName = "Los apellidos son obligatorios";
    if (!email) errors.email = "El email es obligatorio";
    else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
      errors.email = "Por favor, introduce un email válido";
    }
    if (!password) errors.password = "La contraseña es obligatoria";
    else if (password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) return;
    try {
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      if (response.ok) {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        navigate("/login"); // Redirige al dashboard
      } else {
        setErrors({ general: "Ha fallado el registro" });
      }
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  return (
    <PageWrapper bgColor={bgColor} color={color}>
      <ContentWrapper>
        <h1>Registro</h1>
        <FormWrapper>
          <TextField
            label="Nombre"
            variant="outlined"
            type="text"
            placeholder="Nombre"
            onChange={(e) => setFirstName(e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            label="Apellidos"
            variant="outlined"
            type="text"
            placeholder="Apellidos"
            onChange={(e) => setLastName(e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Contraseña"
            variant="outlined"
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Regístrame
          </Button>
        </FormWrapper>
        {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
        <p style={{ textAlign: "center" }}>
          ¿Ya tienes cuenta? <StyledLink to="/login">Inicia sesión</StyledLink>
        </p>
      </ContentWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  && {
    background-color: ${(props) => props.bgColor};
    color: ${(props) => props.color};
    height: 100%;
  }
`;
const ContentWrapper = styled.section`
  && {
    background-color: ${(props) => props.bgColor};
    color: ${(props) => props.color};
    padding-inline: 1rem;
    padding-block: 2rem;
    margin-right: auto;
    margin-left: auto;
    max-width: 400px;
  }
`;
const FormWrapper = styled.div`
  && {
    display: flex;
    flex-direction: column;
    align-items: left;
    min-width: 400px;
    gap: 20px;
    @media (max-width: 400px) {
      min-width: 300px;
    }
  }
`;

export default Register;
