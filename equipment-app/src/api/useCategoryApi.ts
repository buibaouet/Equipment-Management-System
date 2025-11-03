import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../utils/baseQuery';
import { BaseResponse, PagingDataModel } from '../types/Response';
import { PaginationParam } from '../types/PagingParam';
import { CategoryEntity, CategoryPaging, CategoryResponseModel } from '../types/Category';

export const useCategoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getListCategoryPaging: builder.mutation<
            BaseResponse<PagingDataModel<CategoryPaging>>,
            { param: PaginationParam }
        >({
            query: ({ param }) => ({
                url: '/category/paging',
                method: 'POST',
                body: param,
            }),
            invalidatesTags: ['Category'],
        }),
        getCategoryById: builder.query<BaseResponse<CategoryEntity>, { id: number }>({
            query: ({ id }) => ({
                method: 'GET',
                url: `/category/${id}`,
            }),
            providesTags: ['Category'],
        }),
        getCategoryList: builder.query<BaseResponse<CategoryEntity[]>, {}>({
            query: () => ({
                method: 'GET',
                url: '/category/active',
            }),
            providesTags: ['Category'],
        }),
        createOrUpdateCategory: builder.mutation<BaseResponse<CategoryResponseModel>, CategoryEntity>({
            query: (data) => ({
                url: '/category',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategoryStatus: builder.mutation<BaseResponse<boolean>, { categoryId: number }>({
            query: ({ categoryId }) => ({
                method: 'PUT',
                url: `/category/status/${categoryId}`,
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useGetListCategoryPagingMutation,
    useGetCategoryByIdQuery,
    useGetCategoryListQuery,
    useCreateOrUpdateCategoryMutation,
    useUpdateCategoryStatusMutation,
} = useCategoryApi;