// =========================================
// Auth Utilities
// =========================================

import { AuthResponse, Mahasiswa, Admin } from '@/types';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const USER_TYPE_KEY = 'auth_user_type';

export type UserType = 'mahasiswa' | 'admin';

// Token Management
export const setToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
    }
};

export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
};

export const removeToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
    }
};

// User Management
export const setUser = (user: Mahasiswa | Admin, type: UserType): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        localStorage.setItem(USER_TYPE_KEY, type);
    }
};

export const getUser = <T extends Mahasiswa | Admin>(): T | null => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) {
            try {
                return JSON.parse(userStr) as T;
            } catch {
                return null;
            }
        }
    }
    return null;
};

export const getUserType = (): UserType | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(USER_TYPE_KEY) as UserType | null;
    }
    return null;
};

export const removeUser = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(USER_TYPE_KEY);
    }
};

// Session Management
export const saveSession = (authResponse: AuthResponse, type: UserType): void => {
    setToken(authResponse.token);
    setUser(authResponse.user, type);
};

export const clearSession = (): void => {
    removeToken();
    removeUser();
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};

export const isAdmin = (): boolean => {
    return getUserType() === 'admin';
};

export const isMahasiswa = (): boolean => {
    return getUserType() === 'mahasiswa';
};

// Route Guards
export const requireAuth = (redirectTo: string = '/login'): string | null => {
    if (!isAuthenticated()) {
        return redirectTo;
    }
    return null;
};

export const requireAdmin = (redirectTo: string = '/admin/login'): string | null => {
    if (!isAuthenticated() || !isAdmin()) {
        return redirectTo;
    }
    return null;
};

export const requireMahasiswa = (redirectTo: string = '/login'): string | null => {
    if (!isAuthenticated() || !isMahasiswa()) {
        return redirectTo;
    }
    return null;
};
