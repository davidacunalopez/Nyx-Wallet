'use client'

import { useState } from 'react'

interface Transaction {
  id: string
  type: 'send' | 'receive'
  amount: string
  address: string
  timestamp: string
  status: 'pending' | 'completed' | 'failed'
}

export function TransactionHistory() {
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'receive',
      amount: '0.5',
      address: '0x1234...5678',
      timestamp: '2024-01-15 14:30',
      status: 'completed'
    },
    {
      id: '2',
      type: 'send',
      amount: '0.1',
      address: '0x9876...5432',
      timestamp: '2024-01-14 09:15',
      status: 'completed'
    }
  ])

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
      
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions yet</p>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.type === 'receive' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className={`text-sm font-medium ${
                    tx.type === 'receive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.type === 'receive' ? '↗' : '↘'}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {tx.type === 'receive' ? 'Received' : 'Sent'} {tx.amount} ETH
                  </div>
                  <div className="text-sm text-gray-500">{tx.address}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{tx.timestamp}</div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                  tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {tx.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
