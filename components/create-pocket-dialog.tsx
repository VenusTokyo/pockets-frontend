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
import { Plus, Sparkles } from "lucide-react"

interface CreatePocketDialogProps {
  onCreatePocket: (category: string) => void
}

export function CreatePocketDialog({ onCreatePocket }: CreatePocketDialogProps) {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category.trim()) return

    setIsLoading(true)
    try {
      await onCreatePocket(category.trim())
      setCategory("")
      setOpen(false)
    } catch (error) {
      console.error("Failed to create pocket:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedCategories = ["Savings", "Emergency Fund", "Fun Money", "Food Budget", "Travel Fund", "Shopping"]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-6 py-6 text-lg font-medium">
          <Plus className="h-5 w-5" />
          Create New Pocket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <DialogTitle className="font-manrope text-xl">Create Kawaii Pocket</DialogTitle>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <DialogDescription className="text-center text-balance">
            Give your new pocket a cute name! Each pocket will get its own chibi character.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Pocket Name
            </Label>
            <Input
              id="category"
              placeholder="e.g., Savings, Fun Money, Emergency Fund"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              maxLength={32}
              className="text-center"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Quick Suggestions</Label>
            <div className="grid grid-cols-2 gap-2">
              {suggestedCategories.map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCategory(suggestion)}
                  className="text-xs hover:bg-primary/10 hover:border-primary/30"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!category.trim() || isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? "Creating..." : "Create Pocket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
