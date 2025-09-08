"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PocketCard } from "@/components/pocket-card"
import { CreatePocketDialog } from "@/components/create-pocket-dialog"
import { usePockets } from "@/hooks/use-pockets"
import { formatSTX, microSTXToSTX } from "@/lib/stacks"
import { Coins, TrendingUp, Wallet } from "lucide-react"

export function BalanceDashboard() {
  const { pockets, createPocket, updatePocketBalance } = usePockets()

  const totalBalance = pockets.reduce((sum, pocket) => sum + pocket.balance, 0)
  const totalSTX = microSTXToSTX(totalBalance)

  const handleDeposit = (category: string, amountMicroSTX: number) => {
    const currentPocket = pockets.find((p) => p.category === category)
    if (currentPocket) {
      updatePocketBalance(category, currentPocket.balance + amountMicroSTX)
    }
  }

  const handleMove = (fromCategory: string, toCategory: string, amountMicroSTX: number) => {
    const fromPocket = pockets.find((p) => p.category === fromCategory)
    const toPocket = pockets.find((p) => p.category === toCategory)

    if (fromPocket && toPocket) {
      updatePocketBalance(fromCategory, fromPocket.balance - amountMicroSTX)
      updatePocketBalance(toCategory, toPocket.balance + amountMicroSTX)
    }
  }

  const handleSpend = (category: string, amountMicroSTX: number) => {
    const currentPocket = pockets.find((p) => p.category === category)
    if (currentPocket) {
      updatePocketBalance(category, currentPocket.balance - amountMicroSTX)
    }
  }

  return (
    <div className="space-y-6">
      {/* Total Balance Overview */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-2 border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wallet className="h-6 w-6 text-primary" />
            <CardTitle className="font-manrope text-2xl">Total Balance</CardTitle>
          </div>
          <div className="text-4xl font-bold font-mono text-primary mb-2">{formatSTX(totalSTX)}</div>
          <Badge variant="secondary" className="mx-auto">
            Across {pockets.length} {pockets.length === 1 ? "pocket" : "pockets"}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <Coins className="h-4 w-4" />
                <span>Active Pockets</span>
              </div>
              <div className="text-2xl font-bold">{pockets.length}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Largest Pocket</span>
              </div>
              <div className="text-2xl font-bold">
                {pockets.length > 0 ? formatSTX(microSTXToSTX(Math.max(...pockets.map((p) => p.balance)))) : "0 STX"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create New Pocket */}
      <div className="flex justify-center">
        <CreatePocketDialog onCreatePocket={createPocket} />
      </div>

      {/* Pockets Grid */}
      {pockets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pockets.map((pocket) => (
            <PocketCard
              key={pocket.category}
              category={pocket.category}
              balance={pocket.balance}
              onDeposit={(category) => {
                // This will be handled by the DepositDialog
              }}
              onMove={(category) => {
                // This will be handled by the MoveFundsDialog
              }}
              onSpend={(category) => {
                // This will be handled by the SpendDialog
              }}
            />
          ))}
        </div>
      ) : (
        <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="text-6xl">🎀</div>
            <div className="space-y-2">
              <h3 className="font-manrope text-xl font-semibold">No Pockets Yet</h3>
              <p className="text-muted-foreground text-balance max-w-md">
                Create your first kawaii pocket to start organizing your STX! Each pocket gets its own cute chibi
                character.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
