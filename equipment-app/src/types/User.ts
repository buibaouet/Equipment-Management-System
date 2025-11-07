import { RoleEnum } from "../utils/enumerations";

export interface UserModel {
    id: number;
    userName: string;
    fullName: string;
}

export interface CreateUserInput {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UpdateUserInfo {
    firstName: string;
    lastName: string;
    email: string;
    birthDate: Date | undefined;
    bio: string;
}

export interface UserEntity {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    role: RoleEnum;
    birthDate: Date;
    bio: string;
    departmentId: number;
    departmentName: string;
}

export interface UpdateUserResponseModel {
    isSuccess: boolean;
    emailError: string;
}

export interface UpdateUserRoleDepartment {
    role: RoleEnum;
    departmentId: number;
}
