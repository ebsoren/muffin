import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Event } from '../../api/types';

const initialState: Event[] = []

export const featureSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {
    setFeatures: (state, action: PayloadAction<Event[]>) => {
        state = action.payload
        return state

    },
  },
});

export const { setFeatures } = featureSlice.actions;
export default featureSlice.reducer; 