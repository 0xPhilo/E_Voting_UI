'use client';

import React from 'react';
import styles from './DataTable.module.css';
import { cn } from '@/lib/utils';

interface Column<T> {
    key: string;
    label: string;
    render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyField: keyof T;
    isLoading?: boolean;
    emptyMessage?: string;
}

export function DataTable<T>({
    columns,
    data,
    keyField,
    isLoading = false,
    emptyMessage = 'Tidak ada data',
}: DataTableProps<T>) {
    // Ensure data is always an array
    const safeData = Array.isArray(data) ? data : [];

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Memuat data...</p>
            </div>
        );
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className={styles.th}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {safeData.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className={styles.empty}>
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        safeData.map((row, index) => (
                            <tr key={String(row[keyField]) || index} className={styles.tr}>
                                {columns.map((col) => (
                                    <td key={col.key} className={styles.td}>
                                        {col.render
                                            ? col.render((row as Record<string, unknown>)[col.key], row)
                                            : String((row as Record<string, unknown>)[col.key] ?? '-')}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className={styles.pagination}>
            <button
                className={styles.pageBtn}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ◀
            </button>

            {startPage > 1 && (
                <>
                    <button className={styles.pageBtn} onClick={() => onPageChange(1)}>
                        1
                    </button>
                    {startPage > 2 && <span className={styles.ellipsis}>...</span>}
                </>
            )}

            {pages.map((page) => (
                <button
                    key={page}
                    className={cn(styles.pageBtn, currentPage === page && styles.active)}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className={styles.ellipsis}>...</span>}
                    <button className={styles.pageBtn} onClick={() => onPageChange(totalPages)}>
                        {totalPages}
                    </button>
                </>
            )}

            <button
                className={styles.pageBtn}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                ▶
            </button>
        </div>
    );
};
