import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface StatusState {
  isLoading: boolean;
  currentPage: string;
  theme: 'light' | 'dark';
}

const initialState: StatusState = {
  isLoading: false,
  currentPage: 'home',
  theme: 'light',
};

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setLoading, setCurrentPage, toggleTheme } = statusSlice.actions;
export default statusSlice.reducer; 