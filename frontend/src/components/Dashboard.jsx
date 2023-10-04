// Dashboard.js
import React from 'react';
import styled from 'styled-components';

function Dashboard() {

  const role = localStorage.getItem('role');
  console.log(role);
  
  return (
    <ContentWrapper>
      {role ? <h1>Bienvenido al Dashboard</h1> : <p>No tienes permisos para acceder a esta página</p> }
    </ContentWrapper>
  );
}

const ContentWrapper = styled.section`
  && {
    width: 100%;
    padding-inline: 1rem;
    padding-block: 2rem;
    margin-right: auto;
    margin-left: auto;
  }
`;

export default Dashboard;