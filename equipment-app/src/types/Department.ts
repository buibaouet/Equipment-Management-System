export interface DepartmentEntity {
    id: number,
    code: string,
    name: string,
    description: string,
    managerId: number,
    managerName: string,
    isActive: boolean,
}

export interface DepartmentModel {
    id: number,
    code: string,
    name: string,
}

export interface DepartmentPaging {
    id: number,
    code: string,
    name: string,
    quantityEquipment: number,
    quantityUser: number,
    managerName: string,
    isActive: boolean,
    createdDate: Date,
    updatedDate: Date,
}

export interface DepartmentResponseModel {
    isSuccess: boolean;
    codeError: string;
}