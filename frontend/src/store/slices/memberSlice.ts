import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Member } from './types/Member';


const initialState: Member[] = []

export const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    setMembers: (state, action: PayloadAction<[]>) => {
        state = action.payload
        return state

    },
  },
});

export const { setMembers } = memberSlice.actions;
export default memberSlice.reducer; 