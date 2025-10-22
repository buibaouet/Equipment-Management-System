import { configureStore } from '@reduxjs/toolkit';
import { useAuthApi } from '../pages/AuthPages/useAuthAPI';

export const store = configureStore({
  reducer: {
    [useAuthApi.reducerPath]: useAuthApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(useAuthApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
