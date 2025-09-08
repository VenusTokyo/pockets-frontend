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
import { Plus, Coins, AlertCircle } from "lucide-react"
import { depositSTX } from "@/lib/stacks"

interface DepositDialogProps {
  category: string
  onDeposit: (category: string, amount: number) => void
  trigger?: React.ReactNode
}

export function DepositDialog({ category, onDeposit, trigger }: DepositDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const numAmount = Number.parseFloat(amount)
    if (!numAmount || numAmount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (numAmount < 0.000001) {
      setError("Minimum deposit is 0.000001 STX")
      return
    }

    setIsLoading(true)
    try {
      await depositSTX(category, numAmount)
      onDeposit(category, numAmount * 1000000) // Convert to microSTX for local state
      setAmount("")
      setOpen(false)
    } catch (error) {
      console.error("Deposit failed:", error)
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
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="text-2xl">{getChibiCharacter(category)}</div>
            <DialogTitle className="font-manrope text-xl">Add STX to {category}</DialogTitle>
          </div>
          <DialogDescription className="text-center text-balance">
            Deposit STX into your {category} pocket. Your chibi friend will keep it safe!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Amount (STX)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.000001"
              min="0.000001"
              className="text-center text-lg font-mono"
            />
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
                <span>Pocket:</span>
                <span className="font-medium capitalize">{category}</span>
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
              disabled={!amount || Number.parseFloat(amount) <= 0 || isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Depositing..." : "Deposit STX"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
