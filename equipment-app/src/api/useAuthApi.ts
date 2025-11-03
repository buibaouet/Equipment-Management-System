import { createApi } from '@reduxjs/toolkit/query/react';
import type { ChangePasswordResponseModel, LoginCredentials, LoginResponse, RegisterResponseModel } from '../types/Auth';
import type { CreateUserInput, UserEntity } from '../types/User';
import { BaseResponse } from '../types/Response';
import { baseQueryWithReauth } from '../utils/baseQuery';

export const useAuthApi = createApi({
    reducerPath: 'useAuthApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        login: builder.mutation<BaseResponse<LoginResponse>, LoginCredentials>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        refreshToken: builder.mutation<BaseResponse<string>, { refreshToken: string }>({
            query: (data) => ({
                url: '/auth/refresh-token',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Auth'],
        }),
        register: builder.mutation<
            BaseResponse<RegisterResponseModel>,
            { registerData: CreateUserInput }
        >({
            query: ({ registerData }) => ({
                url: '/auth/register',
                method: 'POST',
                body: registerData,
            }),
        }),
        changePassword: builder.mutation<
            BaseResponse<ChangePasswordResponseModel>,
            { userId: number, oldPassword: string; newPassword: string }
        >({
            query: ({ userId, oldPassword, newPassword }) => ({
                url: '/auth/change-password',
                method: 'PUT',
                body: {
                    userId,
                    oldPassword,
                    newPassword,
                },
            }),
        }),
        getUserInfo: builder.query<BaseResponse<UserEntity>, { userId: number }>({
            query: ({ userId }) => ({
                url: `/auth/${userId}`,
                method: 'GET',
            }),
            providesTags: ['Auth'],
        }),
    }),
});

export const {
    useLoginMutation,
    useRefreshTokenMutation,
    useRegisterMutation,
    useChangePasswordMutation,
    useGetUserInfoQuery,
} = useAuthApi;
