import React, { createContext, useContext, useState } from "react";
// Creamos contexto para pasar datos sin tener que pasar las props a través de cada nivel
const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};
// Componente AuthProvider
export const AuthProvider = ({ children }) => {
  // Lo inicializamos dependiendo de lo que haya en el localstorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  // Definimos el objeto
  const contextValue = {
    isAuthenticated,
    login: () => setIsAuthenticated(true),
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userID");
      setIsAuthenticated(false);
    },
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
