import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQuery';
import { PaginationParam } from '../types/PagingParam';
import { BaseResponse, PagingDataModel } from '../types/Response';
import { UpdateUserInfo, UserModel, UserEntity, UpdateUserResponseModel, UpdateUserRoleDepartment } from '../types/User';

export const useUserApi = createApi({
    reducerPath: 'useUserApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Auth', 'Manager'],
    endpoints: (builder) => ({
        getListUserPaging: builder.mutation<
            BaseResponse<PagingDataModel<UserEntity>>,
            { param: PaginationParam }
        >({
            query: ({ param }) => ({
                url: '/user/paging',
                method: 'POST',
                body: param,
            }),
            invalidatesTags: ['User'],
        }),
        updateUser: builder.mutation<
            BaseResponse<UpdateUserResponseModel>,
            { id: number; data: UpdateUserInfo }
        >({
            query: ({ id, data }) => ({
                url: `/user/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Auth'],
        }),
        updateRoleDepartmentUser: builder.mutation<
            BaseResponse<UserEntity>,
            { id: number; data: UpdateUserRoleDepartment }
        >({
            query: ({ id, data }) => ({
                url: `/user/role-department/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User', 'Manager'],
        }),
        getManagerList: builder.query<BaseResponse<UserModel[]>, {}>({
            query: ({ }) => ({
                method: 'GET',
                url: '/user/managers',
            }),
            providesTags: ['Manager'],
        }),
        getUserList: builder.query<BaseResponse<UserModel[]>, {}>({
            query: ({ }) => ({
                method: 'GET',
                url: '/user/active',
            }),
            providesTags: ['Manager'],
        }),
    }),
});

export const {
    useGetListUserPagingMutation,
    useUpdateUserMutation,
    useUpdateRoleDepartmentUserMutation,
    useGetManagerListQuery,
    useGetUserListQuery
} = useUserApi;
