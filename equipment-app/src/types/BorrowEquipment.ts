import { BorrowEquipmentStatusEnum, EquipmentStatusEnum, ProcessingFormEnum } from "../utils/enumerations";

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
    owerId: number;
    owerName: string;
    borrowerId: number;
    borrowerName: string;
}

export interface BorrowEquipmentResponseModel {
    isSuccess: boolean;
    equipmentIdError: string;
    fromDateError: string;
    toDateError: string;
}

export interface ReturnEquipmentPayload {
    id: number;
    status: number;
    processingForm?: number;
    processingNote?: string | null;
}

export interface BorrowEquipmentDataModel {
    id: number;
    equipmentId: number;
    equipmentCode: string;
    equipmentName: string;
    categoryName: string;
    departmentName: string;
    fromDate: Date;
    toDate: Date;
    owerId: number;
    owerName: string;
    borrowerId: number;
    borrowerName: string;
    approvedByUserId: number;
    approvedByName: string;
    approvedDate: Date;
    returnedDate: Date;
    status: BorrowEquipmentStatusEnum;
    statusAfterReturn?: EquipmentStatusEnum;
    processingForm?: ProcessingFormEnum;
    processingNote?: string;
}