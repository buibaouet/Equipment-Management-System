import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQuery';
import { BaseResponse, PagingDataModel } from '../types/Response';
import { PaginationParam } from '../types/PagingParam';
import { BorrowEquipmentDataModel, BorrowEquipmentEntity, BorrowEquipmentPaging, BorrowEquipmentResponseModel, RequestBorrowEquipmentPaging, ReturnEquipmentPayload } from '../types/BorrowEquipment';

export const useBorrowEquipmentApi = createApi({
    reducerPath: 'borrowEquipmentApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['BorrowEquipment', 'OverdueBorrow'],
    endpoints: (builder) => ({
        getListBorrowEquipmentPaging: builder.mutation<
            BaseResponse<PagingDataModel<BorrowEquipmentPaging>>,
            { param: PaginationParam }
        >({
            query: ({ param }) => ({
                url: '/borrow-equipment/paging',
                method: 'POST',
                body: param,
            }),
            invalidatesTags: ['BorrowEquipment'],
        }),
        borrowEquipment: builder.mutation<BaseResponse<BorrowEquipmentResponseModel>, BorrowEquipmentEntity>({
            query: (data) => ({
                url: '/borrow-equipment',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['BorrowEquipment'],
        }),
        returnEquipment: builder.mutation<BaseResponse<boolean>, ReturnEquipmentPayload>({
            query: ({ id, status, processingForm, processingNote }) => ({
                url: `/borrow-equipment/return`,
                method: 'PUT',
                body: { id, status, processingForm, processingNote },
            }),
            invalidatesTags: ['BorrowEquipment'],
        }),
        getBorrowEquipmentById: builder.mutation<BaseResponse<BorrowEquipmentDataModel>, { id: number }>({
            query: ({ id }) => ({
                url: `/borrow-equipment/${id}`,
                method: 'GET',
            }),
        }),
        getRequestBorrowEquipmentPaging: builder.mutation<
            BaseResponse<PagingDataModel<RequestBorrowEquipmentPaging>>,
            { param: PaginationParam }
        >({
            query: ({ param }) => ({
                url: '/borrow-equipment/request/paging',
                method: 'POST',
                body: param,
            }),
            invalidatesTags: ['BorrowEquipment'],
        }),
        approveRequestBorrowEquipment: builder.mutation<BaseResponse<boolean>, { id: number }>({
            query: ({ id }) => ({
                url: `/borrow-equipment/approve/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: ['BorrowEquipment'],
        }),
        rejectRequestBorrowEquipment: builder.mutation<BaseResponse<boolean>, { id: number }>({
            query: ({ id }) => ({
                url: `/borrow-equipment/reject/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: ['BorrowEquipment'],
        }),
        getTotalRequestBorrowEquipment: builder.query<BaseResponse<number>, void>({
            query: () => ({
                url: `/borrow-equipment/request/total`,
                method: 'GET',
            }),
            providesTags: ['BorrowEquipment'],
        }),
        getTotalOverdueBorrowEquipments: builder.query<BaseResponse<number>, void>({
            query: () => ({
                url: `/borrow-equipment/overdue/total`,
                method: 'GET',
            }),
            providesTags: ['OverdueBorrow'],
        }),
        getOverdueBorrowEquipments: builder.query<BaseResponse<BorrowEquipmentDataModel[]>, void>({
            query: () => ({
                url: `/borrow-equipment/overdue`,
                method: 'GET',
            }),
            providesTags: ['OverdueBorrow'],
        }),
    }),
});

export const {
    useGetListBorrowEquipmentPagingMutation,
    useBorrowEquipmentMutation,
    useReturnEquipmentMutation,
    useGetBorrowEquipmentByIdMutation,
    useGetRequestBorrowEquipmentPagingMutation,
    useApproveRequestBorrowEquipmentMutation,
    useRejectRequestBorrowEquipmentMutation,
    useGetTotalRequestBorrowEquipmentQuery,
    useGetTotalOverdueBorrowEquipmentsQuery,
    useGetOverdueBorrowEquipmentsQuery,
} = useBorrowEquipmentApi;