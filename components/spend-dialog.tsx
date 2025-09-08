"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, AlertCircle } from "lucide-react"
import { spendFromCategory, microSTXToSTX, formatSTX } from "@/lib/stacks"

interface SpendDialogProps {
  category: string
  balance: number
  onSpend: (category: string, amount: number) => void
  trigger?: React.ReactNode
}

export function SpendDialog({ category, balance, onSpend, trigger }: SpendDialogProps) {
  const [open, setOpen] = useState(false)
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const maxAmount = microSTXToSTX(balance)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!recipient.trim()) {
      setError("Please enter a recipient address")
      return
    }

    const numAmount = Number.parseFloat(amount)
    if (!numAmount || numAmount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (numAmount > maxAmount) {
      setError(`Insufficient balance. Maximum: ${formatSTX(maxAmount)}`)
      return
    }

    setIsLoading(true)
    try {
      await spendFromCategory(category, recipient.trim(), numAmount)
      onSpend(category, numAmount * 1000000) // Convert to microSTX
      setAmount("")
      setRecipient("")
      setOpen(false)
    } catch (error) {
      console.error("Spend failed:", error)
      setError("Transaction failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getChibiCharacter = (category: string) => {
    const lowerCategory = category.toLowerCase()
    if (lowerCategory.includes("saving")) return "🐱"
    if (lowerCategory.includes("emergency")) return "🐶"
    if (lowerCategory.includes("fun") || lowerCategory.includes("entertainment")) return "🐰"
    if (lowerCategory.includes("food")) return "🐼"
    if (lowerCategory.includes("travel")) return "🐸"
    return "🐹"
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="hover:bg-accent/10 bg-transparent" disabled={balance === 0}>
            <Send className="h-3 w-3" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="text-2xl">{getChibiCharacter(category)}</div>
            <DialogTitle className="font-manrope text-xl">Send from {category}</DialogTitle>
          </div>
          <DialogDescription className="text-center text-balance">
            Send STX from your {category} pocket to another address
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-sm font-medium">
              Recipient Address
            </Label>
            <Input
              id="recipient"
              placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium flex items-center justify-between">
              <span>Amount (STX)</span>
              <span className="text-xs text-muted-foreground">Max: {formatSTX(maxAmount)}</span>
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.000001"
              min="0.000001"
              max={maxAmount}
              className="text-center text-lg font-mono"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAmount(maxAmount.toString())}
              className="w-full text-xs"
              disabled={maxAmount === 0}
            >
              Use Max Amount
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-md space-y-2">
            <div className="text-xs text-muted-foreground text-center">Transaction Details</div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>From:</span>
                <span className="font-medium capitalize">{category}</span>
              </div>
              <div className="flex justify-between">
                <span>To:</span>
                <span className="font-mono text-xs break-all">{recipient || "Enter address"}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-mono">{amount || "0"} STX</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!amount || !recipient || Number.parseFloat(amount) <= 0 || isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Sending..." : "Send STX"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
