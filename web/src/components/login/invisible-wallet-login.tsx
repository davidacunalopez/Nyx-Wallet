"use client"

import { useState } from "react"
import { X, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface InvisibleWalletLoginProps {
  onLoginSuccess: (email: string, password: string) => void
  onClose?: () => void
}

export function InvisibleWalletLogin({ onLoginSuccess, onClose }: InvisibleWalletLoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields")
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Call the success callback with email and password
      onLoginSuccess(email, password)
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full max-w-md bg-gray-900/50 border border-gray-800 backdrop-blur-md p-8 shadow-lg rounded-xl text-white">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-800/90 border border-slate-700 rounded-md p-1 text-slate-300 hover:bg-slate-700 hover:text-white transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <div className="text-center mb-6">
        <Image
          src="/images/galaxy-smart-wallet-logo.png"
          alt="Galaxy Logo"
          className="mx-auto mb-4"
          width={32}
          height={32}
        />
        <h1 className="text-2xl font-bold">Invisible Wallet</h1>
        <p className="text-slate-400 text-sm">Enter your credentials to access your invisible wallet</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-md text-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-slate-300">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-slate-300">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500"
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !email.trim() || !password.trim()}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing In...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Sign In
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </Button>
      </form>

      <div className="text-center space-y-2 text-sm mt-6">
        <button
          onClick={() => {
            // Handle forgot password
            setError("Forgot password functionality not implemented yet")
          }}
          className="text-purple-400 hover:text-white transition-colors"
        >
          Forgot your password?
        </button>
      </div>

      <div className="text-center space-y-1 text-xs text-slate-500 mt-6">
        <div className="flex items-center justify-center gap-1">
          <Lock className="h-3 w-3" />
          Your invisible wallet is encrypted and secure
        </div>
        <div>Galaxy Wallet protects your privacy</div>
      </div>
    </div>
  )
}
