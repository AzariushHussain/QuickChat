import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;

      // Store user data and token in local storage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;

      // Clear user data and token from local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setUserFromStorage: (state, action) => {
      // Set user and token from local storage when the app loads
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
});

// Export actions and reducer
export const { login, logout, setUserFromStorage } = authSlice.actions;

export default authSlice.reducer;
