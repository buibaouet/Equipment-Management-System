import type { UserSession } from '../types/User';

const SESSION_KEY = 'equipment_user_session';

export class SessionStorage {
    /**
     * Save user session to sessionStorage
     */
    static saveSession(user: UserSession): void {
        try {
            const sessionData = {
                ...user,
                sessionId: this.generateSessionId(),
                expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
            };
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        } catch (error) {
            console.error('Failed to save session:', error);
        }
    }

    /**
     * Get user session from sessionStorage
     */
    static getSession(): UserSession | null {
        try {
            const sessionData = sessionStorage.getItem(SESSION_KEY);
            if (!sessionData) {
                return null;
            }

            const parsed = JSON.parse(sessionData);

            // Check if session has expired
            if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
                this.clearSession();
                return null;
            }

            // Remove internal session management fields before returning
            const { sessionId, expiresAt, ...userSession } = parsed;
            return userSession as UserSession;
        } catch (error) {
            console.error('Failed to get session:', error);
            this.clearSession();
            return null;
        }
    }

    /**
     * Clear user session from sessionStorage
     */
    static clearSession(): void {
        try {
            sessionStorage.removeItem(SESSION_KEY);
        } catch (error) {
            console.error('Failed to clear session:', error);
        }
    }

    /**
     * Check if user session exists and is valid
     */
    static isSessionValid(): boolean {
        return this.getSession() !== null;
    }

    /**
     * Update last activity timestamp
     */
    static updateActivity(): void {
        const session = this.getSession();
        if (session) {
            this.saveSession(session);
        }
    }

    /**
     * Generate a simple session ID
     */
    private static generateSessionId(): string {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    /**
     * Get session expiration time
     */
    static getSessionExpiration(): Date | null {
        try {
            const sessionData = sessionStorage.getItem(SESSION_KEY);
            if (!sessionData) {
                return null;
            }
            const parsed = JSON.parse(sessionData);
            return parsed.expiresAt ? new Date(parsed.expiresAt) : null;
        } catch (error) {
            return null;
        }
    }
}

// Auto-clear expired sessions on page load
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        SessionStorage.updateActivity();
    });
}