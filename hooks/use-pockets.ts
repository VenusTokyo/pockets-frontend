"use client"

import { useState, useEffect } from "react"
import { userSession } from "@/lib/stacks"

export interface Pocket {
  category: string
  balance: number // in microSTX
}

export function usePockets() {
  const [pockets, setPockets] = useState<Pocket[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load pockets from localStorage (temporary storage until we implement contract reading)
  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData()
      const userAddress = userData.profile.stxAddress.mainnet
      const storedPockets = localStorage.getItem(`pockets_${userAddress}`)

      if (storedPockets) {
        try {
          setPockets(JSON.parse(storedPockets))
        } catch (error) {
          console.error("Failed to parse stored pockets:", error)
          setPockets([])
        }
      }
    }
  }, [])

  const savePockets = (newPockets: Pocket[]) => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData()
      const userAddress = userData.profile.stxAddress.mainnet
      localStorage.setItem(`pockets_${userAddress}`, JSON.stringify(newPockets))
      setPockets(newPockets)
    }
  }

  const createPocket = async (category: string) => {
    setIsLoading(true)
    try {
      // Check if pocket already exists
      const existingPocket = pockets.find((p) => p.category.toLowerCase() === category.toLowerCase())
      if (existingPocket) {
        throw new Error("Pocket with this name already exists")
      }

      const newPocket: Pocket = {
        category,
        balance: 0,
      }

      const updatedPockets = [...pockets, newPocket]
      savePockets(updatedPockets)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePocketBalance = (category: string, newBalance: number) => {
    const updatedPockets = pockets.map((pocket) =>
      pocket.category === category ? { ...pocket, balance: newBalance } : pocket,
    )
    savePockets(updatedPockets)
  }

  const deletePocket = (category: string) => {
    const updatedPockets = pockets.filter((pocket) => pocket.category !== category)
    savePockets(updatedPockets)
  }

  return {
    pockets,
    isLoading,
    createPocket,
    updatePocketBalance,
    deletePocket,
  }
}
