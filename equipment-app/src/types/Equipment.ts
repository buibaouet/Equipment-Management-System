import { EquipmentStatusEnum } from "../utils/enumerations";
import { PaginationParam } from "./PagingParam";

export interface EquipmentEntity {
    id: number,
    code: string,
    name: string,
    importDate: Date | undefined,
    price: number,
    originOfGoods: string | undefined,
    manufacturer: string | undefined,
    description: string | undefined,
    ownerId: number | undefined,
    departmentId: number,
    categoryId: number,
    status: EquipmentStatusEnum,
}

export interface EquipmentPagingParam {
    paramPaging: PaginationParam,
    departmentId: number | undefined,
    categoryId: number | undefined,
    status: EquipmentStatusEnum | undefined,
}

export interface EquipmentPagingResponse {
    id: number,
    code: string,
    name: string,
    categoryId: number,
    categoryName: string,
    price: number,
    departmentId: number,
    departmentName: string,
    ownerId: number | undefined,
    ownerName: string | undefined,
    status: EquipmentStatusEnum,
}

export interface MyEquipmentPagingResponse {
    id: number,
    code: string,
    name: string,
    categoryId: number,
    categoryName: string,
    price: number,
    departmentId: number,
    departmentName: string,
    ownerId: number | undefined,
    ownerName: string | undefined,
    status: EquipmentStatusEnum,
    isBorrow: boolean,
    remainingDays: number,
}

export interface EquipmentResponseModel {
    isSuccess: boolean;
    codeError: string;
    nameError: string;
    categoryIdError: string;
    departmentIdError: string;
    priceError: string;
}

export interface EquipmentModel {
    id: number,
    code: string,
    name: string,
    departmentId: number,
    departmentName: string,
    categoryId: number,
    categoryName: string,
}

export interface EquipmentErrors {
    code: string,
    name: string,
    price: string,
    departmentId: string,
    categoryId: string,
}