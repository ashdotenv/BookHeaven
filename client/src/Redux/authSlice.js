import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
  const localUser = localStorage.getItem('user');
  if (localUser) {
    try {
      return JSON.parse(localUser);
    } catch {
      return null;
    }
  }
  return null;
};

const initialState = {
  user: getInitialUser(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('user');
      }
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;