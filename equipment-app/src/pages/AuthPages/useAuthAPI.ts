import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthResponse } from '../../types/User';

export const useAuthApi = createApi({
    reducerPath: 'useAuthApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.DEV ? 'http://localhost:5000' : import.meta.env.VITE_Z_CHAT_APP_URL}/api`,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        login: builder.mutation<
            AuthResponse,
            { userName: string; password: string }
        >({
            query: ({ userName, password }) => ({
                url: '/auth/login',
                method: 'POST',
                body: {
                    userName,
                    password,
                },
            }),
            invalidatesTags: ['Auth'],
        }),
    }),
});

export const { useLoginMutation } = useAuthApi;
