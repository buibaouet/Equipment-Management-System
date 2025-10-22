import { useContext } from 'react';
import type { AuthContextType } from '../types/User';
import { AuthContext } from '../context/AuthContext';

// Create
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
