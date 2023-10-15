// Importamos la configuración de la store y el reducer creado
import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./notificationSlice";
// Exportamos la store para poder usarla en la web
export const store = configureStore({
  reducer: {
    notification: notificationReducer,
  },
});
