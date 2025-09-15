"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SignInChoicePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen relative w-full bg-black text-white overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto p-6 bg-gray-900/50 border-gray-700">
          <h1 className="text-2xl font-bold mb-2">Sign In</h1>
          <p className="text-gray-400 mb-6">Selecciona un método de acceso</p>

          <div className="space-y-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/recover")}>Frase semilla</Button>
            <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => router.push("/invisible-wallet")}>Email</Button>
          </div>
        </Card>
      </div>
    </main>
  )
}


