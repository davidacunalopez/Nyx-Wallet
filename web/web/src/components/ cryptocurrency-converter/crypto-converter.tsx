"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight, Repeat, FileText, MoveRight, X, AlertCircle, CheckCircle, Home } from "lucide-react"
import { useCryptoPrices } from "@/hooks/use-crypto-prices"
import { useStellarConversion } from "@/hooks/use-stellar-conversion"
import { useSecureKey } from "@/contexts/secure-key-context"
import ExchangeRateChart from "@/components/ cryptocurrency-converter/exchange-rate-chart"
import MarketOverview from "@/components/ cryptocurrency-converter/market-overview"
import ConversionHistory from "@/components/ cryptocurrency-converter/conversion-history"
import ConversionTips from "@/components/ cryptocurrency-converter/conversion-tips"
import NetworkFeeCalculator from "@/components/ cryptocurrency-converter/network-fee-calculator"

// Wrapper component for the crypto converter
function CryptoConverterWithProvider() {
  return <CryptoConverterContent />;
}

// Main component content
function CryptoConverterContent() {
  const router = useRouter()
  const { prices: cryptoData, loading: pricesLoading, error: pricesError, refreshPrices } = useCryptoPrices()
  const [fromCrypto, setFromCrypto] = useState("xlm")
  const [toCrypto, setToCrypto] = useState("usdc")
  const [amount, setAmount] = useState("")
  const [activeTab, setActiveTab] = useState("crypto-to-crypto")
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [convertedAmount, setConvertedAmount] = useState("0.00")
  const [conversionRate, setConversionRate] = useState("0.00")
  
  // Conversion modal state
  const [showConversionModal, setShowConversionModal] = useState(false)
  const [conversionLoading, setConversionLoading] = useState(false)
  const [conversionError, setConversionError] = useState("")
  const [conversionSuccess, setConversionSuccess] = useState(false)

  // Use the secure key context
  const { hasPrivateKey, withPrivateKey } = useSecureKey()

  // Use the Stellar conversion hook
  const {
    loading: stellarLoading,
    error: stellarError,
    estimate,
    result,
    getEstimate,
    executeConversion,
    clearError,
    clearResult
  } = useStellarConversion()

  const getTokenById = (id: string) => {
    const found = cryptoData.find((crypto) => crypto.id === id);
    if (found) return found;
    
    // Fallback with default values if cryptoData is empty or not found
    const fallbackData = {
      id: id,
      name: id === 'xlm' ? 'Stellar Lumens' : id === 'usdc' ? 'USD Coin' : id === 'btc' ? 'Bitcoin' : 'Ethereum',
      symbol: id.toUpperCase(),
      price: id === 'xlm' ? 0.39 : id === 'usdc' ? 1.0 : id === 'btc' ? 68245.12 : 3245.67,
      change24h: 0,
      color: 'bg-blue-500',
      gradient: id === 'xlm' ? 'from-blue-500 to-indigo-600' : id === 'usdc' ? 'from-blue-500 to-cyan-400' : id === 'btc' ? 'from-purple-600 to-yellow-500' : 'from-blue-600 to-blue-400',
      letter: id.charAt(0).toUpperCase()
    };
    
    return cryptoData.length > 0 ? cryptoData[0] : fallbackData;
  }

  // Function to clear conversion fields
  const clearConversionFields = () => {
    setAmount("")
    setConvertedAmount("0.00")
    setConversionRate("0.00")
  }

  const goToDashboard = () => {
    router.push('/dashboard')
  }

  // Calculate conversion when inputs change
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const fromToken = getTokenById(fromCrypto)
      const toToken = getTokenById(toCrypto)
      
      if (fromToken.price > 0 && toToken.price > 0) {
        const amountValue = parseFloat(amount)
        const fromValueUSD = amountValue * fromToken.price
        const convertedValue = fromValueUSD / toToken.price
        const rate = fromToken.price / toToken.price
        
        // Use market rate for display only, but we'll get the real Stellar rate when converting
        setConvertedAmount(convertedValue.toFixed(6))
        setConversionRate(rate.toFixed(8))
      } else {
        setConvertedAmount("0.00")
        setConversionRate("0.00")
      }
    } else {
      setConvertedAmount("0.00")
      setConversionRate("0.00")
    }
  }, [fromCrypto, toCrypto, amount, cryptoData])

  // Get Stellar estimate when inputs change and update converted amount with real rate
  useEffect(() => {
    if (amount && parseFloat(amount) > 0 && fromCrypto && toCrypto) {
      // Get Stellar estimate for real rate
      getEstimate(fromCrypto, toCrypto, amount)
    }
  }, [amount, fromCrypto, toCrypto, getEstimate])

  // Update converted amount with Stellar estimate when available
  useEffect(() => {
    if (estimate && amount && parseFloat(amount) > 0) {
      // Use the real Stellar rate for the actual conversion
      setConvertedAmount(estimate.destinationAmount)
      setConversionRate(estimate.rate)
    }
  }, [estimate, amount])

  const handleFromCryptoChange = (id: string) => {
    setFromCrypto(id)
    setShowFromDropdown(false)
  }

  const handleToCryptoChange = (id: string) => {
    setToCrypto(id)
    setShowToDropdown(false)
  }
  
  const handleConvertClick = () => {
    if (amount && parseFloat(amount) > 0) {
      if (!hasPrivateKey()) {
        setConversionError("Please connect your wallet first")
        return
      }
      setShowConversionModal(true)
      setConversionError("")
      setConversionSuccess(false)
    clearError()
    clearResult()
    }
  }
  
  const handleExecuteConversion = async () => {
    if (!hasPrivateKey()) {
      setConversionError("Wallet not connected. Please connect your wallet first.")
      return
    }
    
    setConversionLoading(true)
    setConversionError("")

    try {
      // Use the secure key context to execute conversion
      const success = withPrivateKey(async (privateKey) => {
      await executeConversion(
        privateKey,
        fromCrypto,
        toCrypto,
          amount
        )
      })

      if (success) {
        setConversionSuccess(true)
        clearConversionFields() // Clear fields after successful conversion
        setTimeout(() => {
          setShowConversionModal(false)
          setConversionSuccess(false)
        }, 5000) // Extended timeout to show success message longer
      } else {
        setConversionError("Failed to access wallet. Please try reconnecting.")
      }
    } catch (error) {
      setConversionError(error instanceof Error ? error.message : 'Conversion failed')
    } finally {
      setConversionLoading(false)
    }
  }
  
  const swapAssets = () => {
    const tempFrom = fromCrypto
    setFromCrypto(toCrypto)
    setToCrypto(tempFrom)
  }

  const closeModal = () => {
    setShowConversionModal(false)
    setConversionError("")
    setConversionSuccess(false)
    clearError()
    clearResult()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const dropdowns = document.querySelectorAll(".crypto-dropdown")
      let clickedOutside = true

      dropdowns.forEach((dropdown) => {
        if (dropdown.contains(target)) {
          clickedOutside = false
        }
      })

      if (clickedOutside) {
        setShowFromDropdown(false)
        setShowToDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const fromCryptoData = getTokenById(fromCrypto)
  const toCryptoData = getTokenById(toCrypto)

  // Show loading state while prices are being fetched
  if (pricesLoading && cryptoData.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading crypto prices...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 pb-0">
              <h2 className="text-2xl font-normal text-white mb-6">Crypto Converter</h2>
          </div>

          <div className="px-6">
            <div className="flex w-full bg-gray-800/30 rounded-lg overflow-hidden">
              <button
                className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${
                  activeTab === "crypto-to-crypto" ? "bg-[#5b21b6]" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("crypto-to-crypto")}
              >
                <Repeat className="h-4 w-4" /> Crypto to Crypto
              </button>
              <button
                className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${
                  activeTab === "crypto-to-fiat" ? "bg-[#5b21b6]" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("crypto-to-fiat")}
              >
                <FileText className="h-4 w-4" /> Crypto to Fiat
              </button>
              <button
                className={`flex-1 py-2 px-4 flex items-center justify-center gap-2 ${
                  activeTab === "fiat-to-crypto" ? "bg-[#5b21b6]" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("fiat-to-crypto")}
              >
                <MoveRight className="h-4 w-4" /> Fiat to Crypto
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-16 gap-6">
                <div>
                  <p className="mb-2 text-white">From</p>
                  <div className="relative crypto-dropdown">
                    <button
                      className="w-full flex items-center justify-between bg-[#131b31] border border-[#1e2747] rounded-lg p-2.5 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowFromDropdown(!showFromDropdown)
                        setShowToDropdown(false)
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`bg-gradient-to-r ${fromCryptoData.gradient} rounded-full w-6 h-6 flex items-center justify-center text-xs text-white shadow-[0_0_10px_rgba(80,70,230,0.5)]`}
                        >
                          {fromCryptoData.letter}
                        </div>
                        <span>
                          {fromCryptoData.name} ({fromCryptoData.symbol})
                        </span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    {showFromDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-[#131b31] border border-[#1e2747] rounded-lg shadow-lg">
                        {cryptoData.map((crypto) => (
<div
                            key={crypto.id}
                            className="flex items-center gap-2 p-2.5 hover:bg-[#1a2544] cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFromCryptoChange(crypto.id)
                            }}
                          >
                            <div
                              className={`bg-gradient-to-r ${crypto.gradient} rounded-full w-6 h-6 flex items-center justify-center text-xs text-white shadow-[0_0_10px_rgba(80,70,230,0.3)]`}
                            >
                              {crypto.letter}
                            </div>
                            <span className="text-white">
                              {crypto.name} ({crypto.symbol})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-2 text-sm flex justify-between">
                    <span className="text-gray-400">
                      1 {fromCryptoData.symbol} = ${fromCryptoData.price.toFixed(2)}
                    </span>
                    <span className={fromCryptoData.change24h >= 0 ? "text-green-500" : "text-red-500"}>
                      {fromCryptoData.change24h >= 0 ? "+" : ""}
                        {fromCryptoData.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-white">To</p>
                  <div className="relative crypto-dropdown">
                    <button
                      className="w-full flex items-center justify-between bg-[#131b31] border border-[#1e2747] rounded-lg p-2.5 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowToDropdown(!showToDropdown)
                        setShowFromDropdown(false)
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`bg-gradient-to-r ${toCryptoData.gradient} rounded-full w-6 h-6 flex items-center justify-center text-xs text-white shadow-[0_0_10px_rgba(80,70,230,0.5)]`}
                        >
                          {toCryptoData.letter}
                        </div>
                        <span>
                          {toCryptoData.name} ({toCryptoData.symbol})
                        </span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    {showToDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-[#131b31] border border-[#1e2747] rounded-lg shadow-lg">
                        {cryptoData.map((crypto) => (
<div
                            key={crypto.id}
                            className="flex items-center gap-2 p-2.5 hover:bg-[#1a2544] cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToCryptoChange(crypto.id)
                            }}
                          >
                            <div
                              className={`bg-gradient-to-r ${crypto.gradient} rounded-full w-6 h-6 flex items-center justify-center text-xs text-white shadow-[0_0_10px_rgba(80,70,230,0.3)]`}
                            >
                              {crypto.letter}
                            </div>
                            <span className="text-white">
                              {crypto.name} ({crypto.symbol})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-2 text-sm flex justify-between">
                    <span className="text-gray-400">
                      1 {toCryptoData.symbol} = ${toCryptoData.price.toFixed(2)}
                    </span>
                    <span className={toCryptoData.change24h >= 0 ? "text-green-500" : "text-red-500"}>
                      {toCryptoData.change24h >= 0 ? "+" : ""}
                        {toCryptoData.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-24 gap-8 relative">
                <div>
                  <p className="mb-2 text-white">Amount</p>
                  <input
                    type="number"
                    value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount to convert"
                    className="w-full bg-gray-800/30 border border-gray-700 rounded-lg p-3 text-white h-12 text-base"
                  />
                </div>

                <div>
                    <p className="mb-2 text-white">Converted Amount</p>
                  <div className="relative">
                    <input
                      type="text"
                        value={stellarLoading ? "Calculating..." : convertedAmount}
                      readOnly
                      className="w-full bg-gray-800/30 border border-gray-700 rounded-lg p-3 text-white h-12 text-base"
                    />
                      {(pricesLoading || stellarLoading) && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={swapAssets}
                  className="absolute left-1/2 top-[55%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 bg-gray-800/50 hover:bg-gray-700/50 rounded-full z-10 border border-gray-700 shadow-lg mt-1 transition-colors"
                >
                  <div className="text-purple-500">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </button>
              </div>

                {/* Conversion Rate Display */}
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Conversion Rate</p>
                    <p className="font-medium text-white text-lg">
                      1 {fromCryptoData.symbol} = {conversionRate} {toCryptoData.symbol}
                    </p>
                    {amount && parseFloat(amount) > 0 && (
                      <p className="text-gray-500 text-sm mt-1">
                        {amount} {fromCryptoData.symbol} = ${(parseFloat(amount) * fromCryptoData.price).toFixed(2)} USD
                      </p>
                    )}
                    {estimate && Math.abs(parseFloat(estimate.rate) - parseFloat(conversionRate)) > 0.001 && (
                      <div className="mt-2 p-2 bg-amber-900/20 border border-amber-500/30 rounded text-amber-300 text-xs">
                        ⚠️ Stellar network rate: 1 {fromCryptoData.symbol} = {estimate.rate} {toCryptoData.symbol}
                      </div>
                    )}
                  </div>
                  </div>

                {/* Convert Button */}
                <div className="flex justify-center">
                  <button 
                    onClick={handleConvertClick}
                    disabled={!amount || parseFloat(amount) <= 0 || !hasPrivateKey()}
                    className="bg-[#7e22ce] hover:bg-[#6b21a8] disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg px-8 py-3 text-white font-medium flex items-center gap-2 transition-colors"
                  >
                    {!hasPrivateKey() ? 'Connect Wallet' : 'Convert'}
                  </button>
                </div>
                
                {/* Rate Information */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-500 mt-0.5">ℹ️</div>
                <div>
                      <p className="text-blue-400 text-sm mb-1">About Conversion Rates</p>
                      <p className="text-blue-300 text-xs">
                        The displayed rate is based on market prices. The actual Stellar network rate may differ slightly due to liquidity and network conditions. The final conversion amount will be based on the Stellar network rate.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Wallet Status */}
                {!hasPrivateKey() && (
                  <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                      <p className="text-amber-400 text-sm mb-1">Wallet Not Connected</p>
                      <p className="text-amber-300 text-xs">
                        Please connect your wallet to execute conversions on the blockchain.
                      </p>
                  </div>
                </div>
              )}
              
                {/* Error Display */}
                {pricesError && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                    <div className="text-red-500 mt-0.5">⚠️</div>
                  <div>
                      <p className="text-red-400 text-sm">{pricesError}</p>
                      <button
                        onClick={refreshPrices}
                        className="text-red-300 text-xs underline mt-1 hover:text-red-200"
                      >
                        Try again
                      </button>
                </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between mb-4">
              <h2 className="text-2xl font-normal text-white">Exchange Rate History</h2>
              <div className="flex gap-2">
                <button className="h-8 border border-[#1e2747] bg-[#131b31] px-3 text-xs rounded-lg text-gray-400">
                  1D
                </button>
                <button className="h-8 border border-[#1e2747] bg-[#5b21b6]/50 px-3 text-purple-300 text-xs rounded-lg">
                  1W
                </button>
                <button className="h-8 border border-[#1e2747] bg-[#131b31] px-3 text-xs rounded-lg text-gray-400">
                  1M
                </button>
                <button className="h-8 border border-[#1e2747] bg-[#131b31] px-3 text-xs rounded-lg text-gray-400">
                  1Y
                </button>
              </div>
            </div>
            <ExchangeRateChart fromSymbol={fromCryptoData.symbol} toSymbol={toCryptoData.symbol} />
          </div>
        </div>

        <NetworkFeeCalculator />
      </div>

      <div className="space-y-6">
                      <MarketOverview />
        <ConversionHistory />
        <ConversionTips />
      </div>
    </div>

      {/* Conversion Modal */}
      {showConversionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium text-white">Execute Conversion</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Conversion Summary */}
              <div className="bg-gray-800/30 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Converting</p>
                  <p className="font-medium text-white text-lg">
                    {amount} {fromCryptoData.symbol} → {estimate ? estimate.destinationAmount : convertedAmount} {toCryptoData.symbol}
                  </p>
                  {estimate && (
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <span>Stellar Network Rate:</span>
                        <span className="text-white">1 {fromCryptoData.symbol} = {estimate.rate} {toCryptoData.symbol}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Market Rate:</span>
                        <span className="text-white">1 {fromCryptoData.symbol} = {conversionRate} {toCryptoData.symbol}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Network Fee:</span>
                        <span className="text-white">{estimate.fee} XLM</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Estimated time:</span>
                        <span className="text-white">~{estimate.estimatedTime}s</span>
                      </div>
                      {Math.abs(parseFloat(estimate.rate) - parseFloat(conversionRate)) > 0.001 && (
                        <div className="mt-2 p-2 bg-amber-900/20 border border-amber-500/30 rounded text-amber-300">
                          ⚠️ Rate difference detected. Stellar network rate may differ from market rate.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Wallet Status */}
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-400 text-sm mb-1">Wallet Connected</p>
                  <p className="text-green-300 text-xs">
                    Your wallet is ready to authorize this transaction.
                  </p>
                </div>
              </div>

              {/* Error Display */}
              {(conversionError || stellarError) && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{conversionError || stellarError}</p>
                </div>
              )}

              {/* Success Display */}
              {conversionSuccess && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-green-400 text-sm font-medium mb-1">¡Conversión exitosa!</p>
                      <p className="text-green-300 text-xs mb-2">
                        Los fondos convertidos se reflejarán en tu wallet en unos momentos.
                      </p>
                      {result?.hash && (
                        <p className="text-xs text-gray-400">
                          Transacción: {result.hash.substring(0, 20)}...
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-blue-400">💰</div>
                      <p className="text-blue-400 text-xs font-medium">Fondos en tu Wallet</p>
                    </div>
                    <p className="text-blue-300 text-xs">
                      Los {estimate ? estimate.destinationAmount : convertedAmount} {toCryptoData.symbol} convertidos aparecerán en tu dashboard una vez confirmada la transacción en la red Stellar.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {conversionSuccess ? (
                  <>
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg py-3 text-white transition-colors"
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={goToDashboard}
                      className="flex-1 bg-[#7e22ce] hover:bg-[#6b21a8] rounded-lg py-3 text-white flex items-center justify-center gap-2 transition-colors"
                    >
                      <Home className="h-4 w-4" />
                      Ir al Dashboard
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg py-3 text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleExecuteConversion}
                      disabled={conversionLoading}
                      className="flex-1 bg-[#7e22ce] hover:bg-[#6b21a8] disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg py-3 text-white flex items-center justify-center gap-2 transition-colors"
                    >
                      {conversionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                      {conversionLoading ? 'Converting...' : 'Execute Conversion'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CryptoConverterWithProvider
