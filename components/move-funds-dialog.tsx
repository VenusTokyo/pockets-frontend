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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRightLeft, AlertCircle } from "lucide-react"
import { moveFunds, microSTXToSTX, formatSTX } from "@/lib/stacks"
import type { Pocket } from "@/hooks/use-pockets"

interface MoveFundsDialogProps {
  fromCategory: string
  fromBalance: number
  pockets: Pocket[]
  onMove: (fromCategory: string, toCategory: string, amount: number) => void
  trigger?: React.ReactNode
}

export function MoveFundsDialog({ fromCategory, fromBalance, pockets, onMove, trigger }: MoveFundsDialogProps) {
  const [open, setOpen] = useState(false)
  const [toCategory, setToCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const availablePockets = pockets.filter((p) => p.category !== fromCategory)
  const maxAmount = microSTXToSTX(fromBalance)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!toCategory) {
      setError("Please select a destination pocket")
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
      await moveFunds(fromCategory, toCategory, numAmount)
      onMove(fromCategory, toCategory, numAmount * 1000000) // Convert to microSTX
      setAmount("")
      setToCategory("")
      setOpen(false)
    } catch (error) {
      console.error("Move failed:", error)
      setError("Transaction failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="hover:bg-accent/10 bg-transparent">
            <ArrowRightLeft className="h-3 w-3" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            <DialogTitle className="font-manrope text-xl">Move STX Between Pockets</DialogTitle>
          </div>
          <DialogDescription className="text-center text-balance">
            Transfer STX from {fromCategory} to another pocket
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="to-category" className="text-sm font-medium">
              Move To
            </Label>
            <Select value={toCategory} onValueChange={setToCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination pocket" />
              </SelectTrigger>
              <SelectContent>
                {availablePockets.map((pocket) => (
                  <SelectItem key={pocket.category} value={pocket.category}>
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{pocket.category}</span>
                      <span className="text-xs text-muted-foreground">
                        ({formatSTX(microSTXToSTX(pocket.balance))})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <span className="font-medium capitalize">{fromCategory}</span>
              </div>
              <div className="flex justify-between">
                <span>To:</span>
                <span className="font-medium capitalize">{toCategory || "Select pocket"}</span>
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
              disabled={!amount || !toCategory || Number.parseFloat(amount) <= 0 || isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Moving..." : "Move STX"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
