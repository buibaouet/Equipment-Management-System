import { configureStore } from '@reduxjs/toolkit';
import { useAuthApi } from '../api/useAuthApi';
import { useUserApi } from '../api/useUserApi';
import { useDepartmentApi } from '../api/useDepartmentApi';
import { useCategoryApi } from '../api/useCategoryApi';

export const store = configureStore({
  reducer: {
    [useAuthApi.reducerPath]: useAuthApi.reducer,
    [useUserApi.reducerPath]: useUserApi.reducer,
    [useDepartmentApi.reducerPath]: useDepartmentApi.reducer,
    [useCategoryApi.reducerPath]: useCategoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      useAuthApi.middleware,
      useUserApi.middleware,
      useDepartmentApi.middleware,
      useCategoryApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
