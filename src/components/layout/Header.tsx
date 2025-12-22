'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui/Button';
import { getUser, getUserType, clearSession, isAuthenticated } from '@/lib/auth';
import { api } from '@/lib/api';
import { Mahasiswa, Admin } from '@/types';

export const Header: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = React.useState<Mahasiswa | Admin | null>(null);
    const [userType, setUserType] = React.useState<string | null>(null);

    React.useEffect(() => {
        setUser(getUser());
        setUserType(getUserType());
    }, []);

    const handleLogout = async () => {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearSession();
            router.push('/login');
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href={userType === 'admin' ? '/admin' : '/'} className={styles.logo}>
                    <span className={styles.logoIcon}>🛡️</span>
                    <span className={styles.logoText}>e-Voting</span>
                </Link>

                <div className={styles.actions}>
                    <ThemeToggle />

                    {isAuthenticated() && user && (
                        <div className={styles.userMenu}>
                            <span className={styles.userName}>
                                {'name' in user ? user.name : 'Admin'}
                            </span>
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                Keluar
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
