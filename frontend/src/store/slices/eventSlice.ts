import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ClubEvent } from './types/Event';

const initialState: ClubEvent[] = []

export const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (_, action: PayloadAction<ClubEvent[]>) => {
        return action.payload
    },
  },
});

export const { setEvents } = eventSlice.actions;
export default eventSlice.reducer; 