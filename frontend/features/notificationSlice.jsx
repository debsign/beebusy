import { createSlice } from '@reduxjs/toolkit';

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    hasNewNotifications: false,
  },
  reducers: {
    setHasNewNotifications: (state, action) => {
      state.hasNewNotifications = action.payload;
    },
  },
});

export const { setHasNewNotifications } = notificationSlice.actions;

export const selectHasNewNotifications = (state) => state.notification.hasNewNotifications;

export default notificationSlice.reducer;
