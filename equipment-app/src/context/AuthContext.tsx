import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { UserEntity } from '../types/User';
import type { AuthContextType } from '../types/Auth';
import type { LoginCredentials } from '../types/Auth';
import { RoleEnum } from '../utils/enumerations';
import { SessionStorage } from '../utils/sessionStorage';
import { useLoginMutation, useGetUserInfoQuery } from '../api/useAuthApi';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const [loginMutation] = useLoginMutation();

    const userId = SessionStorage.getUserId();
    const { data: userData, isLoading } = useGetUserInfoQuery(
        { userId: userId || 0 },
        {
            skip: !SessionStorage.isSessionValid(),
            refetchOnMountOrArgChange: false, // Prevent refetch on mount
            refetchOnFocus: false, // Prevent refetch when window gains focus
            refetchOnReconnect: false, // Prevent refetch on reconnect
        }
    );

    useEffect(() => {
        const accessToken = SessionStorage.getAccessToken();
        if (accessToken && userId && SessionStorage.isSessionValid()) {
            setIsAuthenticated(true);
            if (userData?.data) {
                setCurrentUser(userData.data);
            }
        } else {
            setIsAuthenticated(false);
            setCurrentUser(null);
        }
        setIsInitialized(!isLoading);
    }, [userData, isLoading, userId]);

    const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> => {
        try {
            const result = await loginMutation(credentials);

            if (!result.data || !result.data.data || !result.data.data?.success || !result.data.data.data) {
                return {
                    success: false,
                    message: 'Tài khoản hoặc mật khẩu không chính xác.'
                };
            }

            const loginInfo = result.data.data.data;

            // Save tokens and userId
            SessionStorage.saveTokens(loginInfo.accessToken, loginInfo.refreshToken);
            SessionStorage.saveUserId(loginInfo.userId);

            setIsAuthenticated(true);
            return { success: true };

        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Đăng nhập không thành công. Vui lòng thử lại.'
            };
        }
    };

    const logout = () => {
        SessionStorage.clearSession();
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    const hasRole = (role: RoleEnum): boolean => {
        return currentUser?.role === role;
    };

    const isAdmin = (): boolean => {
        return hasRole(RoleEnum.Admin);
    };

    const isManagerOrAdmin = (): boolean => {
        return currentUser?.role === RoleEnum.Admin || currentUser?.role === RoleEnum.Manager;
    };

    const value: AuthContextType = {
        currentUser,
        isAuthenticated,
        isLoading,
        isInitialized,
        login,
        logout,
        hasRole,
        isAdmin,
        isManagerOrAdmin,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};