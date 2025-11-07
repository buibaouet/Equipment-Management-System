import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { SessionStorage } from "./sessionStorage";
import { BaseResponse } from "../types/Response";
import { formatDatesInObject } from "./dateFormatter";

// API Configuration
export const API_CONFIG = {
    // Single API base URL
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',

    // API paths
    API_PATH: '/api',
} as const;

// Helper function to get the full API URL
export const getApiUrl = (): string => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PATH}`;
};

// Create an API with a custom base query that handles token injection
export const baseQueryWithToken = fetchBaseQuery({
    baseUrl: getApiUrl(),
    prepareHeaders: (headers) => {
        headers.set('Content-Type', 'application/json');

        const token = SessionStorage.getAccessToken();
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const handleLogout = () => {
    // Clear all tokens
    SessionStorage.clearSession();
    // Redirect to login page
    window.location.href = '/login';
};

// Helper function to format dates in request arguments
const formatRequestArgs = (args: any): any => {
    if (!args) return args;
    
    const formatted = { ...args };
    
    // Format dates in body
    if (formatted.body) {
        formatted.body = formatDatesInObject(formatted.body);
    }
    
    // Format dates in params (query parameters)
    if (formatted.params) {
        formatted.params = formatDatesInObject(formatted.params);
    }
    
    return formatted;
};

// Create a base query with automatic token refresh
export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    // Format dates in request arguments before sending
    const formattedArgs = formatRequestArgs(args);
    let result = await baseQueryWithToken(formattedArgs, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Try to refresh the token
        const refreshToken = SessionStorage.getRefreshToken();
        if (!refreshToken) {
            handleLogout();
            return result;
        }

        try {
            const refreshResult = await baseQueryWithToken(
                {
                    url: '/auth/refresh-token',
                    method: 'POST',
                    body: { refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult.data && (refreshResult.data as BaseResponse<string>).statusCode === 200) {
                // Store the new token
                const accessToken = (refreshResult.data as BaseResponse<string>).data as string;
                SessionStorage.updateAccessToken(accessToken);
                // Retry the original query (dates already formatted)
                result = await baseQueryWithToken(formattedArgs, api, extraOptions);
            } else {
                // Refresh token request failed
                handleLogout();
            }
        } catch (error) {
            // Error during refresh token request
            console.error('Token refresh failed:', error);
            handleLogout();
        }
    }
    return result;
};