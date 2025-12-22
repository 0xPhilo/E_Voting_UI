'use client';

import React from 'react';
import styles from './CandidateDetail.module.css';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Kandidat } from '@/types';

interface CandidateDetailProps {
    isOpen: boolean;
    onClose: () => void;
    kandidat: Kandidat | null;
    onSelect?: (kandidat: Kandidat) => void;
    isSelected?: boolean;
    disabled?: boolean;
}

export const CandidateDetail: React.FC<CandidateDetailProps> = ({
    isOpen,
    onClose,
    kandidat,
    onSelect,
    isSelected = false,
    disabled = false,
}) => {
    if (!kandidat) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Detail Kandidat No. ${kandidat.nomor_urut}`}
            size="lg"
        >
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.photos}>
                        <div className={styles.photoWrapper}>
                            {kandidat.ketua_foto ? (
                                <img src={kandidat.ketua_foto} alt={kandidat.ketua_nama} className={styles.photo} />
                            ) : (
                                <div className={styles.photoPlaceholder}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            )}
                            <div className={styles.photoInfo}>
                                <Badge variant="primary" size="sm">Ketua</Badge>
                                <span className={styles.name}>{kandidat.ketua_nama}</span>
                            </div>
                        </div>

                        <div className={styles.photoWrapper}>
                            {kandidat.wakil_foto ? (
                                <img src={kandidat.wakil_foto} alt={kandidat.wakil_nama} className={styles.photo} />
                            ) : (
                                <div className={styles.photoPlaceholder}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            )}
                            <div className={styles.photoInfo}>
                                <Badge variant="secondary" size="sm">Wakil</Badge>
                                <span className={styles.name}>{kandidat.wakil_nama}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>Visi</h4>
                    <p className={styles.sectionContent}>{kandidat.visi}</p>
                </div>

                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>Misi</h4>
                    <div
                        className={styles.sectionContent}
                        dangerouslySetInnerHTML={{ __html: kandidat.misi }}
                    />
                </div>

                <div className={styles.actions}>
                    <Button variant="ghost" onClick={onClose}>
                        Tutup
                    </Button>
                    {onSelect && (
                        <Button
                            variant={isSelected ? 'secondary' : 'primary'}
                            onClick={() => {
                                onSelect(kandidat);
                                onClose();
                            }}
                            disabled={disabled}
                            leftIcon={
                                isSelected ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ) : undefined
                            }
                        >
                            {isSelected ? 'Dipilih' : 'Pilih Kandidat Ini'}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};
