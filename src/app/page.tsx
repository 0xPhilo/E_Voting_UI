'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { CandidateCard } from '@/components/candidate/CandidateCard';
import { CandidateDetail } from '@/components/candidate/CandidateDetail';
import { VoteConfirmModal } from '@/components/voting/VoteConfirmModal';
import { useCandidates } from '@/hooks/useCandidates';
import { useVote } from '@/hooks/useVote';
import { isAuthenticated, isMahasiswa } from '@/lib/auth';
import { Kandidat } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const { candidates, isLoading: isCandidatesLoading } = useCandidates();
  const { hasVoted, submitVote, isSubmitting, error: voteError } = useVote();

  const [selectedKandidat, setSelectedKandidat] = useState<Kandidat | null>(null);
  const [detailKandidat, setDetailKandidat] = useState<Kandidat | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (hasVoted) {
      router.push('/status');
    }
  }, [hasVoted, router]);

  const handleSelect = (kandidat: Kandidat) => {
    setSelectedKandidat(kandidat);
  };

  const handleViewDetail = (kandidat: Kandidat) => {
    setDetailKandidat(kandidat);
  };

  const handleProceed = () => {
    if (selectedKandidat) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmVote = async () => {
    if (selectedKandidat) {
      const success = await submitVote(selectedKandidat.id);
      if (success) {
        router.push('/status');
      }
    }
  };

  if (!mounted || !isAuthenticated()) {
    return null;
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Pemilihan Ketua & Wakil Ketua BEM</h1>
            <p className={styles.subtitle}>Gunakan hak suara Anda dengan bijak.</p>
          </div>

          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNumber}>①</span>
              <span>Lihat profil</span>
            </div>
            <span className={styles.stepArrow}>→</span>
            <div className={styles.step}>
              <span className={styles.stepNumber}>②</span>
              <span>Pilih kandidat</span>
            </div>
            <span className={styles.stepArrow}>→</span>
            <div className={styles.step}>
              <span className={styles.stepNumber}>③</span>
              <span>Submit</span>
            </div>
          </div>

          {isCandidatesLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Memuat kandidat...</p>
            </div>
          ) : (
            <div className={styles.candidateGrid}>
              {candidates.map((kandidat) => (
                <CandidateCard
                  key={kandidat.id}
                  kandidat={kandidat}
                  isSelected={selectedKandidat?.id === kandidat.id}
                  onSelect={handleSelect}
                  onViewDetail={handleViewDetail}
                />
              ))}
            </div>
          )}

          {voteError && (
            <div className={styles.error}>
              {voteError}
            </div>
          )}
        </div>

        {selectedKandidat && (
          <div className={styles.bottomBar}>
            <div className={styles.container}>
              <div className={styles.bottomContent}>
                <div className={styles.selectedInfo}>
                  <span>Anda memilih:</span>
                  <strong>Pasangan #{selectedKandidat.nomor_urut}</strong>
                </div>
                <Button variant="primary" onClick={handleProceed}>
                  Lanjutkan ke Konfirmasi
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <CandidateDetail
        isOpen={!!detailKandidat}
        onClose={() => setDetailKandidat(null)}
        kandidat={detailKandidat}
        onSelect={handleSelect}
        isSelected={detailKandidat?.id === selectedKandidat?.id}
      />

      <VoteConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        kandidat={selectedKandidat}
        onConfirm={handleConfirmVote}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
