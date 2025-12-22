import React from 'react';
import styles from './Card.module.css';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'outlined' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    selected?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'md',
    hoverable = false,
    selected = false,
    className,
    ...props
}) => {
    return (
        <div
            className={cn(
                styles.card,
                styles[variant],
                styles[`padding-${padding}`],
                hoverable && styles.hoverable,
                selected && styles.selected,
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className, ...props }) => {
    return (
        <div className={cn(styles.header, className)} {...props}>
            {children}
        </div>
    );
};

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> { }

export const CardContent: React.FC<CardContentProps> = ({ children, className, ...props }) => {
    return (
        <div className={cn(styles.content, className)} {...props}>
            {children}
        </div>
    );
};

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> { }

export const CardFooter: React.FC<CardFooterProps> = ({ children, className, ...props }) => {
    return (
        <div className={cn(styles.footer, className)} {...props}>
            {children}
        </div>
    );
};
