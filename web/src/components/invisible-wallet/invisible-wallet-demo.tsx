/**
 * Invisible Wallet Demo Component
 * 
 * Demonstrates the functionality of the Invisible Wallet system
 * with a user-friendly interface for testing all features.
 */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { useInvisibleWallet } from '@/hooks/use-invisible-wallet';
import { NetworkType } from '@/types/invisible-wallet';
import { Loader2, Eye, EyeOff } from 'lucide-react';

/**
 * Demo component configuration
 */
const DEMO_CONFIG = {
  platformId: 'galaxy-smart-wallet-demo',
  defaultNetwork: 'testnet' as NetworkType,
  debug: true,
};

/**
 * Main demo component
 */
export function InvisibleWalletDemo() {
  const {
    wallet,
    isLoading,
    error,
    isInitialized,
    createWalletWithKeys,
    recoverWallet,
    validatePassphrase,
    clearError,
  } = useInvisibleWallet(DEMO_CONFIG);

  const [formData, setFormData] = useState({
    email: '',
    passphrase: '',
  });
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSuccessMessage(null);
    clearError();
  };

  // Continue: try to recover first, otherwise create (testnet)
  const handleContinue = async () => {
    setSuccessMessage(null);
    try {
      await recoverWallet(formData.email, formData.passphrase, { network: 'testnet' });
      setSuccessMessage('Sesión iniciada correctamente.');
    } catch (e) {
      try {
        await createWalletWithKeys(formData.email, formData.passphrase, {
          network: 'testnet',
          metadata: { source: 'demo-login', timestamp: new Date().toISOString() },
        });
        setSuccessMessage('Wallet creada y sesión iniciada.');
      } catch (e2) {
        console.error('Login failed:', e2);
      }
    }
  };

  // Passphrase validation

  const passphraseValidation = validatePassphrase(formData.passphrase);

  if (!isInitialized) {
    return (
      <Card className="p-6 bg-gray-900/50 border-gray-700">
        <div className="flex items-center justify-center text-white">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Inicializando SDK...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6 bg-gray-900/50 border-gray-700">
        <h1 className="text-2xl font-bold mb-2 text-white">Inicia sesión</h1>
        <p className="text-gray-400 mb-4">Invisible Wallet en testnet</p>

        {error && (
          <Alert variant="destructive">
            <div className="text-sm">{error}</div>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={clearError}
            >
              Limpiar
            </Button>
          </Alert>
        )}

        {successMessage && (
          <div className="mb-2 text-sm text-green-400">{successMessage}</div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@correo.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <Label htmlFor="passphrase" className="text-gray-300">Contraseña</Label>
            <div className="relative">
              <Input
                id="passphrase"
                type={showPassphrase ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                value={formData.passphrase}
                onChange={(e) => handleInputChange('passphrase', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white hover:bg-gray-700"
                onClick={() => setShowPassphrase(!showPassphrase)}
              >
                {showPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {formData.passphrase && (
            <p className={`text-xs ${passphraseValidation.isValid ? 'text-green-400' : 'text-red-400'}`}>
              {passphraseValidation.isValid ? 'Contraseña fuerte' : 'Contraseña débil'}
            </p>
          )}

          <Button
            onClick={handleContinue}
            disabled={isLoading || !formData.email || !formData.passphrase}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Continuar
          </Button>

          {wallet?.publicKey && (
            <div className="text-xs text-gray-400 mt-2">
              Sesión activa: <span className="text-gray-200">{wallet.publicKey}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
