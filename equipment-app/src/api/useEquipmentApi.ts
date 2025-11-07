import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQuery';
import { BaseResponse, PagingDataModel } from '../types/Response';
import { EquipmentModel, EquipmentPagingResponse, EquipmentPagingParam, EquipmentResponseModel, EquipmentEntity } from '../types/Equipment';

export const useEquipmentApi = createApi({
    reducerPath: 'equipmentApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Equipment'],
    endpoints: (builder) => ({
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
        getEquipmentList: builder.query<BaseResponse<EquipmentModel[]>, {}>({
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
    }),
});

export const {
    useGetListEquipmentPagingMutation,
    useGetEquipmentByIdQuery,
    useGetEquipmentListQuery,
    useCreateOrUpdateEquipmentMutation,
    useUpdateEquipmentStatusMutation,
} = useEquipmentApi;