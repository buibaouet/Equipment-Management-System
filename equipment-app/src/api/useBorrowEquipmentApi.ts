import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQuery';
import { BaseResponse, PagingDataModel } from '../types/Response';
import { PaginationParam } from '../types/PagingParam';
import { BorrowEquipmentEntity, BorrowEquipmentPaging, BorrowEquipmentResponseModel, RequestBorrowEquipmentPaging } from '../types/BorrowEquipment';

export const useBorrowEquipmentApi = createApi({
    reducerPath: 'borrowEquipmentApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['BorrowEquipment'],
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
        returnEquipment: builder.mutation<BaseResponse<boolean>, { id: number; status: number }>({
            query: ({ id, status }) => ({
                url: `/borrow-equipment/return`,
                method: 'PUT',
                body: { id, status },
            }),
            invalidatesTags: ['BorrowEquipment'],
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
    }),
});

export const {
    useGetListBorrowEquipmentPagingMutation,
    useBorrowEquipmentMutation,
    useReturnEquipmentMutation,
    useGetRequestBorrowEquipmentPagingMutation,
    useApproveRequestBorrowEquipmentMutation,
    useRejectRequestBorrowEquipmentMutation,
} = useBorrowEquipmentApi;