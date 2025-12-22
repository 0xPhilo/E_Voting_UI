'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Header } from '@/components/layout/Header';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { StatsCard } from '@/components/admin/StatsCard';
import { VotingChart } from '@/components/admin/VotingChart';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { isAuthenticated, isAdmin } from '@/lib/auth';
import { DashboardStats, VotingResult } from '@/types';
import { formatNumber, formatPercentage } from '@/lib/utils';

export default function AdminDashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [results, setResults] = useState<VotingResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated() || !isAdmin()) {
            router.push('/admin/login');
        }
    }, [router]);

    useEffect(() => {
        if (mounted && isAuthenticated() && isAdmin()) {
            fetchData();
        }
    }, [mounted]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [statsRes, resultsRes] = await Promise.all([
                api.getDashboardStats(),
                api.getResults(),
            ]);
            setStats(statsRes.data);
            setResults(resultsRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted || !isAuthenticated()) {
        return null;
    }

    return (
        <div className={styles.page}>
            <Header />
            <div className={styles.layout}>
                <AdminSidebar />
                <main className={styles.main}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Dashboard</h1>
                        <Button variant="ghost" size="sm" onClick={fetchData} disabled={isLoading}>
                            🔄 Refresh
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner} />
                            <p>Memuat data...</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.statsGrid}>
                                <StatsCard
                                    title="Total Mahasiswa"
                                    value={formatNumber(stats?.total_mahasiswa || 0)}
                                    variant="primary"
                                    icon={
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                    }
                                />
                                <StatsCard
                                    title="Sudah Memilih"
                                    value={formatNumber(stats?.total_voted || 0)}
                                    variant="success"
                                    icon={
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    }
                                />
                                <StatsCard
                                    title="Belum Memilih"
                                    value={formatNumber(stats?.total_not_voted || 0)}
                                    variant="warning"
                                    icon={
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                    }
                                />
                                <StatsCard
                                    title="Partisipasi"
                                    value={formatPercentage(stats?.voting_percentage || 0)}
                                    variant="primary"
                                    icon={
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="20" x2="18" y2="10"></line>
                                            <line x1="12" y1="20" x2="12" y2="4"></line>
                                            <line x1="6" y1="20" x2="6" y2="14"></line>
                                        </svg>
                                    }
                                />
                            </div>

                            <div className={styles.chartSection}>
                                <VotingChart results={results} />
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
