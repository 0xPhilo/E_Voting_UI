'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useVote } from '@/hooks/useVote';
import { isAuthenticated, clearSession, getUser } from '@/lib/auth';
import { formatDateTime } from '@/lib/utils';
import { Mahasiswa } from '@/types';

export default function StatusPage() {
    const router = useRouter();
    const { voteStatus, isLoading } = useVote();
    const [user, setUser] = useState<Mahasiswa | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        setUser(getUser<Mahasiswa>());
    }, [router]);

    const handleLogout = () => {
        clearSession();
        router.push('/login');
    };

    if (!mounted || isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                </div>
            </div>
        );
    }

    if (!voteStatus?.has_voted) {
        router.push('/');
        return null;
    }

    return (
        <div className={styles.page}>
            <div className={styles.themeToggle}>
                <ThemeToggle />
            </div>

            <Card variant="elevated" padding="lg" className={styles.card}>
                <div className={styles.successIcon}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>

                <h1 className={styles.title}>Suara Anda Telah Tercatat!</h1>
                <p className={styles.subtitle}>Terima kasih telah berpartisipasi dalam pemilihan.</p>

                <div className={styles.details}>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Nama</span>
                        <span className={styles.detailValue}>{user?.name || '-'}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>NIM</span>
                        <span className={styles.detailValue}>{user?.nim || '-'}</span>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Pilihan</span>
                        <div className={styles.detailValue}>
                            {voteStatus.kandidat && (
                                <>
                                    <Badge variant="primary">Pasangan #{voteStatus.kandidat.nomor_urut}</Badge>
                                    <span className={styles.kandidatName}>
                                        {voteStatus.kandidat.ketua_nama} & {voteStatus.kandidat.wakil_nama}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Waktu</span>
                        <span className={styles.detailValue}>
                            {voteStatus.voted_at ? formatDateTime(voteStatus.voted_at) : '-'}
                        </span>
                    </div>
                </div>

                <div className={styles.info}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span>Hasil akan diumumkan setelah periode voting berakhir.</span>
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleLogout}
                >
                    Keluar
                </Button>
            </Card>

            <footer className={styles.footer}>
                © {new Date().getFullYear()} e-Voting Kampus
            </footer>
        </div>
    );
}
