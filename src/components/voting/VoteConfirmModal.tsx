'use client';

import React, { useState } from 'react';
import styles from './VoteConfirmModal.module.css';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { Kandidat } from '@/types';

interface VoteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    kandidat: Kandidat | null;
    onConfirm: () => void;
    isSubmitting?: boolean;
}

export const VoteConfirmModal: React.FC<VoteConfirmModalProps> = ({
    isOpen,
    onClose,
    kandidat,
    onConfirm,
    isSubmitting = false,
}) => {
    const [confirmed, setConfirmed] = useState(false);

    const handleClose = () => {
        setConfirmed(false);
        onClose();
    };

    const handleConfirm = () => {
        if (confirmed) {
            onConfirm();
        }
    };

    if (!kandidat) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Konfirmasi Pilihan Anda"
            size="md"
            closeOnBackdrop={!isSubmitting}
            closeOnEscape={!isSubmitting}
        >
            <div className={styles.content}>
                <div className={styles.warning}>
                    <span className={styles.warningIcon}>⚠️</span>
                    <div>
                        <strong>PERHATIAN!</strong>
                        <p>Pilihan tidak dapat diubah setelah submit.</p>
                    </div>
                </div>

                <div className={styles.selectedCard}>
                    <div className={styles.cardLabel}>Anda akan memilih:</div>
                    <Badge variant="primary" size="md">No. {kandidat.nomor_urut}</Badge>

                    <div className={styles.photos}>
                        <div className={styles.photoWrapper}>
                            {kandidat.ketua_foto ? (
                                <img src={kandidat.ketua_foto} alt={kandidat.ketua_nama} className={styles.photo} />
                            ) : (
                                <div className={styles.photoPlaceholder}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className={styles.photoWrapper}>
                            {kandidat.wakil_foto ? (
                                <img src={kandidat.wakil_foto} alt={kandidat.wakil_nama} className={styles.photo} />
                            ) : (
                                <div className={styles.photoPlaceholder}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.names}>
                        {kandidat.ketua_nama} & {kandidat.wakil_nama}
                    </div>
                </div>

                <Checkbox
                    label="Saya yakin dengan pilihan saya dan memahami suara tidak dapat diubah."
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    disabled={isSubmitting}
                />

                <div className={styles.actions}>
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={!confirmed}
                        isLoading={isSubmitting}
                    >
                        Submit Pilihan Saya
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
