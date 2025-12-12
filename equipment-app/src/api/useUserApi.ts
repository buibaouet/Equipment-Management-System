import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQuery';
import { PaginationParam } from '../types/PagingParam';
import { BaseResponse, PagingDataModel } from '../types/Response';
import { UpdateUserInfo, UserModel, UserEntity, UpdateUserResponseModel, UpdateUserRoleDepartment, CreateUserByAdminInput, CreateUserResponseModel } from '../types/User';

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
        getManagerList: builder.query<BaseResponse<UserModel[]>, void>({
            query: () => ({
                method: 'GET',
                url: '/user/managers',
            }),
            providesTags: ['Manager'],
        }),
        getUserList: builder.query<BaseResponse<UserModel[]>, void>({
            query: () => ({
                method: 'GET',
                url: '/user/active',
            }),
            providesTags: ['Manager'],
        }),
        getUserById: builder.query<BaseResponse<UserEntity>, { userId: number }>({
            query: ({ userId }) => ({
                url: `/user/${userId}`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        createUser: builder.mutation<
            BaseResponse<CreateUserResponseModel>,
            { data: CreateUserByAdminInput }
        >({
            query: ({ data }) => ({
                url: '/user',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User', 'Manager'],
        }),
        deleteUser: builder.mutation<BaseResponse<boolean>, { id: number }>({
            query: ({ id }) => ({
                method: 'DELETE',
                url: `/user/${id}`,
            }),
            invalidatesTags: ['User', 'Manager'],
        }),
        blockUser: builder.mutation<BaseResponse<boolean>, { id: number }>({
            query: ({ id }) => ({
                method: 'PUT',
                url: `/user/block/${id}`,
            }),
            invalidatesTags: ['User', 'Manager', 'Auth'],
        }),
    }),
});

export const {
    useGetListUserPagingMutation,
    useUpdateUserMutation,
    useUpdateRoleDepartmentUserMutation,
    useGetManagerListQuery,
    useGetUserListQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useDeleteUserMutation,
    useBlockUserMutation
} = useUserApi;
