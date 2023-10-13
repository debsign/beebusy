import React from "react";
import styled from "styled-components";
import UserSettings from "./UserSettings";
import { useTheme } from "@mui/material/styles";

function Profile() {
  const theme = useTheme();
  const bgColor = theme.palette.background.default;
  const color = theme.palette.text.primary;
  const role = localStorage.getItem("role");

  return (
    <>
      {role ? (
        <ContentWrapper bgColor={bgColor} color={color}>
          <h1>Bienvenido a tu perfil</h1>
          <p>Aquí podrás editar tus datos de usuario:</p>
          <UserSettings />
        </ContentWrapper>
      ) : (
        <ContentWrapper bgColor={bgColor} color={color}>
          <p>Inicia sesión o regístrate para acceder a esta página.</p>
        </ContentWrapper>
      )}
    </>
  );
}

const ContentWrapper = styled.section`
  && {
    background-color: ${(props) => props.bgColor};
    color: ${(props) => props.color};
    width: -webkit-fill-available;
    padding-inline: 1rem;
    padding-block: 2rem;
    margin-right: auto;
    margin-left: auto;
    height: -webkit-fill-available;
  }
`;

export default Profile;
