import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Event } from '../../api/types';

const initialState: Event[] = []

export const recruitingSlice = createSlice({
  name: 'recruiting',
  initialState,
  reducers: {
    setRecruitingEvents: (state, action: PayloadAction<Event[]>) => {
        state = action.payload
        return state

    },
  },
});

export const { setRecruitingEvents } = recruitingSlice.actions;
export default recruitingSlice.reducer; 