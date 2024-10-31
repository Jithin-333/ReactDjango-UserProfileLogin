import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('access_token'),
  isLoading: false,
  error: null,
  registrationSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      
      localStorage.setItem('user',JSON.stringify(action.payload.user));
      localStorage.setItem('access_token', action.payload.token);


    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      
      localStorage.removeItem('user');

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.registrationSuccess = false;
    },
    registerSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
      state.registrationSuccess = true;
    },
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.registrationSuccess = false;
    },
    clearRegistrationStatus: (state) => {
      state.registrationSuccess = false;
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  clearRegistrationStatus,
} = authSlice.actions;

export default authSlice.reducer;