/**
 * Invisible Wallet Demo Page
 * 
 * A dedicated page to showcase and test the Invisible Wallet system
 */

import { InvisibleWalletDemo } from '@/components/invisible-wallet/invisible-wallet-demo';
import { StarBackground } from '@/components/effects/star-background';

export default function InvisibleWalletPage() {
  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      <StarBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <InvisibleWalletDemo />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Invisible Wallet Demo - Galaxy Smart Wallet',
  description: 'Test the Invisible Wallet system that abstracts Stellar blockchain complexity for seamless user experience.',
};
