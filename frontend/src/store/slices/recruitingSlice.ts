import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ClubEvent } from './types/Event';

const initialState: ClubEvent[] = []

export const recruitingSlice = createSlice({
  name: 'recruiting',
  initialState,
  reducers: {
    setRecruitingEvents: (state, action: PayloadAction<[]>) => {
        state = action.payload
        return state

    },
  },
});

export const { setRecruitingEvents } = recruitingSlice.actions;
export default recruitingSlice.reducer; 