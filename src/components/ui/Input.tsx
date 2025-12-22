'use client';

import React, { forwardRef, useId } from 'react';
import styles from './Input.module.css';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, leftIcon, rightIcon, size = 'md', className, id, ...props }, ref) => {
        const generatedId = useId();
        const inputId = id || generatedId;

        return (
            <div className={styles.wrapper}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                    </label>
                )}
                <div className={cn(styles.inputWrapper, error && styles.hasError)}>
                    {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            styles.input,
                            styles[size],
                            leftIcon && styles.hasLeftIcon,
                            rightIcon && styles.hasRightIcon,
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
                </div>
                {error && <span className={styles.error}>{error}</span>}
                {hint && !error && <span className={styles.hint}>{hint}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
