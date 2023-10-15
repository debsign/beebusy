import { useEffect, useState } from "react";
import styled from "styled-components";
import GlobalStyles from "./GlobalStyles";
import ProjectList from "./components/ProjectList";
import BeebusyProject from "./components/BeebusyProject";
import Header from "./Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DragDropContext } from "react-beautiful-dnd";
// Importamos los componentes de usuario
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";

import { AuthProvider } from "./AuthContext";
import Footer from "./Footer";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const myTheme = createTheme({
    palette: {
      type: isDarkMode ? "dark" : "light",
      background: {
        default: isDarkMode ? "#333" : "#fff",
      },
      text: {
        default: isDarkMode ? "#fff" : "#000",
        primary: isDarkMode ? "#fff" : "#000",
        secondary: isDarkMode
          ? "rgba(255, 255, 255, 0.54)"
          : "rgba(0, 0, 0, 0.54)",
      },
      header: {
        background: isDarkMode ? "#FFD700" : "#f9f9f9",
        color: isDarkMode ? "#fff" : "#000",
      },
      footer: {
        background: isDarkMode ? "#FFD700" : "#F0DB4F",
        color: isDarkMode ? "#000" : "#000",
      },
      dialog: {
        background: isDarkMode ? "#333" : "#FFD700",
      },
      // Botones
      primary: {
        main: isDarkMode ? "#fff" : "#000",
      },
      secondary: {
        main: isDarkMode ? "#FFD700" : "#FFD700",
      },
    },
  });
  const handleModeChange = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={myTheme}>
        <GlobalStyles />
        <BrowserRouter>
          <Header isDarkMode={isDarkMode} handleModeChange={handleModeChange} />
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
  display: flex;
  flex-direction: column;
`;

export default App;
