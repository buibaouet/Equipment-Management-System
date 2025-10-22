import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { UserSession, LoginCredentials, AuthResponse, AuthContextType } from '../types/User';
import RoleEnum from '../utils/enumerations';
import { SessionStorage } from '../utils/sessionStorage';
import { useLoginMutation } from '../pages/AuthPages/useAuthAPI';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const [loginMutation] = useLoginMutation();

    // Initialize auth state from session storage
    useEffect(() => {
        const session = SessionStorage.getSession();
        if (session && SessionStorage.isSessionValid()) {
            setCurrentUser(session);
            setIsAuthenticated(true);
        }
        setIsInitialized(true);
    }, []);

    const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
        setIsLoading(true);
        try {
            const result = await loginMutation({
                userName: credentials.username,
                password: credentials.password
            });

            if (!result || !result.data || !result.data.success || !result.data.user) {
                return {
                    success: false,
                    message: 'Tài khoản hoặc mật khẩu không chính xác.'
                };
            }

            const userSession = result.data.user;

            // Save session
            SessionStorage.saveSession(userSession);

            // Update state
            setCurrentUser(userSession);
            setIsAuthenticated(true);

            return {
                success: true,
                user: userSession
            };

        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Đăng nhập không thành công. Vui lòng thử lại.'
            };
        } finally {
            setIsLoading(false);
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
