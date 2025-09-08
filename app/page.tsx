"use client"

import { useState } from "react"
import { WalletConnection } from "@/components/wallet-connection"
import { BalanceDashboard } from "@/components/balance-dashboard"

export default function HomePage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <header className="text-center py-8">
          <h1 className="font-manrope text-4xl md:text-5xl font-bold text-balance mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Pockets
          </h1>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Manage your STX in adorable pockets with cute chibi characters. Each pocket is a mini-wallet that holds your
            coins safely!
          </p>
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center gap-8">
          <WalletConnection onConnectionChange={setIsWalletConnected} />

          {!isWalletConnected && (
            <div className="text-center space-y-4 max-w-md">
              <div className="text-6xl">🎀</div>
              <p className="text-muted-foreground text-balance">
                Connect your wallet to start creating cute pockets for your STX!
              </p>
            </div>
          )}

          {isWalletConnected && (
            <div className="w-full max-w-6xl">
              <BalanceDashboard />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
