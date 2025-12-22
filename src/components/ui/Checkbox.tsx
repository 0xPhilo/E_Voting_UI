'use client';

import React, { forwardRef } from 'react';
import styles from './Checkbox.module.css';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    description?: string;
    error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, description, error, className, id, ...props }, ref) => {
        const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className={cn(styles.wrapper, error && styles.hasError, className)}>
                <div className={styles.container}>
                    <input
                        ref={ref}
                        type="checkbox"
                        id={inputId}
                        className={styles.input}
                        {...props}
                    />
                    <span className={styles.checkmark}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </span>
                </div>
                {(label || description) && (
                    <div className={styles.labelContainer}>
                        {label && (
                            <label htmlFor={inputId} className={styles.label}>
                                {label}
                            </label>
                        )}
                        {description && <span className={styles.description}>{description}</span>}
                    </div>
                )}
                {error && <span className={styles.error}>{error}</span>}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';
