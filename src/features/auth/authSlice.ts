import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../interfaces';
import { getToken, getStoredUser, setToken, setStoredUser, removeToken, removeStoredUser } from '../../utils/helpers';

const initialState: AuthState = {
  user: getStoredUser(),
  token: getToken(),
  isAuthenticated: !!getToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      setToken(action.payload.token);
      setStoredUser(action.payload.user);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      setStoredUser(action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      removeToken();
      removeStoredUser();
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
