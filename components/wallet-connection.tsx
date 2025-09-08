"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, LogOut, Heart } from "lucide-react"
import { connectWallet, disconnectWallet, userSession } from "@/lib/stacks"

interface WalletConnectionProps {
  
  onConnectionChange?: (isConnected: boolean) => void
}

export function WalletConnection({ onConnectionChange }: WalletConnectionProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkConnection = () => {
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData()
        setIsConnected(true)
        setUserAddress(userData.profile.stxAddress.mainnet)
        onConnectionChange?.(true)
      } else {
        setIsConnected(false)
        setUserAddress("")
        onConnectionChange?.(false)
      }
    }

    checkConnection()

    // Check connection status periodically
    const interval = setInterval(checkConnection, 1000)
    return () => clearInterval(interval)
  }, [onConnectionChange])

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      await connectWallet()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
    setIsConnected(false)
    setUserAddress("")
    onConnectionChange?.(false)
  }

  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="h-5 w-5 text-primary fill-primary" />
            <CardTitle className="font-manrope text-lg">Wallet Connected!</CardTitle>
            <Heart className="h-5 w-5 text-primary fill-primary" />
          </div>
          <CardDescription className="text-sm">Ready to manage your kawaii pockets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-mono">
              {formatAddress(userAddress)}
            </Badge>
          </div>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="w-full gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 bg-transparent"
          >
            <LogOut className="h-4 w-4" />
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-dashed border-primary/30">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Wallet className="h-6 w-6 text-primary" />
          <CardTitle className="font-manrope text-xl">Connect Your Wallet</CardTitle>
        </div>
        <CardDescription className="text-balance">
          Connect your Stacks wallet to start managing your cute STX pockets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 text-lg"
        >
          <Wallet className="h-5 w-5" />
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-4">Supports Leather and Xverse wallets</p>
      </CardContent>
    </Card>
  )
}
