import { configureStore } from '@reduxjs/toolkit';
import { useAuthApi } from '../api/useAuthApi';
import { useUserApi } from '../api/useUserApi';
import { useDepartmentApi } from '../api/useDepartmentApi';
import { useCategoryApi } from '../api/useCategoryApi';
import { useEquipmentApi } from '../api/useEquipmentApi';
import { useBorrowEquipmentApi } from '../api/useBorrowEquipmentApi';
import { useDashboardApi } from '../api/useDashboardApi';

export const store = configureStore({
  reducer: {
    [useAuthApi.reducerPath]: useAuthApi.reducer,
    [useUserApi.reducerPath]: useUserApi.reducer,
    [useDepartmentApi.reducerPath]: useDepartmentApi.reducer,
    [useCategoryApi.reducerPath]: useCategoryApi.reducer,
    [useEquipmentApi.reducerPath]: useEquipmentApi.reducer,
    [useBorrowEquipmentApi.reducerPath]: useBorrowEquipmentApi.reducer,
    [useDashboardApi.reducerPath]: useDashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      useAuthApi.middleware,
      useUserApi.middleware,
      useDepartmentApi.middleware,
      useCategoryApi.middleware,
      useEquipmentApi.middleware,
      useBorrowEquipmentApi.middleware,
      useDashboardApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
