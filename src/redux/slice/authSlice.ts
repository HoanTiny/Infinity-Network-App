import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  refreshToken: null,
  userInfo: {},
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    logOut: () => {
      return initialState;
    },

    saveUserinfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const { login, logOut, saveUserinfo } = authSlice.actions;
export default authSlice.reducer;
