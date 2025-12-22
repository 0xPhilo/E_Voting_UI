'use client';

import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import { VoteStatus } from '@/types';

export function useVote() {
    const [voteStatus, setVoteStatus] = useState<VoteStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkVoteStatus = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.getVoteStatus();
            setVoteStatus(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to check vote status');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const submitVote = useCallback(async (kandidatId: number) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await api.submitVote(kandidatId);
            setVoteStatus(response.data);
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Voting gagal';
            setError(message);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    useEffect(() => {
        checkVoteStatus();
    }, [checkVoteStatus]);

    return {
        voteStatus,
        hasVoted: voteStatus?.has_voted ?? false,
        isLoading,
        isSubmitting,
        error,
        checkVoteStatus,
        submitVote,
        clearError: () => setError(null),
    };
}
