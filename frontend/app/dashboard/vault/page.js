'use client';

import { useRouter } from 'next/navigation';
import { useVault } from '@/context/VaultContext';
import VaultHome from '@/components/Vault/VaultHome';
import FloatingNav from '@/components/Navigation/FloatingNav';

export default function VaultPage() {
  const router = useRouter();
  const { vaults, verifyPin, createVault } = useVault();

  const handleSelectVault = (year, pin) => {
    const result = verifyPin(year, pin);
    if (result.success) {
      router.push('/dashboard/vault/gallery');
    }
    return result;
  };

  const handleCreateVault = (year, pin) => {
    createVault(year, pin);
    router.push('/dashboard/vault/gallery');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <FloatingNav />
      <main className="relative pt-14">
        <VaultHome
          vaults={vaults}
          onSelectVault={handleSelectVault}
          onCreateVault={handleCreateVault}
        />
      </main>
    </div>
  );
}
