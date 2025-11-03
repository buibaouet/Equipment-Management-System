import RoleEnum from "../utils/enumerations";
import { UserEntity } from "./User";

export interface LoginResponse {
    success: boolean;
    data?: {
        userId: number;
        accessToken: string;
        refreshToken: string;
    };
    message?: string;
}

export interface LoginCredentials {
    userName: string;
    password: string;
}

export interface AuthContextType {
    currentUser: UserEntity | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    hasRole: (role: RoleEnum) => boolean;
    isAdmin: () => boolean;
    isManagerOrAdmin: () => boolean;
}

export interface ChangePasswordResponseModel {
    isSuccess: boolean;
    oldPasswordError: string;
    newPasswordError: string;
}

export interface RegisterResponseModel {
    isSuccess: boolean;
    passwordError: string;
    emailError: string;
    usernameError: string;
}