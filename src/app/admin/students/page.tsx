'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Header } from '@/components/layout/Header';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { DataTable, Pagination } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { isAuthenticated, isAdmin } from '@/lib/auth';
import { Mahasiswa } from '@/types';

export default function StudentsPage() {
    const router = useRouter();
    const [students, setStudents] = useState<Mahasiswa[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<'all' | 'voted' | 'not_voted'>('all');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated() || !isAdmin()) {
            router.push('/admin/login');
        }
    }, [router]);

    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.getMahasiswas({
                page: currentPage,
                per_page: 10,
                search: search || undefined,
                status: statusFilter,
            });
            // Handle both paginated and non-paginated responses
            const data = Array.isArray(response.data) ? response.data : [];
            setStudents(data);
            setTotalPages(response.meta?.last_page || 1);
        } catch (error) {
            console.error('Failed to fetch students:', error);
            setStudents([]);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, search, statusFilter]);

    useEffect(() => {
        if (mounted && isAuthenticated() && isAdmin()) {
            fetchStudents();
        }
    }, [mounted, fetchStudents]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchStudents();
    };

    const handleRegenerateToken = async (id: number) => {
        try {
            await api.regenerateToken(id);
            await fetchStudents();
        } catch (error) {
            console.error('Failed to regenerate token:', error);
        }
    };

    const columns = [
        {
            key: 'nim',
            label: 'NIM',
        },
        {
            key: 'name',
            label: 'Nama',
        },
        {
            key: 'program_studi',
            label: 'Program Studi',
        },
        {
            key: 'has_voted',
            label: 'Status',
            render: (value: unknown) => (
                <Badge variant={value ? 'success' : 'warning'}>
                    {value ? '✓ Sudah Vote' : '○ Belum Vote'}
                </Badge>
            ),
        },
        {
            key: 'voting_token',
            label: 'Token',
            render: (value: unknown, row: Mahasiswa) => (
                <div className={styles.tokenCell}>
                    <span className={styles.token}>●●●●●</span>
                    {!row.has_voted && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRegenerateToken(row.id)}
                        >
                            🔄
                        </Button>
                    )}
                </div>
            ),
        },
    ];

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
                        <h1 className={styles.title}>Kelola Mahasiswa</h1>
                        <Button variant="primary" size="sm">
                            📥 Import SIAKAD
                        </Button>
                    </div>

                    <Card variant="default" padding="md" className={styles.filters}>
                        <form onSubmit={handleSearch} className={styles.searchForm}>
                            <Input
                                placeholder="Cari NIM atau nama..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                leftIcon={
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.35-4.35"></path>
                                    </svg>
                                }
                            />
                            <Button type="submit" variant="primary" size="md">
                                Cari
                            </Button>
                        </form>
                        <div className={styles.filterButtons}>
                            <Button
                                variant={statusFilter === 'all' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
                            >
                                Semua
                            </Button>
                            <Button
                                variant={statusFilter === 'voted' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => { setStatusFilter('voted'); setCurrentPage(1); }}
                            >
                                Sudah Vote
                            </Button>
                            <Button
                                variant={statusFilter === 'not_voted' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => { setStatusFilter('not_voted'); setCurrentPage(1); }}
                            >
                                Belum Vote
                            </Button>
                        </div>
                    </Card>

                    <Card variant="default" padding="none">
                        <DataTable
                            columns={columns}
                            data={students}
                            keyField="id"
                            isLoading={isLoading}
                            emptyMessage="Tidak ada data mahasiswa"
                        />
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </Card>
                </main>
            </div>
        </div>
    );
}
