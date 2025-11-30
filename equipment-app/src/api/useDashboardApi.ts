import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQuery';
import { BaseResponse, PagingDataModel } from '../types/Response';
import { BorrowReturnChartModel, DashboardModel, UserRankingTopModel } from '../types/Dashboard';
import { ChartPeriodType } from '../utils/enumerations';
import { PaginationParam } from '../types/PagingParam';

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
        getTableRankingTop: builder.mutation<PagingDataModel<UserRankingTopModel>, { param: PaginationParam }>({
            query: ({ param }) => ({
                url: '/dashboard/top-owners',
                method: 'POST',
                body: param,
            }),
            invalidatesTags: ['Dashboard'],
        }),
    }),
});

export const {
    useGetDashboardDataQuery,
    useGetDashboardBorrowQuery,
    useGetTableRankingTopMutation,
} = useDashboardApi;