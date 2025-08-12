import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Member } from './types/Member';


const initialState: Member[] = []

export const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    setMembers: (_, action: PayloadAction<Member[]>) => {
        return action.payload
    },
  },
});

export const { setMembers } = memberSlice.actions;
export default memberSlice.reducer; 