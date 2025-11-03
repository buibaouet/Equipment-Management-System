import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getApiUrl } from '../../utils/baseQuery';

export interface Department {
    id: number,
    code: string,
    name: string
}

export const departmentApi = createApi({
    reducerPath: 'campaignApi',
    baseQuery: fetchBaseQuery({
        baseUrl: getApiUrl(),
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Campaign'],
    endpoints: (builder) => ({
        getCampaignList: builder.query<Department[], { token: string }>({
            query: ({ token }) => ({
                method: 'POST',
                url: '/campaigns',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
            providesTags: ['Campaign'],
            transformResponse: (response: Department[]) => {
                return response;
                // return (response?.map((x) => x.assets).flat() as CampaignAsset[]).filter((x) => x && x.id) || [];
            },
            transformErrorResponse: (response) => {
                return response;
            },
        }),
        markNotificationRead: builder.mutation<
            boolean,
            { messageId: string; sequenceId: number; threadId: string; token: string }
        >({
            query: ({ messageId, sequenceId, threadId, token }) => ({
                url: '/notifications/read',
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: {
                    messageId,
                    sequenceId,
                    threadId,
                },
            }),
            invalidatesTags: ['Campaign'],
        }),
    }),
});

export const { useGetCampaignListQuery, useMarkNotificationReadMutation } = departmentApi;
