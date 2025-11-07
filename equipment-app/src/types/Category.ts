export interface CategoryModel {
    id: number;
    code: string;
    name: string;
}

export interface CategoryEntity {
    id: number;
    code: string;
    name: string;
    description: string | null;
    isActive: boolean;
}

export interface CategoryPaging {
    id: number;
    code: string;
    name: string;
    quantity: number;
    isActive: boolean;
    createdDate: Date;
    updatedDate: Date;
}

export interface CategoryResponseModel {
    isSuccess: boolean;
    codeError: string;
}
