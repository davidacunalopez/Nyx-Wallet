import { Header } from '@/components/Header'
import { WalletCard } from '@/components/WalletCard'
import { TransactionHistory } from '@/components/TransactionHistory'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Header />
      
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WalletCard />
        </div>
        <div>
          <TransactionHistory />
        </div>
      </div>
    </main>
  )
}
