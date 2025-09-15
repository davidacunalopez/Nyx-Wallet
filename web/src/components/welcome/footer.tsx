"use client"

import Image from "next/image"
import Link from "next/link"
import { Github, Twitter, Newspaper } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/nyx-wallet-logo.png"
                alt="Galaxy Smart Wallet"
                width={44}
                height={44}
                className="h-11 w-auto"
                priority
              />
              <span className="text-lg font-semibold tracking-wide">Galaxy Smart Wallet</span>
            </div>
            <p className="text-sm text-blue-100/70 leading-relaxed max-w-md">
              Operado por una entidad independiente, no afiliada a la Stellar Development Foundation.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <Link href="https://twitter.com" target="_blank" className="text-blue-100/70 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </Link>
              <Link href="https://medium.com" target="_blank" className="text-blue-100/70 hover:text-white transition-colors" aria-label="Medium">
                <Newspaper size={20} />
              </Link>
              <Link href="https://github.com" target="_blank" className="text-blue-100/70 hover:text-white transition-colors" aria-label="Github">
                <Github size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-white/90">Products</h4>
            <ul className="space-y-2 text-sm text-blue-100/80">
              <li><Link href="#" className="hover:text-white">Vault</Link></li>
              <li><Link href="#" className="hover:text-white">Signer Extension</Link></li>
              <li><Link href="#" className="hover:text-white">StellarTerm</Link></li>
              <li><Link href="#" className="hover:text-white">StellarX</Link></li>
              <li><Link href="#" className="hover:text-white">Merge Tool</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-white/90">Buy & Sell Crypto</h4>
            <ul className="space-y-2 text-sm text-blue-100/80">
              <li><Link href="#" className="hover:text-white">Buy Stellar Lumens</Link></li>
              <li><Link href="#" className="hover:text-white">Buy USDC (Stellar)</Link></li>
              <li><Link href="#" className="hover:text-white">Buy Bitcoin</Link></li>
              <li><Link href="#" className="hover:text-white">Buy Ethereum</Link></li>
              <li><Link href="#" className="hover:text-white">Sell Crypto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-white/90">Connect</h4>
            <ul className="space-y-2 text-sm text-blue-100/80">
              <li><Link href="/support" className="hover:text-white">Support</Link></li>
              <li><Link href="#" className="hover:text-white">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white">Business Partners</Link></li>
              <li><Link href="#" className="hover:text-white">Asset Listing</Link></li>
            </ul>
          </div>
          
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-blue-100/60">© {new Date().getFullYear()} Galaxy Wallet. Todos los derechos reservados.</p>
        <div className="flex items-center gap-4 text-xs text-blue-100/70">
          <Link href="#" className="hover:text-white">Terms of Service</Link>
          <span className="opacity-30">•</span>
          <Link href="#" className="hover:text-white">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  )
}