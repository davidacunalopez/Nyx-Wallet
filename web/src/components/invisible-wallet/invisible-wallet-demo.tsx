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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInvisibleWallet } from '@/hooks/use-invisible-wallet';
import { NetworkType } from '@/types/invisible-wallet';
import { Loader2, CheckCircle, AlertCircle, Eye, EyeOff, Copy, Send, Clipboard, Info } from 'lucide-react';
import { useStellarPayment } from '@/hooks/use-stellar-payments';
import { validateStellarAddress } from '@/lib/stellar/validation';
import { useToast } from '@/hooks/use-toast';

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
    getWallet,
    signTransaction,
    validatePassphrase,
    clearError,
    refreshWallet,
  } = useInvisibleWallet(DEMO_CONFIG);

  const [activeTab, setActiveTab] = useState('create');
  const [formData, setFormData] = useState({
    email: '',
    passphrase: '',
    network: 'testnet' as NetworkType,
  });
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [transactionXDR, setTransactionXDR] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [signResult, setSignResult] = useState<any>(null);
  const [createdWallet, setCreatedWallet] = useState<{
    publicKey: string;
    secretKey: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    walletResponse: any;
  } | null>(null);
  const [showSecretKey, setShowSecretKey] = useState(false);

  // Send form state
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [addressValidation, setAddressValidation] = useState<{
    isValid: boolean;
    error?: string;
  } | null>(null);

  // Stellar payment hook
  const { sendXLM, loading: sendLoading, txResult: sendResult, resetTxResult } = useStellarPayment();
  const { toast } = useToast();

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearError();
    // Clear created wallet when changing form data
    if (createdWallet) setCreatedWallet(null);
  };

  // Handle wallet creation
  const handleCreateWallet = async () => {
    try {
      const result = await createWalletWithKeys(formData.email, formData.passphrase, {
        network: formData.network,
        metadata: { source: 'demo', timestamp: new Date().toISOString() }
      });
      console.log('Wallet created:', result);
      
      // Store the created wallet info to display keys
      setCreatedWallet({
        publicKey: result.publicKey,
        secretKey: result.secretKey,
        walletResponse: result
      });
    } catch (error) {
      console.error('Failed to create wallet:', error);
    }
  };

  // Handle wallet recovery
  const handleRecoverWallet = async () => {
    try {
      const result = await recoverWallet(formData.email, formData.passphrase, {
        network: formData.network,
      });
      console.log('Wallet recovered:', result);
      
      // Store the recovered wallet info to use for sending
      if (result && result.publicKey && result.secretKey) {
        setCreatedWallet({
          publicKey: result.publicKey,
          secretKey: result.secretKey,
          walletResponse: result
        });
      }
    } catch (error) {
      console.error('Failed to recover wallet:', error);
    }
  };

  // Handle wallet lookup
  const handleGetWallet = async () => {
    try {
      const result = await getWallet(formData.email, {
        network: formData.network,
      });
      console.log('Wallet retrieved:', result);
      
      // If we have the wallet data and passphrase, we can use it for sending
      if (result && result.publicKey && formData.passphrase) {
        // Note: For lookup, we don't have the secret key, so we can't send money
        // But we can show the wallet info
        toast({
          title: "Wallet Found",
          description: `Wallet found: ${result.publicKey}. To send money, please recover the wallet with your passphrase.`,
        });
      }
    } catch (error) {
      console.error('Failed to get wallet:', error);
    }
  };

  // Handle transaction signing
  const handleSignTransaction = async () => {
    if (!wallet || !transactionXDR.trim()) return;

    try {
      const result = await signTransaction(
        wallet.id,
        formData.email,
        formData.passphrase,
        transactionXDR.trim()
      );
      setSignResult(result);
      console.log('Transaction signed:', result);
    } catch (error) {
      console.error('Failed to sign transaction:', error);
    }
  };

  // Copy to clipboard utility
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Passphrase validation
  const passphraseValidation = validatePassphrase(formData.passphrase);

  // Handle send transaction result
  React.useEffect(() => {
    if (!sendResult) return;
    
    if (sendResult.success) {
      toast({
        title: "Success!",
        description: `Transaction sent successfully. Hash: ${sendResult.hash}`,
      });
      // Clear form
      setSendAddress('');
      setSendAmount('');
      // Refresh wallet balance
      setTimeout(() => {
        refreshWallet();
      }, 2000);
    } else if (sendResult.error) {
      toast({
        title: "Transaction Failed",
        description: sendResult.error,
      });
    }
  }, [sendResult, toast, refreshWallet]);

  // Address validation for send form
  React.useEffect(() => {
    if (sendAddress.trim()) {
      const validation = validateStellarAddress(sendAddress);
      setAddressValidation(validation);
    } else {
      setAddressValidation(null);
    }
  }, [sendAddress]);

  // Handle send money
  const handleSendMoney = async () => {
    if (!createdWallet || !formData.passphrase) {
      toast({
        title: "Error",
        description: "Please create a wallet first and ensure passphrase is entered",
      });
      return;
    }

    if (!addressValidation?.isValid) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Stellar address",
      });
      return;
    }

    if (!sendAmount || Number(sendAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
      });
      return;
    }

    try {
      toast({
        title: "Transaction initiated",
        description: `Sending ${sendAmount} XLM to ${sendAddress.substring(0, 6)}...${sendAddress.substring(sendAddress.length - 4)}`,
      });

      // Call sendXLM - it will update txResult state
      await sendXLM({
        destination: sendAddress,
        amount: sendAmount,
        privateKey: createdWallet.secretKey
      });

      // The success/failure will be handled by the sendResult effect below
    } catch (error) {
      console.error('Failed to send money:', error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  // Handle paste from clipboard
  const handlePasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSendAddress(text);
      toast({
        title: "Address pasted",
        description: "Stellar address has been pasted from clipboard",
      });
    } catch {
      toast({
        title: "Could not access clipboard",
        description: "Please paste the address manually",
      });
    }
  };

  if (!isInitialized) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-6 bg-[#1A1B2E]/80 border-[#2D2E42] backdrop-blur-sm">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2 text-white" />
            <span className="text-white">Initializing Invisible Wallet SDK...</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <Card className="p-6 bg-[#1A1B2E]/80 border-[#2D2E42] backdrop-blur-sm">
        <h1 className="text-2xl font-bold mb-2 text-white">🔐 Invisible Wallet Demo</h1>
        <p className="text-gray-300">
          Test the Invisible Wallet system that abstracts Stellar blockchain complexity
        </p>
        <div className="flex gap-2 mt-4">
          <Badge variant="outline">Platform: {DEMO_CONFIG.platformId}</Badge>
          <Badge variant="outline">Network: {formData.network}</Badge>
          <Badge variant={isInitialized ? "default" : "destructive"}>
            {isInitialized ? "Ready" : "Not Ready"}
          </Badge>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <div>
            <strong>Error:</strong> {error}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={clearError}
            >
              Clear
            </Button>
          </div>
        </Alert>
      )}

      {/* Created Wallet Keys Display */}
      {createdWallet && (
        <Card className="p-6 bg-green-900/20 border-green-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-400">✅ Wallet Created Successfully!</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCreatedWallet(null)}
              className="text-green-400 border-green-500/50 hover:bg-green-500/20"
            >
              Clear
            </Button>
          </div>
          <div className="space-y-4">
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-amber-400 mt-1">⚠️</div>
                <div>
                  <h4 className="font-semibold text-amber-300 mb-1">Security Warning</h4>
                  <p className="text-amber-200 text-sm">
                    These keys are shown for demo purposes only. In production, private keys should never be displayed or logged.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="text-sm font-medium text-green-400">Public Key (Safe to share)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs bg-[#0A0B1E] p-3 rounded border border-[#2D2E42] flex-1 font-mono text-gray-300">
                    {createdWallet.publicKey}
                  </code>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(createdWallet.publicKey)}
                    className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-sm font-medium text-green-400">Private Key (Keep Secret!)</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="text-green-400 hover:bg-green-500/20"
                  >
                    {showSecretKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-[#0A0B1E] p-3 rounded border border-[#2D2E42] flex-1 font-mono text-gray-300">
                    {showSecretKey ? createdWallet.secretKey : '•'.repeat(56)}
                  </code>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(createdWallet.secretKey)}
                    disabled={!showSecretKey}
                    className="border-green-500/50 text-green-400 hover:bg-green-500/20 disabled:opacity-50"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-sm font-medium text-green-400">Wallet ID</Label>
                  <code className="text-xs bg-[#0A0B1E] p-2 rounded border border-[#2D2E42] block mt-1 font-mono text-gray-300">
                    {createdWallet.walletResponse.id}
                  </code>
                </div>
                <div>
                  <Label className="text-sm font-medium text-green-400">Network</Label>
                  <Badge variant="outline" className="mt-1 border-green-500/50 text-green-400">
                    {createdWallet.walletResponse.network}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-blue-300 mb-2">How to verify your wallet:</h4>
              <ol className="text-blue-200 text-sm space-y-1 list-decimal list-inside">
                <li>Copy the public key above</li>
                <li>Go to <a href={`https://stellar.expert/explorer/${formData.network}/account/${createdWallet.publicKey}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-100">Stellar Expert</a> or <a href={`https://stellarchain.io/accounts/${createdWallet.publicKey}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-100">StellarChain</a></li>
                <li>Search for your account to see it exists</li>
                <li>If on testnet, the account should be funded automatically</li>
              </ol>
            </div>
          </div>
        </Card>
      )}

      {/* Current Wallet Display */}
      {wallet && (
        <Card className="p-6 bg-[#1A1B2E]/80 border-[#2D2E42] backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Current Wallet</h3>
            <Button variant="outline" size="sm" onClick={refreshWallet}>
              Refresh Balance
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-300">Public Key</Label>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-xs bg-[#0A0B1E] p-2 rounded border border-[#2D2E42] flex-1 text-gray-300">
                  {wallet.publicKey}
                </code>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(wallet.publicKey)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-300">Wallet ID</Label>
              <code className="text-xs bg-[#0A0B1E] p-2 rounded border border-[#2D2E42] block mt-1 text-gray-300">
                {wallet.id}
              </code>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-300">Status</Label>
              <div className="mt-1">
                <Badge variant={wallet.accountExists ? "default" : "secondary"}>
                  {wallet.accountExists ? "Account Exists" : "Account Not Found"}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-300">Balances</Label>
              <div className="mt-1 space-y-1">
                {wallet.balances.length > 0 ? (
                  wallet.balances.map((balance, index) => (
                    <div key={index} className="text-sm">
                      <Badge variant="outline">
                        {balance.balance} {balance.assetCode || 'XLM'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">No balances</span>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Main Interface */}
      <Card className="p-6 bg-[#1A1B2E]/80 border-[#2D2E42] backdrop-blur-sm">
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          // Clear send form when changing tabs (but keep created wallet data)
          if (value !== 'send') {
            setSendAddress('');
            setSendAmount('');
            resetTxResult();
          }
        }}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="create">Create Wallet</TabsTrigger>
            <TabsTrigger value="recover">Recover Wallet</TabsTrigger>
            <TabsTrigger value="lookup">Lookup Wallet</TabsTrigger>
            <TabsTrigger value="sign">Sign Transaction</TabsTrigger>
            <TabsTrigger value="send">Send Money</TabsTrigger>
          </TabsList>

          {/* Common Form Fields */}
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="network">Network</Label>
                <select
                  id="network"
                  className="w-full px-3 py-2 border border-[#2D2E42] rounded-md bg-[#0A0B1E] text-white"
                  value={formData.network}
                  onChange={(e) => handleInputChange('network', e.target.value as NetworkType)}
                >
                  <option value="testnet">Testnet</option>
                  <option value="mainnet">Mainnet</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="passphrase">Passphrase</Label>
              <div className="relative">
                <Input
                  id="passphrase"
                  type={showPassphrase ? "text" : "password"}
                  placeholder="Enter a strong passphrase"
                  value={formData.passphrase}
                  onChange={(e) => handleInputChange('passphrase', e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                >
                  {showPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              {/* Passphrase Validation */}
              {formData.passphrase && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    {passphraseValidation.isValid ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${passphraseValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {passphraseValidation.isValid ? 'Strong passphrase' : 'Weak passphrase'}
                    </span>
                  </div>
                  {!passphraseValidation.isValid && passphraseValidation.errors.length > 0 && (
                    <ul className="text-xs text-red-600 space-y-1">
                      {passphraseValidation.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          <TabsContent value="create">
            <div className="mt-6">
              <Button 
                onClick={handleCreateWallet}
                disabled={isLoading || !formData.email || !formData.passphrase || !passphraseValidation.isValid}
                className="w-full"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Invisible Wallet
              </Button>
              <p className="text-sm text-gray-300 mt-2">
                Creates a new Stellar wallet encrypted with your passphrase. 
                On testnet, the account will be automatically funded.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="recover">
            <div className="mt-6">
              <Button 
                onClick={handleRecoverWallet}
                disabled={isLoading || !formData.email || !formData.passphrase}
                className="w-full"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Recover Wallet
              </Button>
              <p className="text-sm text-gray-300 mt-2">
                Recovers an existing wallet using your email and passphrase.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="lookup">
            <div className="mt-6">
              <Button 
                onClick={handleGetWallet}
                disabled={isLoading || !formData.email}
                className="w-full"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Lookup Wallet
              </Button>
              <p className="text-sm text-gray-300 mt-2">
                Retrieves wallet information and balance without requiring passphrase.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="sign">
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="transaction-xdr">Transaction XDR</Label>
                <textarea
                  id="transaction-xdr"
                  className="w-full px-3 py-2 border border-[#2D2E42] rounded-md h-32 bg-[#0A0B1E] text-white placeholder-gray-400"
                  placeholder="Paste Stellar transaction XDR here..."
                  value={transactionXDR}
                  onChange={(e) => setTransactionXDR(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleSignTransaction}
                disabled={isLoading || !wallet || !transactionXDR.trim() || !formData.passphrase}
                className="w-full"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Sign Transaction
              </Button>

              {/* Sign Result */}
              {signResult && (
                <div className="mt-4 p-4 border border-[#2D2E42] rounded-md bg-[#0A0B1E]/50">
                  <h4 className="font-medium mb-2 text-white">Signing Result</h4>
                  <div className="space-y-2">
                    <div>
                      <Badge variant={signResult.success ? "default" : "destructive"}>
                        {signResult.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                    {signResult.success ? (
                      <>
                        <div>
                          <Label className="text-sm text-gray-300">Transaction Hash</Label>
                          <code className="text-xs bg-[#0A0B1E] p-2 rounded border border-[#2D2E42] block mt-1 text-gray-300">
                            {String(signResult.transactionHash || '')}
                          </code>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-300">Signed XDR</Label>
                          <textarea
                            className="w-full px-3 py-2 border border-[#2D2E42] rounded-md h-20 text-xs bg-[#0A0B1E] text-gray-300"
                            value={String(signResult.signedXDR || '')}
                            readOnly
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-red-400 text-sm">
                        Error: {String(signResult.error || 'Unknown error')}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-300">
                Signs a Stellar transaction with the wallet&apos;s private key.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="send">
            <div className="mt-6 space-y-4">
              {!createdWallet ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Wallet Required</h3>
                  <p className="text-gray-300 mb-4">
                    To send money, you need to create or recover a wallet first.
                  </p>
                  <div className="bg-[#0A0B1E]/50 rounded-lg p-4 text-left">
                    <h4 className="text-white font-medium mb-2">Options:</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• <strong>Create Wallet:</strong> Go to &quot;Create Wallet&quot; tab to create a new wallet</li>
                      <li>• <strong>Recover Wallet:</strong> Go to &quot;Recover Wallet&quot; tab if you already have a wallet</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  {/* Active Wallet Info */}
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <h4 className="text-green-400 font-medium">Active Wallet Ready</h4>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCreatedWallet(null)}
                        className="text-green-400 border-green-500/50 hover:bg-green-500/20"
                      >
                        Change Wallet
                      </Button>
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div><strong>Public Key:</strong> {createdWallet.publicKey}</div>
                      <div><strong>Network:</strong> {createdWallet.walletResponse.network}</div>
                      <div><strong>Status:</strong> Ready to send transactions</div>
                    </div>
                  </div>

                  {/* Recipient Address */}
                  <div className="space-y-2">
                    <Label htmlFor="send-address" className="text-gray-300 text-sm">
                      Recipient Address
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="send-address"
                          placeholder="G..."
                          value={sendAddress}
                          onChange={(e) => setSendAddress(e.target.value)}
                          className={`bg-[#0A0B1E] text-white border-[#2D2E42] ${
                            addressValidation?.isValid === false
                              ? "border-red-500 focus:border-red-400"
                              : addressValidation?.isValid === true
                              ? "border-green-500 focus:border-green-400"
                              : "focus:border-[#7C3AED]"
                          }`}
                        />
                        {sendAddress && (
                          <button
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            onClick={() => setSendAddress("")}
                            aria-label="Clear address"
                          >
                            {"\u00D7"}
                          </button>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePasteAddress}
                        className="bg-[#0A0B1E] border-[#2D2E42] hover:bg-[#1F2037]"
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                    {addressValidation && !addressValidation.isValid && (
                      <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {addressValidation.error}
                      </div>
                    )}
                    {addressValidation?.isValid && (
                      <div className="flex items-center gap-1.5 text-green-400 text-xs mt-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Valid Stellar address
                      </div>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="send-amount" className="text-gray-300 text-sm">
                        Amount (XLM)
                      </Label>
                      <span className="text-sm text-gray-400">
                        Available: {wallet?.balances.find(b => !b.assetCode || b.assetCode === 'XLM')?.balance || '0'} XLM
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        id="send-amount"
                        type="number"
                        placeholder="0.00"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        className="bg-[#0A0B1E] border-[#2D2E42] focus:border-[#7C3AED] text-white pr-16"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        XLM
                      </div>
                    </div>
                  </div>

                  {/* Network Info */}
                  <div className="space-y-3 text-sm bg-[#0A0B1E]/50 rounded-lg p-4">
                    <div className="flex justify-between items-center text-gray-400">
                      <div className="flex items-center gap-1">
                        <Info className="h-4 w-4" />
                        <span>Network Fee</span>
                      </div>
                      <span>~0.00001 XLM</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                      <div className="flex items-center gap-1">
                        <Info className="h-4 w-4" />
                        <span>Processing Time</span>
                      </div>
                      <span>~5 seconds</span>
                    </div>
                  </div>

                  {/* Send Button */}
                  <Button
                    onClick={handleSendMoney}
                    disabled={sendLoading || !sendAddress || !sendAmount || !addressValidation?.isValid}
                    className="w-full bg-[#7C3AED] hover:bg-[#6D31D9] text-white disabled:bg-[#1F2037] disabled:text-gray-400"
                  >
                    {sendLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send XLM
                      </>
                    )}
                  </Button>

                  {/* Safety tip */}
                  <div className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-400/10 rounded-md p-3">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <p>
                      Always double-check the recipient address before sending.
                      Transactions on the Stellar network are irreversible.
                    </p>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* SDK Information */}
      <Card className="p-6 bg-[#1A1B2E]/80 border-[#2D2E42] backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4 text-white">SDK Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <Label className="font-medium text-gray-300">Platform ID</Label>
            <p className="text-gray-400">{DEMO_CONFIG.platformId}</p>
          </div>
          <div>
            <Label className="font-medium text-gray-300">Default Network</Label>
            <p className="text-gray-400">{DEMO_CONFIG.defaultNetwork}</p>
          </div>
          <div>
            <Label className="font-medium text-gray-300">Debug Mode</Label>
            <p className="text-gray-400">{DEMO_CONFIG.debug ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
