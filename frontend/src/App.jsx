import { useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components";
import GlobalStyles from "./GlobalStyles";
import ProjectList from "./components/ProjectList";
import BeebusyProject from "./components/BeebusyProject";
import Header from "./Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddNewElement from "./components/AddNewElement";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DragDropContext } from "react-beautiful-dnd";

// Importar los componentes de usuario
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";

import { AuthProvider } from "./AuthContext";
import Footer from "./Footer";

function App() {
  const [toggleDark, settoggleDark] = useState(false);

  const myTheme = createTheme({
    palette: {
      type: toggleDark ? "dark" : "light",
      background: {
        default: toggleDark ? "#333" : "#fff",
      },
      text: {
        default: toggleDark ? "#fff" : "#000",
        primary: toggleDark ? "#fff" : "#000",
        secondary: toggleDark
          ? "rgba(255, 255, 255, 0.54)"
          : "rgba(0, 0, 0, 0.54)",
      },
      header: {
        background: toggleDark ? "#FFD700" : "#f9f9f9",
        color: toggleDark ? "#fff" : "#000",
      },
      footer: {
        background: toggleDark ? "#FFD700" : "#F0DB4F",
        color: toggleDark ? "#000" : "#000",
      },
      dialog: {
        background: toggleDark ? "#333" : "#FFD700",
      },
      // Botones
      primary: {
        main: toggleDark ? "#fff" : "#000",
      },
      secondary: {
        main: toggleDark ? "#FFD700" : "#FFD700",
      },
    },
  });
  const handleModeChange = () => {
    settoggleDark(!toggleDark);
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={myTheme}>
        <BrowserRouter>
          <Header toggleDark={toggleDark} handleModeChange={handleModeChange} />
          <GlobalStyles />
          <OuterContainer>
            <DragDropContext>
              <AppContent />
            </DragDropContext>
          </OuterContainer>
          <Footer />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectList />} />{" "}
        {/* Nueva ruta para la lista de proyectos */}
        <Route path="/projects/:projectId" element={<BeebusyProject />} />{" "}
        {/* Modificar esta ruta para los proyectos individuales */}
        <Route path="/" element={<ProjectList />} />{" "}
        {/* Modificado para mostrar la lista de proyectos por defecto */}
      </Routes>
    </>
  );
}

const OuterContainer = styled.div`
  height: 100vh;
  /* padding-bottom: 100px; */
  /* overflow: hidden; */
  display: flex;
  flex-direction: column;
`;
const MainStyled = styled.main`
  flex-grow: 1;
  padding-inline: 1rem;
  padding-block: 5rem;
  overflow-y: auto;
  overflow-x: auto;
  white-space: nowrap;
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-gap: 20px;
  grid-auto-flow: column;
`;

export default App;
