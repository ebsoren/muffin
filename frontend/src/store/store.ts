import { configureStore } from '@reduxjs/toolkit';
import statusReducer from './slices/statusSlice';
import eventReducer from './slices/eventSlice'
import boardReducer from './slices/boardSlice'
import recruitingReducer from './slices/recruitingSlice'
import featureReducer from './slices/featureSlice'
import membersReducer from './slices/memberSlice'
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    status: statusReducer,
    events: eventReducer,
    board: boardReducer,
    recruiting: recruitingReducer,
    features: featureReducer,
    members: membersReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 