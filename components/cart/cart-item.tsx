"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2 } from "lucide-react"
import type { CartItem } from "@/hooks/use-cart"
import { useCart } from "@/hooks/use-cart"

interface CartItemProps {
  item: CartItem
}

export function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      return
    }
    
    const newQuantity = Number.parseInt(value)
    if (isNaN(newQuantity) || newQuantity < 0) {
      e.target.value = item.quantity.toString()
      return
    }
    
    if (newQuantity === 0) {
      removeItem(item.id)
    } else {
      updateQuantity(item.id, newQuantity)
    }
  }

  const handleQuantityBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      e.target.value = item.quantity.toString()
    }
  }

  const incrementQuantity = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  const decrementQuantity = () => {
    if (item.quantity <= 1) {
      removeItem(item.id)
    } else {
      updateQuantity(item.id, item.quantity - 1)
    }
  }

  return (
    <div className="flex items-center space-x-4 py-4 border-b border-border last:border-b-0">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
      </div>

      <div className="flex-1 space-y-1">
        <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
        <p className="text-sm font-semibold text-primary">{formatPrice(item.price)}</p>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent cursor-pointer"
          onClick={decrementQuantity}
        >
          <Minus className="h-3 w-3" />
        </Button>

        <Input
          type="number"
          min="0"
          value={item.quantity}
          onChange={handleQuantityChange}
          onBlur={handleQuantityBlur}
          className="w-16 h-8 text-center text-sm"
        />

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent cursor-pointer"
          onClick={incrementQuantity}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <div className="text-right space-y-1">
        <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeItem(item.id)}
          className="text-destructive hover:text-destructive h-6 w-6 p-0 cursor-pointer"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}