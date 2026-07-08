'use client';

import { AuthProvider } from '@/context/AuthContext';
import { JournalProvider } from '@/context/JournalContext';
import { VaultProvider } from '@/context/VaultContext';
import { CapsuleProvider } from '@/context/CapsuleContext';
import { MemoryProvider } from '@/context/MemoryContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <JournalProvider>
        <VaultProvider>
          <CapsuleProvider>
            <MemoryProvider>
              {children}
              <Toaster position="top-right" />
            </MemoryProvider>
          </CapsuleProvider>
        </VaultProvider>
      </JournalProvider>
    </AuthProvider>
  );
}
