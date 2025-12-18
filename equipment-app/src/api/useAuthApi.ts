import { createApi } from '@reduxjs/toolkit/query/react';
import type { ChangePasswordResponseModel, ForgotPasswordRequest, LoginCredentials, LoginResponse, RegisterResponseModel, ResetPasswordResponseModel, ResetPasswordWithOtpRequest } from '../types/Auth';
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
        forgotPassword: builder.mutation<
            BaseResponse<string>,
            ForgotPasswordRequest
        >({
            query: (data) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: data,
            }),
        }),
        resetPasswordWithOtp: builder.mutation<
            BaseResponse<ResetPasswordResponseModel>,
            ResetPasswordWithOtpRequest
        >({
            query: (data) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: data,
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
    useForgotPasswordMutation,
    useResetPasswordWithOtpMutation,
} = useAuthApi;
