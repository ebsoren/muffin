import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ClubEvent } from './types/Event';

const initialState: ClubEvent[] = []

export const featureSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {
    setFeatures: (state, action: PayloadAction<ClubEvent[]>) => {
        state = action.payload
        return state

    },
  },
});

export const { setFeatures } = featureSlice.actions;
export default featureSlice.reducer; 