'use client';

import React from 'react';
import styles from './VotingChart.module.css';
import { Card } from '@/components/ui/Card';
import { VotingResult } from '@/types';
import { formatPercentage, getKandidatColor } from '@/lib/utils';

interface VotingChartProps {
    results: VotingResult[];
    title?: string;
}

export const VotingChart: React.FC<VotingChartProps> = ({
    results = [],
    title = 'Hasil Voting Real-time',
}) => {
    // Ensure results is an array
    const safeResults = Array.isArray(results) ? results : [];
    const totalVotes = safeResults.reduce((sum, r) => sum + (r.total_votes || 0), 0);

    if (safeResults.length === 0) {
        return (
            <Card variant="default" padding="lg" className={styles.card}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.empty}>Belum ada data voting</div>
            </Card>
        );
    }

    return (
        <Card variant="default" padding="lg" className={styles.card}>
            <h3 className={styles.title}>{title}</h3>

            <div className={styles.chart}>
                {safeResults.map((result, index) => (
                    <div key={result.kandidat?.id || index} className={styles.barContainer}>
                        <div className={styles.barInfo}>
                            <span className={styles.barLabel}>
                                No. {result.kandidat?.nomor_urut} - {result.kandidat?.ketua_nama}
                            </span>
                            <span className={styles.barValue}>
                                {result.total_votes} ({formatPercentage(result.percentage)})
                            </span>
                        </div>
                        <div className={styles.barTrack}>
                            <div
                                className={styles.barFill}
                                style={{
                                    width: `${result.percentage}%`,
                                    backgroundColor: getKandidatColor(index),
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.total}>
                Total: <strong>{totalVotes}</strong> suara
            </div>
        </Card>
    );
};
