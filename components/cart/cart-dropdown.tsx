"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { CartModal } from "./cart-modal"

export function CartDropdown() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = getTotalPrice()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative cursor-pointer" data-cart-trigger>
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80 p-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Carrinho</h3>
              {totalItems > 0 && (
                <span className="text-sm text-muted-foreground">
                  {totalItems} {totalItems === 1 ? "item" : "itens"}
                </span>
              )}
            </div>

            {items.length === 0 ? (
              <div className="text-center py-6">
                <ShoppingBag className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Seu carrinho está vazio</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted border">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                        <p className="text-xs font-semibold text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 cursor-pointer"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="text-xs w-6 text-center">{item.quantity}</span>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 cursor-pointer"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive cursor-pointer"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {items.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{items.length - 3} mais {items.length - 3 === 1 ? "item" : "itens"}
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>

                  <Button onClick={() => setIsModalOpen(true)} className="w-full cursor-pointer" size="sm">
                    Ver Carrinho Completo
                  </Button>
                </div>
              </>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <CartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
