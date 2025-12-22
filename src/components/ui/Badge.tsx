import React from 'react';
import styles from './Badge.module.css';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'md',
    className,
    ...props
}) => {
    return (
        <span className={cn(styles.badge, styles[variant], styles[size], className)} {...props}>
            {children}
        </span>
    );
};
