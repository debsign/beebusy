import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import StyledLink from './style/StyledLink';

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const response = await fetch('http://localhost:5001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("DATOS: ", data);
    // token
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);

    if (!response.ok) {
      console.log(data);
      console.error('Error:', data.message);  // Imprime el mensaje de error
      console.error('Detalles:', data.error); // Imprime el objeto de error
    }
    if (response) {
      login();
      if ( data.role === 'admin' ) {
        console.log(data);
        console.log(data.role);
        setEmail('');
        setPassword('');
        navigate('/admin');  // Redirige al dashboard del admin
      } else {
        console.log(data);
        console.log(data.role);
        setEmail('');
        setPassword('');
        navigate('/dashboard');  // Redirige al dashboard
      }
    }
  };

  return (
    <ContentWrapper>
      <h1>Inicio sesión</h1>
      <FormWrapper>
        <TextField label="Email" variant="outlined" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Contraseña" variant="outlined" type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" onClick={handleSubmit}>Inicia sesión</Button>
        <p style={{textAlign: 'center'}}>¿No tienes cuenta? <StyledLink to="/register">Regístrate</StyledLink></p>
      </FormWrapper>
    </ContentWrapper>
  );
}

const ContentWrapper = styled.section`
  && {
    padding-inline: 1rem;
    padding-block: 2rem;
    margin-right: auto;
    margin-left: auto;
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

export default Login;
