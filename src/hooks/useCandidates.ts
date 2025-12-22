'use client';

import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import { Kandidat } from '@/types';

export function useCandidates() {
    const [candidates, setCandidates] = useState<Kandidat[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCandidates = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.getKandidats();
            setCandidates(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch candidates');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchCandidatesWithVotes = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.getKandidatsWithVotes();
            setCandidates(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch candidates');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    return {
        candidates,
        isLoading,
        error,
        refetch: fetchCandidates,
        refetchWithVotes: fetchCandidatesWithVotes,
    };
}
