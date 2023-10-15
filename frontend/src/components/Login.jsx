import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import StyledLink from "./style/StyledLink";
import { useTheme } from "@mui/material/styles";

function Login() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const theme = useTheme();
  const bgColor = theme.palette.background.default;
  const color = theme.palette.text.primary;
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    let errors = {};
    if (!email) errors.email = "El email es obligatorio";
    else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
      errors.email = "Por favor, introduce un email válido";
    }
    if (!password) errors.password = "La contraseña es obligatoria";
    setErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors({ general: data.message });
        return;
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userID", data.userID);
      login();
      if (data.role === "admin") {
        setEmail("");
        setPassword("");
        navigate("/admin");
      } else {
        setEmail("");
        setPassword("");
        navigate("/");
      }
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  return (
    <PageWrapper bgColor={bgColor} color={color}>
      <ContentWrapper>
        <h1>Iniciar sesión</h1>
        <FormWrapper onSubmit={handleSubmit}>
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
          <Button type="submit" variant="contained">
            Inicia sesión
          </Button>
          {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
          <p style={{ textAlign: "center" }}>
            ¿No tienes cuenta?{" "}
            <StyledLink to="/register">Regístrate</StyledLink>
          </p>
        </FormWrapper>
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
    padding-inline: 1rem;
    padding-block: 2rem;
    margin-right: auto;
    margin-left: auto;
    max-width: 400px;
  }
`;
const FormWrapper = styled.form`
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

export default Login;
