'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Header } from '@/components/layout/Header';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { VotingChart } from '@/components/admin/VotingChart';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { isAuthenticated, isAdmin } from '@/lib/auth';
import { VotingResult, DashboardStats } from '@/types';
import { formatNumber, formatPercentage, downloadBlob, getKandidatColor } from '@/lib/utils';

export default function ResultsPage() {
    const router = useRouter();
    const [results, setResults] = useState<VotingResult[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated() || !isAdmin()) {
            router.push('/admin/login');
        }
    }, [router]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [resultsRes, statsRes] = await Promise.all([
                api.getResults(),
                api.getDashboardStats(),
            ]);

            // Backend returns: { data: { statistics: {...}, results: [...] } }
            // We need to extract the results array and map it to VotingResult format
            const responseData = resultsRes.data as unknown as {
                statistics?: { total_voters?: number; total_voted?: number; participation_rate?: number };
                results?: Array<{
                    kandidat_id: number;
                    nomor_urut: string;
                    ketua_nama: string;
                    wakil_nama: string;
                    vote_count: number;
                    percentage: number;
                }>;
            };

            // Map backend format to frontend VotingResult format
            const mappedResults: VotingResult[] = (responseData?.results || []).map(item => ({
                kandidat: {
                    id: item.kandidat_id,
                    nomor_urut: parseInt(item.nomor_urut) || 0,
                    ketua_nama: item.ketua_nama,
                    wakil_nama: item.wakil_nama,
                    visi: '',
                    misi: '',
                },
                total_votes: item.vote_count || 0,
                percentage: item.percentage || 0,
            }));

            setResults(mappedResults);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Failed to fetch results:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (mounted && isAuthenticated() && isAdmin()) {
            fetchData();
        }
    }, [mounted, fetchData]);

    const handleExport = async (format: 'csv' | 'xlsx') => {
        setIsExporting(true);
        try {
            const blob = await api.exportResults(format);
            const filename = `hasil-voting-${new Date().toISOString().split('T')[0]}.${format}`;
            downloadBlob(blob, filename);
        } catch (error) {
            console.error('Failed to export:', error);
        } finally {
            setIsExporting(false);
        }
    };

    // Safe array operations
    const safeResults = Array.isArray(results) ? results : [];
    const totalVotes = safeResults.reduce((sum, r) => sum + (r.total_votes || 0), 0);

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
                        <div>
                            <h1 className={styles.title}>Hasil Voting</h1>
                            <p className={styles.subtitle}>
                                🔄 Data diperbarui secara real-time
                            </p>
                        </div>
                        <div className={styles.exportButtons}>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExport('csv')}
                                disabled={isExporting}
                            >
                                📥 Export CSV
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExport('xlsx')}
                                disabled={isExporting}
                            >
                                📥 Export Excel
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner} />
                            <p>Memuat data...</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.summary}>
                                <Card variant="default" padding="lg">
                                    <div className={styles.summaryContent}>
                                        <div className={styles.summaryItem}>
                                            <span className={styles.summaryLabel}>Total Suara Masuk</span>
                                            <span className={styles.summaryValue}>{formatNumber(totalVotes)}</span>
                                        </div>
                                        <div className={styles.summaryDivider} />
                                        <div className={styles.summaryItem}>
                                            <span className={styles.summaryLabel}>Total Mahasiswa</span>
                                            <span className={styles.summaryValue}>{formatNumber(stats?.total_mahasiswa || 0)}</span>
                                        </div>
                                        <div className={styles.summaryDivider} />
                                        <div className={styles.summaryItem}>
                                            <span className={styles.summaryLabel}>Partisipasi</span>
                                            <span className={styles.summaryValue}>{formatPercentage(stats?.voting_percentage || 0)}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <div className={styles.resultsGrid}>
                                <div className={styles.chartContainer}>
                                    <VotingChart results={safeResults} title="Perolehan Suara" />
                                </div>

                                <Card variant="default" padding="lg" className={styles.rankingCard}>
                                    <h3 className={styles.cardTitle}>Peringkat Kandidat</h3>
                                    <div className={styles.rankingList}>
                                        {safeResults.length === 0 ? (
                                            <div className={styles.emptyRanking}>Belum ada data voting</div>
                                        ) : (
                                            [...safeResults]
                                                .sort((a, b) => (b.total_votes || 0) - (a.total_votes || 0))
                                                .map((result, index) => (
                                                    <div key={result.kandidat?.id || index} className={styles.rankingItem}>
                                                        <div className={styles.rankingPosition}>
                                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                                        </div>
                                                        <div className={styles.rankingInfo}>
                                                            <Badge variant="primary" size="sm">No. {result.kandidat?.nomor_urut}</Badge>
                                                            <span className={styles.rankingName}>
                                                                {result.kandidat?.ketua_nama} & {result.kandidat?.wakil_nama}
                                                            </span>
                                                        </div>
                                                        <div className={styles.rankingVotes}>
                                                            <span className={styles.voteCount}>{formatNumber(result.total_votes || 0)}</span>
                                                            <span className={styles.votePercentage}>{formatPercentage(result.percentage || 0)}</span>
                                                        </div>
                                                    </div>
                                                ))
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
