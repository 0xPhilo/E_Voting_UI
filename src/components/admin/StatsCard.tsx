import React from 'react';
import styles from './StatsCard.module.css';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    variant?: 'default' | 'primary' | 'success' | 'warning';
    trend?: {
        value: number;
        label: string;
    };
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    variant = 'default',
    trend,
}) => {
    return (
        <Card variant="default" padding="lg" className={cn(styles.card, styles[variant])}>
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
                {icon && <span className={styles.icon}>{icon}</span>}
            </div>
            <div className={styles.value}>{value}</div>
            {trend && (
                <div className={cn(styles.trend, trend.value >= 0 ? styles.positive : styles.negative)}>
                    <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
                    <span className={styles.trendLabel}>{trend.label}</span>
                </div>
            )}
        </Card>
    );
};
