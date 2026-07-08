'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVault } from '@/context/VaultContext';
import VaultViewer from '@/components/Vault/VaultViewer';

export default function VaultGalleryPage() {
  const router = useRouter();
  const { currentVault, isUnlocked, hasHydrated, addMemory, generateYearlyReflection, exportVault, lockVault } = useVault();

  useEffect(() => {
    if (hasHydrated && (!currentVault || !isUnlocked)) {
      router.replace('/dashboard/vault');
    }
  }, [currentVault, hasHydrated, isUnlocked, router]);

  if (!hasHydrated || !currentVault || !isUnlocked) {
    return null;
  }

  const handleLock = () => {
    lockVault();
    router.replace('/dashboard/vault');
  };

  return (
    <VaultViewer
      vault={currentVault}
      onLock={handleLock}
      onAddMemory={addMemory}
      onGenerateReflection={generateYearlyReflection}
      onExport={exportVault}
    />
  );
}