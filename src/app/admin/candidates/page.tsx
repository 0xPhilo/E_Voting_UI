'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Header } from '@/components/layout/Header';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { isAuthenticated, isAdmin } from '@/lib/auth';
import { Kandidat } from '@/types';

interface KandidatFormState {
    nomor_urut: string;
    ketua_nama: string;
    wakil_nama: string;
    visi: string;
    misi: string;
}

const initialFormState: KandidatFormState = {
    nomor_urut: '',
    ketua_nama: '',
    wakil_nama: '',
    visi: '',
    misi: '',
};

export default function CandidatesPage() {
    const router = useRouter();
    const [candidates, setCandidates] = useState<Kandidat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedKandidat, setSelectedKandidat] = useState<Kandidat | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<KandidatFormState>(initialFormState);
    const [formError, setFormError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated() || !isAdmin()) {
            router.push('/admin/login');
        }
    }, [router]);

    const fetchCandidates = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.getKandidatsWithVotes();
            setCandidates(response.data);
        } catch (error) {
            console.error('Failed to fetch candidates:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (mounted && isAuthenticated() && isAdmin()) {
            fetchCandidates();
        }
    }, [mounted, fetchCandidates]);

    const handleOpenAddModal = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setFormError(null);
        setShowFormModal(true);
    };

    const handleOpenEditModal = (kandidat: Kandidat) => {
        setFormData({
            nomor_urut: kandidat.nomor_urut.toString(),
            ketua_nama: kandidat.ketua_nama || '',
            wakil_nama: kandidat.wakil_nama || '',
            visi: kandidat.visi || '',
            misi: kandidat.misi || '',
        });
        setSelectedKandidat(kandidat);
        setIsEditing(true);
        setFormError(null);
        setShowFormModal(true);
    };

    const handleCloseFormModal = () => {
        setShowFormModal(false);
        setSelectedKandidat(null);
        setFormData(initialFormState);
        setFormError(null);
    };

    const handleFormChange = (field: keyof KandidatFormState, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setFormError(null);
    };

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        // Validation
        if (!formData.nomor_urut || !formData.ketua_nama || !formData.wakil_nama || !formData.visi || !formData.misi) {
            setFormError('Semua field wajib diisi');
            return;
        }

        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('nomor_urut', formData.nomor_urut);
            formDataToSend.append('ketua_nama', formData.ketua_nama);
            formDataToSend.append('wakil_nama', formData.wakil_nama);
            formDataToSend.append('visi', formData.visi);
            formDataToSend.append('misi', formData.misi);

            if (isEditing && selectedKandidat) {
                await api.updateKandidat(selectedKandidat.id, formDataToSend);
            } else {
                await api.createKandidat(formDataToSend);
            }

            await fetchCandidates();
            handleCloseFormModal();
        } catch (error) {
            console.error('Failed to save candidate:', error);
            setFormError(error instanceof Error ? error.message : 'Gagal menyimpan kandidat');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedKandidat) return;

        setIsDeleting(true);
        try {
            await api.deleteKandidat(selectedKandidat.id);
            await fetchCandidates();
            setShowDeleteModal(false);
            setSelectedKandidat(null);
        } catch (error) {
            console.error('Failed to delete candidate:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        {
            key: 'nomor_urut',
            label: 'No. Urut',
            render: (value: unknown) => <Badge variant="primary">No. {String(value)}</Badge>,
        },
        {
            key: 'ketua_nama',
            label: 'Nama Ketua',
        },
        {
            key: 'wakil_nama',
            label: 'Nama Wakil',
        },
        {
            key: 'total_votes',
            label: 'Total Suara',
            render: (value: unknown) => <Badge variant="secondary">{String(value || 0)}</Badge>,
        },
        {
            key: 'actions',
            label: 'Aksi',
            render: (_: unknown, row: Kandidat) => (
                <div className={styles.actions}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditModal(row)}
                    >
                        ✏️
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSelectedKandidat(row);
                            setShowDeleteModal(true);
                        }}
                    >
                        🗑️
                    </Button>
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
                        <h1 className={styles.title}>Kelola Kandidat</h1>
                        <Button variant="primary" size="sm" onClick={handleOpenAddModal}>
                            + Tambah Baru
                        </Button>
                    </div>

                    <Card variant="default" padding="none">
                        <DataTable
                            columns={columns}
                            data={candidates}
                            keyField="id"
                            isLoading={isLoading}
                            emptyMessage="Belum ada kandidat"
                        />
                    </Card>
                </main>
            </div>

            {/* Form Modal for Add/Edit */}
            <Modal
                isOpen={showFormModal}
                onClose={handleCloseFormModal}
                title={isEditing ? 'Edit Kandidat' : 'Tambah Kandidat Baru'}
                size="md"
            >
                <form onSubmit={handleSubmitForm} className={styles.form}>
                    {formError && (
                        <div className={styles.formError}>
                            {formError}
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Nomor Urut</label>
                        <Input
                            type="number"
                            placeholder="Contoh: 1"
                            value={formData.nomor_urut}
                            onChange={(e) => handleFormChange('nomor_urut', e.target.value)}
                            min="1"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Nama Ketua</label>
                        <Input
                            type="text"
                            placeholder="Masukkan nama ketua"
                            value={formData.ketua_nama}
                            onChange={(e) => handleFormChange('ketua_nama', e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Nama Wakil</label>
                        <Input
                            type="text"
                            placeholder="Masukkan nama wakil"
                            value={formData.wakil_nama}
                            onChange={(e) => handleFormChange('wakil_nama', e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Visi</label>
                        <textarea
                            className={styles.textarea}
                            placeholder="Masukkan visi kandidat"
                            value={formData.visi}
                            onChange={(e) => handleFormChange('visi', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Misi</label>
                        <textarea
                            className={styles.textarea}
                            placeholder="Masukkan misi kandidat (pisahkan dengan baris baru)"
                            value={formData.misi}
                            onChange={(e) => handleFormChange('misi', e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className={styles.modalActions}>
                        <Button type="button" variant="ghost" onClick={handleCloseFormModal}>
                            Batal
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isSubmitting}>
                            {isEditing ? 'Simpan Perubahan' : 'Tambah Kandidat'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Hapus Kandidat"
                size="sm"
            >
                <div className={styles.deleteModal}>
                    <p>
                        Apakah Anda yakin ingin menghapus kandidat{' '}
                        <strong>No. {selectedKandidat?.nomor_urut}</strong>?
                    </p>
                    <p className={styles.deleteWarning}>
                        Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className={styles.modalActions}>
                        <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
                            Batal
                        </Button>
                        <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
                            Hapus
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
