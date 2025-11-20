import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQuery';
import { BaseResponse } from '../types/Response';
import { BorrowReturnChartModel, DashboardModel } from '../types/Dashboard';
import { ChartPeriodType } from '../utils/enumerations';

export const useDashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Dashboard'],
    endpoints: (builder) => ({
        getDashboardData: builder.query<BaseResponse<DashboardModel>, void>({
            query: () => ({
                method: 'GET',
                url: `/dashboard/`,
            }),
            providesTags: ['Dashboard'],
        }),
        getDashboardBorrow: builder.query<BaseResponse<BorrowReturnChartModel[]>, {periodType: ChartPeriodType}>({
            query: ({ periodType }) => ({
                method: 'GET',
                url: `/dashboard/borrow-chart?periodType=${periodType}`,
            }),
            providesTags: ['Dashboard'],
        }),
    }),
});

export const {
    useGetDashboardDataQuery,
    useGetDashboardBorrowQuery,
} = useDashboardApi;