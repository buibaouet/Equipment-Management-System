import { BorrowEquipmentStatusEnum } from "../utils/enumerations";

export interface BorrowEquipmentEntity {
    id: number,
    equipmentId: number,
    fromDate: Date,
    toDate: Date,
}

export interface BorrowEquipmentPaging {
    id: number;
    equipmentId: number;
    equipmentCode: string;
    equipmentName: string;
    categoryName: string;
    departmentName: string;
    fromDate: Date;
    toDate: Date;
    status: BorrowEquipmentStatusEnum;
}

export interface RequestBorrowEquipmentPaging {
    id: number;
    equipmentId: number;
    equipmentCode: string;
    equipmentName: string;
    categoryName: string;
    departmentName: string;
    fromDate: Date;
    toDate: Date;
    borrowerId: number;
    borrowerName: string;
}

export interface BorrowEquipmentResponseModel {
    isSuccess: boolean;
    equipmentIdError: string;
    fromDateError: string;
    toDateError: string;
}