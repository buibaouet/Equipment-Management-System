export interface BaseResponse<T> {
    statusCode: number;
    data?: T;
    message?: string;
}

export interface PagingDataModel<T>{
    totalRecords: number | 0;
    data?: T;
    totalPages: number | 0;
}