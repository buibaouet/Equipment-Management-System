import RoleEnum from "../utils/enumerations";

export interface CreateUserInput {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UserSession {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: RoleEnum;
    birthDate: Date;
    departmentId: number;
    departmentName: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    user?: UserSession;
    message?: string;
}

export interface AuthContextType {
    currentUser: UserSession | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    logout: () => void;
    hasRole: (role: RoleEnum) => boolean;
    isAdmin: () => boolean;
    isManagerOrAdmin: () => boolean;
}