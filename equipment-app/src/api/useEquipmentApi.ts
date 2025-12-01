import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQuery';
import { BaseResponse, PagingDataModel } from '../types/Response';
import { EquipmentModel, EquipmentPagingResponse, EquipmentPagingParam, EquipmentResponseModel, EquipmentEntity, MyEquipmentPagingResponse, EquipmentHistoryModel } from '../types/Equipment';
import { PaginationParam } from '../types/PagingParam';

export const useEquipmentApi = createApi({
    reducerPath: 'equipmentApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Equipment'],
    endpoints: (builder) => ({
        exportEquipment: builder.mutation<Blob, void>({
            query: () => ({
                url: '/equipment/export',
                method: 'GET',
                responseHandler: (response: Response) => response.blob(),
            }),
        }),
        getListEquipmentPaging: builder.mutation<
            BaseResponse<PagingDataModel<EquipmentPagingResponse>>,
            { param: EquipmentPagingParam }
        >({
            query: ({ param }) => ({
                url: '/equipment/paging',
                method: 'POST',
                body: param,
            }),
            invalidatesTags: ['Equipment'],
        }),
        getEquipmentById: builder.query<BaseResponse<EquipmentEntity>, { id: number }>({
            query: ({ id }) => ({
                method: 'GET',
                url: `/equipment/${id}`,
            }),
            providesTags: ['Equipment'],
        }),
        getEquipmentList: builder.query<BaseResponse<EquipmentModel[]>, void>({
            query: () => ({
                method: 'GET',
                url: '/equipment/available',
            }),
            providesTags: ['Equipment'],
        }),
        createOrUpdateEquipment: builder.mutation<BaseResponse<EquipmentResponseModel>, EquipmentEntity>({
            query: (data) => ({
                url: '/equipment',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Equipment'],
        }),
        updateEquipmentStatus: builder.mutation<BaseResponse<boolean>, { equipmentId: number }>({
            query: ({ equipmentId }) => ({
                method: 'PUT',
                url: `/equipment/status/${equipmentId}`,
            }),
            invalidatesTags: ['Equipment'],
        }),
        getListMyEquipmentPaging: builder.mutation<
            BaseResponse<PagingDataModel<MyEquipmentPagingResponse>>,
            { param: PaginationParam }
        >({
            query: ({ param }) => ({
                url: '/equipment/me/paging',
                method: 'POST',
                body: param,
            }),
            invalidatesTags: ['Equipment'],
        }),
        getEquipmentHistoryById: builder.query<BaseResponse<EquipmentHistoryModel[]>, { id: number }>({
            query: ({ id }) => ({
                method: 'GET',
                url: `/equipment/${id}/history`,
            }),
            providesTags: ['Equipment'],
        }),
        deleteEquipment: builder.mutation<BaseResponse<boolean>, { id: number }>({
            query: ({ id }) => ({
                method: 'DELETE',
                url: `/equipment/${id}`,
            }),
            invalidatesTags: ['Equipment'],
        }),
    }),
});

export const {
    useExportEquipmentMutation,
    useGetListEquipmentPagingMutation,
    useGetEquipmentByIdQuery,
    useGetEquipmentListQuery,
    useCreateOrUpdateEquipmentMutation,
    useUpdateEquipmentStatusMutation,
    useGetListMyEquipmentPagingMutation,
    useGetEquipmentHistoryByIdQuery,
    useDeleteEquipmentMutation
} = useEquipmentApi;