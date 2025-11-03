export class SessionStorage {
    private static readonly ACCESS_TOKEN_KEY = 'access_token';
    private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private static readonly USER_ID_KEY = 'user_id';

    static saveTokens(accessToken: string, refreshToken: string): void {
        sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }

    static saveUserId(userId: number): void {
        sessionStorage.setItem(this.USER_ID_KEY, userId.toString());
    }

    static getAccessToken(): string | null {
        return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    static getRefreshToken(): string | null {
        return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    static getUserId(): number | null {
        const userId = sessionStorage.getItem(this.USER_ID_KEY);
        return userId ? parseInt(userId) : null;
    }

    static clearSession(): void {
        sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
        sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
        sessionStorage.removeItem(this.USER_ID_KEY);
    }

    static isSessionValid(): boolean {
        return !!this.getAccessToken() && !!this.getUserId();
    }

    static updateAccessToken(newAccessToken: string): void {
        sessionStorage.setItem(this.ACCESS_TOKEN_KEY, newAccessToken);
    }
}