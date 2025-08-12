import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Member } from './types/Member';


const initialState: Member[] = []

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<Member[]>) => {
        state = action.payload
        return state

    },
  },
});

export const { setBoard } = boardSlice.actions;
export default boardSlice.reducer; 