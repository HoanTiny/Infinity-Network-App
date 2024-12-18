// Snackbar Slice

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  IsShowDrawer: true,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.IsShowDrawer = !state.IsShowDrawer;
    },
    onpenDrawer: (state) => {
      state.IsShowDrawer = true;
    },
  },
});

export const { toggleDrawer, onpenDrawer } = settingsSlice.actions;
export default settingsSlice.reducer;
