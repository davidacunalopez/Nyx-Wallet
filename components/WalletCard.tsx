'use client'

import { useState } from 'react'

export function WalletCard() {
  const [balance] = useState('0.00')
  const [address] = useState('0x0000...0000')

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Wallet Overview</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Balance
          </label>
          <div className="text-3xl font-bold text-gray-900">
            {balance} ETH
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <div className="font-mono text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {address}
          </div>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <button className="btn-primary flex-1">
            Send
          </button>
          <button className="btn-secondary flex-1">
            Receive
          </button>
        </div>
      </div>
    </div>
  )
}
