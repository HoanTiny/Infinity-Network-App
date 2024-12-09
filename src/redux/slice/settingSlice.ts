// Snackbar Slice

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  IsShowDrawer: true,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    openSetting: (state) => {
      state.IsShowDrawer = !state.IsShowDrawer;
    },
  },
});

export const { openSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
