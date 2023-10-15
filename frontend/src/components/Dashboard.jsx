import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";

import { useDispatch } from "react-redux";
import { setHasNewNotifications } from "../../features/notificationSlice";

function Dashboard() {
  // 1. Definición de variables
  const theme = useTheme();
  const bgColor = theme.palette.background.default;
  const color = theme.palette.text.primary;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const role = localStorage.getItem("role");
  const [alerts, setAlerts] = useState([]);
  const userID = localStorage.getItem("userID");

  const dispatch = useDispatch();
  // 2. Funciones
  useEffect(() => {
    const fetchAlerts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/user/${userID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Como queremos las alertas ordenadas de más recientes a menos,
          // utilizamos la función "sort"
          const sortedAlerts = data.alerts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setAlerts(sortedAlerts);
        } else {
          console.error("Error al obtener las alertas:", await response.text());
        }
      } catch (error) {
        console.error("Error al realizar fetch de alertas:", error);
      }
    };

    fetchAlerts();
  }, [userID]);
  const deleteAlert = async (alertId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/api/user/${userID}/alert/${alertId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.error("Error al eliminar la alerta:", await response.text());
        return;
      }
      // Elimina la alerta del estado
      setAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => alert._id !== alertId)
      );
    } catch (error) {
      console.error("Error al eliminar la alerta:", error);
    }
  };

  useEffect(() => {
    // Esto se ejecutará cuando el componente se monte
    // y actualizará el estado Redux a false.
    dispatch(setHasNewNotifications(false));
  }, [dispatch]); // `dispatch` se incluye en las dependencias del efecto
  // 3. Resultado
  return (
    <>
      {role ? (
        <ContentWrapper bgColor={bgColor} color={color}>
          <h2>Bienvenido a tu dashboard</h2>
          <p>Aquí podrás ver tus alertas:</p>
          <Stack sx={{ width: "100%" }} spacing={2}>
            {alerts.length === 0 ? (
              <p>No tienes ninguna notificación, ¡estás al día!</p>
            ) : (
              alerts.map((alert) => (
                <div key={alert._id}>
                  <Alert severity="info" onClose={() => deleteAlert(alert._id)}>
                    <AlertTitle>Info</AlertTitle>
                    {alert.message}
                    <p>{new Date(alert.createdAt).toLocaleString()}</p>
                  </Alert>
                </div>
              ))
            )}
          </Stack>
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
    padding-top: 4rem;
    padding-bottom: 8rem;
    margin-right: auto;
    margin-left: auto;
    height: 100%;
  }
`;

export default Dashboard;
