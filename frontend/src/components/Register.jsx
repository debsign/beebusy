import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import styled from "styled-components"
import { useNavigate } from 'react-router-dom';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    const response = await fetch('http://localhost:5001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    if (response) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      navigate('/dashboard');  // Redirige al dashboard
    }

  };

  return (
    <ContentWrapper>
      <h1>Registro</h1>
      <FormWrapper>
        <TextField label="Nombre" variant="outlined" type="text" placeholder="Nombre" onChange={(e) => setFirstName(e.target.value)} />
        <TextField label="Apellidos" variant="outlined" type="text" placeholder="Apellidos" onChange={(e) => setLastName(e.target.value)} />
        <TextField label="Email" variant="outlined" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Contraseña" variant="outlined" type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" onClick={handleSubmit}>Regístrame</Button>
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

export default Register;
