import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Event } from '../../api/types';

const initialState: Event[] = []

export const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (_, action: PayloadAction<Event[]>) => {
        return action.payload
    },
  },
});

export const { setEvents } = eventSlice.actions;
export default eventSlice.reducer; 