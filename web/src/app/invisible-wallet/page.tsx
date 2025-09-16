/**
 * Invisible Wallet Demo Page
 * 
 * A dedicated page to showcase and test the Invisible Wallet system
 */

import { InvisibleWalletDemo } from '@/components/invisible-wallet/invisible-wallet-demo';

export default function InvisibleWalletPage() {
  return (
    <main className="min-h-screen">
      <InvisibleWalletDemo />
    </main>
  );
}

export const metadata = {
  title: 'Invisible Wallet Demo - Galaxy Smart Wallet',
  description: 'Test the Invisible Wallet system that abstracts Stellar blockchain complexity for seamless user experience.',
};
