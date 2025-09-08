"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coins, Plus, ArrowRightLeft, Send } from "lucide-react"
import { formatSTX, microSTXToSTX } from "@/lib/stacks"
import { DepositDialog } from "@/components/deposit-dialog"
import { MoveFundsDialog } from "@/components/move-funds-dialog"
import { SpendDialog } from "@/components/spend-dialog"
import { usePockets } from "@/hooks/use-pockets"

interface PocketCardProps {
  category: string
  balance: number // in microSTX
  onDeposit: (category: string) => void
  onMove: (category: string) => void
  onSpend: (category: string) => void
}

export function PocketCard({ category, balance, onDeposit, onMove, onSpend }: PocketCardProps) {
  const { pockets, updatePocketBalance } = usePockets()
  const stxBalance = microSTXToSTX(balance)

  // Different chibi characters for different pocket types
  const getChibiCharacter = (category: string) => {
    const lowerCategory = category.toLowerCase()
    if (lowerCategory.includes("saving")) return "🐱"
    if (lowerCategory.includes("emergency")) return "🐶"
    if (lowerCategory.includes("fun") || lowerCategory.includes("entertainment")) return "🐰"
    if (lowerCategory.includes("food")) return "🐼"
    if (lowerCategory.includes("travel")) return "🐸"
    return "🐹" // default hamster
  }

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
    <Card className="w-full max-w-sm bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:scale-105">
      <CardHeader className="text-center pb-3">
        <div className="text-4xl mb-2">{getChibiCharacter(category)}</div>
        <CardTitle className="font-manrope text-lg text-balance capitalize">{category}</CardTitle>
        <Badge variant="secondary" className="mx-auto">
          {formatSTX(stxBalance)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Coins className="h-4 w-4" />
          <span>Pocket Balance</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <DepositDialog
            category={category}
            onDeposit={handleDeposit}
            trigger={
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-3 w-3" />
              </Button>
            }
          />
          <MoveFundsDialog
            fromCategory={category}
            fromBalance={balance}
            pockets={pockets}
            onMove={handleMove}
            trigger={
              <Button size="sm" variant="outline" className="hover:bg-accent/10 bg-transparent">
                <ArrowRightLeft className="h-3 w-3" />
              </Button>
            }
          />
          <SpendDialog
            category={category}
            balance={balance}
            onSpend={handleSpend}
            trigger={
              <Button
                size="sm"
                variant="outline"
                className="hover:bg-accent/10 bg-transparent"
                disabled={balance === 0}
              >
                <Send className="h-3 w-3" />
              </Button>
            }
          />
        </div>

        <div className="text-xs text-center text-muted-foreground space-y-1">
          <div>Add • Move • Send</div>
        </div>
      </CardContent>
    </Card>
  )
}
