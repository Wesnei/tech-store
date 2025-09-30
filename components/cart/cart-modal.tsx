"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertMessage } from "@/components/ui/alert-message"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ShoppingBag, CreditCard } from "lucide-react"
import { CartItemComponent } from "./cart-item"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [visibleItemsCount, setVisibleItemsCount] = useState(5)

  const { items, getTotalPrice, clearCart, fetchCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen) {
      console.log("🛒 CartModal: Opening modal and fetching cart data");
      setVisibleItemsCount(5)
      fetchCart()
    }
  }, [isOpen, fetchCart])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const handleCheckout = async () => {
    if (!user) {
      setAlert({ type: "error", message: "Faça login para finalizar a compra" })
      return
    }

    if (items.length === 0) {
      setAlert({ type: "error", message: "Seu carrinho está vazio" })
      return
    }

    setIsCheckingOut(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setAlert({ type: "success", message: "Pedido realizado com sucesso! Obrigado pela compra." })
    clearCart()
    setIsCheckingOut(false)

    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = getTotalPrice()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] h-auto max-h-[calc(100vh-2rem)] flex flex-col w-[95vw] max-w-[95vw] sm:w-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrinho de Compras
            {totalItems > 0 && (
              <span className="text-sm text-muted-foreground">
                ({totalItems} {totalItems === 1 ? "item" : "itens"})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {alert && (
            <div className="px-6">
              <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
            </div>
          )}

          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-8 px-6">
              <div className="text-center space-y-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="font-medium">Seu carrinho está vazio</h3>
                  <p className="text-sm text-muted-foreground">Adicione alguns produtos para começar</p>
                </div>
                <Button onClick={onClose} variant="outline">
                  Continuar Comprando
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <div className="px-6 flex-1 flex flex-col min-h-0">
                  <div className="space-y-0 flex-1 overflow-y-auto pb-4">
                    {items.slice(0, visibleItemsCount).map((item) => (
                      <CartItemComponent key={item.id} item={item} />
                    ))}
                  </div>
                  {items.length > visibleItemsCount && (
                    <div className="pt-4 text-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setVisibleItemsCount(prev => prev + 5)}
                        className="cursor-pointer"
                      >
                        Ver mais itens ({items.length - visibleItemsCount} restantes)
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 p-6 pt-4 flex-shrink-0 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      Subtotal ({totalItems} {totalItems === 1 ? "item" : "itens"})
                    </span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frete</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <div className="flex gap-3 flex-col sm:flex-row">
                  <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent cursor-pointer">
                    Continuar Comprando
                  </Button>
                  <Button onClick={handleCheckout} disabled={isCheckingOut || items.length === 0} className="flex-1 cursor-pointer">
                    {isCheckingOut ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Finalizar Compra
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}