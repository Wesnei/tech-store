"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CartModal } from "./cart-modal"
import { useCart } from "@/hooks/use-cart"

export function TestCartModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { addItem } = useCart()

  const addMultipleItems = (count: number) => {
    for (let i = 1; i <= count; i++) {
      addItem({
        id: `item-${i}`,
        name: `Produto de Teste ${i}`,
        price: 99.90,
        image: "/placeholder.svg"
      })
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Teste do Carrinho Modal</h2>
      
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => addMultipleItems(1)}>
          Adicionar 1 Item
        </Button>
        <Button onClick={() => addMultipleItems(5)}>
          Adicionar 5 Itens
        </Button>
        <Button onClick={() => addMultipleItems(10)}>
          Adicionar 10 Itens
        </Button>
        <Button onClick={() => addMultipleItems(20)}>
          Adicionar 20 Itens
        </Button>
        <Button onClick={() => setIsOpen(true)}>
          Abrir Carrinho
        </Button>
      </div>

      <CartModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}