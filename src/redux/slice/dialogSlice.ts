// Snackbar Slice

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  title: null,
  content: null,
  actions: null,
  maxWidth: 'xs',
  fullWidth: true,
};

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openDialog: (state, action) => {
      return { ...state, ...action.payload, open: true };
    },
    closeDialog: () => {
      return initialState;
    },
  },
});

export const { openDialog, closeDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
