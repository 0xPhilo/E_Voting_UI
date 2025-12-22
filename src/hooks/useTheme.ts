'use client';

import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initialTheme = savedTheme || systemTheme;

        setTheme(initialTheme);
        document.documentElement.setAttribute('data-theme', initialTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }, [theme]);

    const setThemeMode = useCallback((mode: Theme) => {
        setTheme(mode);
        localStorage.setItem('theme', mode);
        document.documentElement.setAttribute('data-theme', mode);
    }, []);

    return {
        theme,
        mounted,
        isDark: theme === 'dark',
        isLight: theme === 'light',
        toggleTheme,
        setTheme: setThemeMode,
    };
}
