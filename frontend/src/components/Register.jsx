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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    let errors = {};
    // Validar si los campos están vacíos
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) errors[field] = `${field} es obligatorio`;
    });
    if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.email)
    ) {
      errors.email = "Por favor, introduce un email válido";
    }
    if (formData.password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    setErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        });
        navigate("/login"); // Redirige al dashboard
      } else {
        setErrors({ general: "Ha fallado el registro" });
      }
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  const fieldNames = {
    firstName: "Nombre",
    lastName: "Apellidos",
    email: "Email",
    password: "Contraseña",
  };

  return (
    <PageWrapper bgColor={bgColor} color={color}>
      <ContentWrapper>
        <h1>Registro</h1>
        <FormWrapper onSubmit={handleSubmit}>
          {Object.keys(fieldNames).map((field) => (
            <TextField
              key={field}
              label={fieldNames[field]}
              variant="outlined"
              type={
                field === "email"
                  ? "email"
                  : field === "password"
                  ? "password"
                  : "text"
              }
              placeholder={fieldNames[field]}
              name={field}
              onChange={handleChange}
              error={!!errors[field]}
              helperText={errors[field]}
            />
          ))}
          <Button type="submit" variant="contained">
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

export default Register;
