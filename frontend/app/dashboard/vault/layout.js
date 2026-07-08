'use client';

import { VaultProvider } from '@/context/VaultContext';

export default function VaultLayout({ children }) {
  return <VaultProvider>{children}</VaultProvider>;
}