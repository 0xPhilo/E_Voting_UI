'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLoginPage() {
    const router = useRouter();
    const { loginAdmin, isLoading, error, clearError } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        const success = await loginAdmin(username, password);
        if (success) {
            router.push('/admin');
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.themeToggle}>
                <ThemeToggle />
            </div>

            <Card variant="elevated" padding="lg" className={styles.card}>
                <div className={styles.header}>
                    <span className={styles.icon}>🛡️</span>
                    <h1 className={styles.title}>e-Voting Admin</h1>
                    <p className={styles.subtitle}>Masuk ke panel admin</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        label="Username"
                        type="text"
                        placeholder="Masukkan username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        leftIcon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        }
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        leftIcon={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        }
                        error={error || undefined}
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isLoading={isLoading}
                    >
                        Masuk
                    </Button>
                </form>
            </Card>

            <footer className={styles.footer}>
                © {new Date().getFullYear()} e-Voting Kampus
            </footer>
        </div>
    );
}
