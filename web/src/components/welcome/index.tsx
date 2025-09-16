"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useScroll } from "framer-motion"
import { openDB } from "idb"
import { StarBackground } from "@/components/effects/star-background"
import { ShootingStarsEffect } from "@/components/effects/shooting-stars-effect"
import { Header } from "./header"
import { HeroSection } from "./hero-section"
import { FeatureSection } from "./feature-section"
import { CTASection } from "./cta-section"
import { Footer } from "./footer"
import { CreateWalletModal } from "@/components/wallet-creation/create-wallet-modal"
import { GalaxyLogin } from "@/components/login/galaxy-login"
import { InvisibleWalletLogin } from "@/components/login/invisible-wallet-login"
import { useSecureKey } from "@/contexts/secure-key-context"
import { useWalletStore } from "@/store/wallet-store"
import { Keypair } from "@stellar/stellar-sdk"

// Database configuration constants
const DB_NAME = "wallet-db"
const STORE_NAME = "encrypted-wallet"

export function WelcomeScreen() {
  const containerRef = useRef(null)
  const router = useRouter()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isInvisibleLoginModalOpen, setIsInvisibleLoginModalOpen] = useState(false)
  const [isCreating] = useState(false)

  const { setPrivateKey } = useSecureKey()
  const setPublicKey = useWalletStore((state) => state.setPublicKey)

  const handleWalletCreated = () => {
    setIsCreateModalOpen(false)
    setIsLoginModalOpen(true)
  }

  const handleLoginSuccess = (decryptedPrivateKey: string) => {
    const keypair = Keypair.fromSecret(decryptedPrivateKey)
    const publicKey = keypair.publicKey()

    // Set the private key in the secure context
    setPrivateKey(decryptedPrivateKey)
    
    // Set the public key in the wallet store
    setPublicKey(publicKey)
    
    setIsLoginModalOpen(false)
    router.push("/dashboard")
  }

  const handleInvisibleWalletLogin = (email: string, password: string) => {
    console.log("Invisible wallet login:", { email, password })
    // Here you would typically handle the invisible wallet login logic
    // For now, we'll just close the modal and redirect to dashboard
    setIsInvisibleLoginModalOpen(false)
    router.push("/dashboard")
  }

  const handleInvisibleWalletClick = () => {
    setIsInvisibleLoginModalOpen(true)
  }

  const handleGetStarted = async () => {
    try {
      console.log("🔍 WelcomeScreen: Checking for existing wallets...")
      const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, {
              keyPath: "id",
              autoIncrement: true
            })
            store.createIndex("wallet", "wallet", { unique: false })
          }
        },
      })
      
      const wallets = await db.getAll(STORE_NAME)
      console.log(`📊 WelcomeScreen: Found ${wallets.length} wallets`)
      
      if (wallets && wallets.length > 0) {
        console.log("✅ WelcomeScreen: Opening login modal")
        setIsLoginModalOpen(true)
      } else {
        console.log("📝 WelcomeScreen: Opening create wallet modal")
        setIsCreateModalOpen(true)
      }
      
      await db.close()
    } catch (error) {
      console.error("❌ WelcomeScreen: Error accessing wallet:", error)
      // If there's an error, assume no wallet exists and show creation screen
      setIsCreateModalOpen(true)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#0A0A1A] text-white overflow-hidden"
    >
      <StarBackground />
      <ShootingStarsEffect />

      <CreateWalletModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onWalletCreated={handleWalletCreated}
      />

      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <GalaxyLogin
            onLoginSuccess={handleLoginSuccess}
            onRecoveryClick={() => {
              setIsLoginModalOpen(false)
              setIsCreateModalOpen(true)
            }}
            onClose={() => setIsLoginModalOpen(false)}
          />
        </div>
      )}

      {isInvisibleLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <InvisibleWalletLogin
            onLoginSuccess={handleInvisibleWalletLogin}
            onClose={() => setIsInvisibleLoginModalOpen(false)}
          />
        </div>
      )}

      <Header 
        onGetStarted={handleGetStarted} 
        onInvisibleWallet={handleInvisibleWalletClick}
        isLoading={isCreating} 
      />

      <HeroSection
        scrollYProgress={useScroll({ target: containerRef }).scrollYProgress}
      />
      <FeatureSection />
      <CTASection onGetStarted={handleGetStarted} isLoading={isCreating} />
      <Footer />
    </div>
  )
}