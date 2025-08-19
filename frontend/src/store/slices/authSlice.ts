import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string; 
  table_id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  email_verified: boolean;
  is_admin: boolean;
  isMember: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    },
    supabaseAuthSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      // Clear the logout flag when user successfully authenticates
      localStorage.removeItem('user_logged_out');
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('supabase_session');
      // Set a flag to indicate user has logged out
      localStorage.setItem('user_logged_out', 'true');
    },
    supabaseLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('supabase_session');
      // Set a flag to indicate user has logged out
      localStorage.setItem('user_logged_out', 'true');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    fetchUserStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUserSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    },
    fetchUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('supabase_session');
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  supabaseAuthSuccess,
  loginFailure, 
  logout, 
  supabaseLogout,
  clearError, 
  updateUser, 
  fetchUserStart, 
  fetchUserSuccess, 
  fetchUserFailure 
} = authSlice.actions;
export default authSlice.reducer; 