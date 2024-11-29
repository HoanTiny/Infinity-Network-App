// Snackbar Slice

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  message: '',
  type: 'success',
};

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    openSnackbar: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    closeSnackbar: (state) => {
      state.open = false;
    },
  },
});

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
