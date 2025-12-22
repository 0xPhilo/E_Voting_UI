import React from 'react';
import styles from './CandidateCard.module.css';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Kandidat } from '@/types';
import { cn } from '@/lib/utils';

interface CandidateCardProps {
    kandidat: Kandidat;
    isSelected?: boolean;
    onSelect?: (kandidat: Kandidat) => void;
    onViewDetail?: (kandidat: Kandidat) => void;
    disabled?: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
    kandidat,
    isSelected = false,
    onSelect,
    onViewDetail,
    disabled = false,
}) => {
    return (
        <Card
            variant="default"
            padding="none"
            hoverable={!disabled}
            selected={isSelected}
            className={cn(styles.card, disabled && styles.disabled)}
        >
            <div className={styles.header}>
                <Badge variant={isSelected ? 'primary' : 'default'} size="sm">
                    No. {kandidat.nomor_urut}
                </Badge>
            </div>

            <div className={styles.photos}>
                <div className={styles.photoWrapper}>
                    {kandidat.ketua_foto ? (
                        <img
                            src={kandidat.ketua_foto}
                            alt={kandidat.ketua_nama}
                            className={styles.photo}
                        />
                    ) : (
                        <div className={styles.photoPlaceholder}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                    )}
                    <span className={styles.role}>Ketua</span>
                </div>

                <div className={styles.photoWrapper}>
                    {kandidat.wakil_foto ? (
                        <img
                            src={kandidat.wakil_foto}
                            alt={kandidat.wakil_nama}
                            className={styles.photo}
                        />
                    ) : (
                        <div className={styles.photoPlaceholder}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                    )}
                    <span className={styles.role}>Wakil</span>
                </div>
            </div>

            <div className={styles.names}>
                <h3 className={styles.name}>{kandidat.ketua_nama}</h3>
                <span className={styles.separator}>&</span>
                <h3 className={styles.name}>{kandidat.wakil_nama}</h3>
            </div>

            <div className={styles.actions}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetail?.(kandidat)}
                >
                    Detail
                </Button>
                <Button
                    variant={isSelected ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => onSelect?.(kandidat)}
                    disabled={disabled}
                    leftIcon={
                        isSelected ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        ) : undefined
                    }
                >
                    {isSelected ? 'Dipilih' : 'Pilih'}
                </Button>
            </div>
        </Card>
    );
};
