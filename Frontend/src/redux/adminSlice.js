import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },
  },
});

export const { setAdmin, setLoading, setError, logout } = adminSlice.actions;
export default adminSlice.reducer; 