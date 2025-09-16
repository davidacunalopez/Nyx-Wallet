'use client'

import { useState } from 'react'

export function Header() {
  const [isConnected, setIsConnected] = useState(false)

  const handleConnect = () => {
    setIsConnected(!isConnected)
  }

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Nyx Wallet</h1>
      </div>
      
      <button
        onClick={handleConnect}
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
          isConnected
            ? 'bg-green-100 text-green-800 hover:bg-green-200'
            : 'btn-primary'
        }`}
      >
        {isConnected ? 'Connected' : 'Connect Wallet'}
      </button>
    </header>
  )
}
