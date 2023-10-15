import { createSlice } from "@reduxjs/toolkit";
// Creamos slice
export const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    // Iniciamos a falso
    hasNewNotifications: false,
  },
  reducers: {
    setHasNewNotifications: (state, action) => {
      state.hasNewNotifications = action.payload;
    },
  },
});

export const { setHasNewNotifications } = notificationSlice.actions;
// Devuelve el estado global
export const selectHasNewNotifications = (state) =>
  state.notification.hasNewNotifications;

export default notificationSlice.reducer;
