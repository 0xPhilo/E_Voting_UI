'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
    saveSession,
    clearSession,
    getUser,
    getUserType,
    isAuthenticated as checkAuth,
    UserType
} from '@/lib/auth';
import { Mahasiswa, Admin, LoginCredentials } from '@/types';

export function useAuth() {
    const router = useRouter();
    const [user, setUser] = useState<Mahasiswa | Admin | null>(null);
    const [userType, setUserType] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = getUser();
        const storedUserType = getUserType();
        if (storedUser && storedUserType) {
            setUser(storedUser);
            setUserType(storedUserType);
        }
    }, []);

    const loginMahasiswa = useCallback(async (nim: string, token: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.mahasiswaLogin({ nim, voting_token: token });
            // Backend returns: { access_token, token_type, mahasiswa }
            // We need to transform it to AuthResponse format
            const authData = {
                token: response.data.access_token,
                token_type: response.data.token_type,
                user: response.data.mahasiswa,
            };
            saveSession(authData as import('@/types').AuthResponse, 'mahasiswa');
            setUser(response.data.mahasiswa as import('@/types').Mahasiswa);
            setUserType('mahasiswa');
            router.push('/');
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login gagal';
            setError(message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const loginAdmin = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.adminLogin({ email, password });
            // Backend returns: { access_token, token_type, admin }
            // We need to transform it to AuthResponse format
            const authData = {
                token: response.data.access_token,
                token_type: response.data.token_type,
                user: response.data.admin,
            };
            saveSession(authData as import('@/types').AuthResponse, 'admin');
            setUser(response.data.admin as import('@/types').Admin);
            setUserType('admin');
            router.push('/admin');
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login gagal';
            setError(message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const logout = useCallback(async () => {
        try {
            await api.logout();
        } catch {
            // Ignore logout errors
        } finally {
            clearSession();
            setUser(null);
            setUserType(null);
            router.push('/login');
        }
    }, [router]);

    const isAuthenticated = checkAuth();
    const isAdmin = userType === 'admin';
    const isMahasiswa = userType === 'mahasiswa';

    return {
        user,
        userType,
        isLoading,
        error,
        isAuthenticated,
        isAdmin,
        isMahasiswa,
        loginMahasiswa,
        loginAdmin,
        logout,
        clearError: () => setError(null),
    };
}
