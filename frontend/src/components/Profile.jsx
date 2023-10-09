import React from 'react';
import styled from 'styled-components';
import UserSettings from './UserSettings';

function Profile() {
  const role = localStorage.getItem('role');
  
  return (
    <>
    {role ? 
      <ContentWrapper>
        <h1>Bienvenido a tu perfil</h1>
        <p>Aquí podrás editar tus datos de usuario:</p>
        <UserSettings />
      </ContentWrapper>
      : <ContentWrapper>
          <p>Inicia sesión o regístrate para acceder a esta página.</p>
        </ContentWrapper> }
    </>
    
  );
}

const ContentWrapper = styled.section`
  && {
    width: -webkit-fill-available;
    padding-inline: 1rem;
    padding-block: 2rem;
    margin-right: auto;
    margin-left: auto;
  }
`;

export default Profile;