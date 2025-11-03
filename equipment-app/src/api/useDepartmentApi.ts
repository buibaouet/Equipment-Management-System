import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQuery';
import { BaseResponse, PagingDataModel } from '../types/Response';
import { PaginationParam } from '../types/PagingParam';
import { Department, DepartmentEntity, DepartmentPaging, DepartmentResponseModel } from '../types/Department';

export const useDepartmentApi = createApi({
    reducerPath: 'departmentApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Department'],
    endpoints: (builder) => ({
        getListDepartmentPaging: builder.mutation<
            BaseResponse<PagingDataModel<DepartmentPaging>>,
            { param: PaginationParam }
        >({
            query: ({ param }) => ({
                url: '/department/paging',
                method: 'POST',
                body: param,
            }),
            invalidatesTags: ['Department'],
        }),
        getDepartmentList: builder.query<BaseResponse<Department[]>, {}>({
            query: () => ({
                method: 'GET',
                url: '/department/active',
            }),
            providesTags: ['Department'],
        }),
        getDepartmentById: builder.query<BaseResponse<DepartmentEntity>, { id: number }>({
            query: ({ id }) => ({
                url: `/department/${id}`,
                method: 'GET',
            }),
            providesTags: ['Department'],
        }),
        createOrUpdateDepartment: builder.mutation<
            BaseResponse<DepartmentResponseModel>,
            DepartmentEntity
        >({
            query: (department) => ({
                url: '/department',
                method: 'POST',
                body: department,
            }),
            invalidatesTags: ['Department'],
        }),
        updateDepartmentStatus: builder.mutation<BaseResponse<boolean>, { departmentId: number }>({
            query: ({ departmentId }) => ({
                method: 'PUT',
                url: `/department/status/${departmentId}`,
            }),
            invalidatesTags: ['Department'],
        }),
    }),
});

export const {
    useGetListDepartmentPagingMutation,
    useGetDepartmentListQuery,
    useGetDepartmentByIdQuery,
    useCreateOrUpdateDepartmentMutation,
    useUpdateDepartmentStatusMutation
} = useDepartmentApi;
