"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ShoppingCart, Check, AlertCircle, ShoppingCartIcon } from "lucide-react"
import type { Product } from "@/hooks/use-products"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  showActions?: boolean
}

export function ProductCard({ product, onEdit, onDelete, showActions = false }: ProductCardProps) {
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })

    setAddedToCart(true)
    toast({
      title: `"${product.name}" adicionado ao carrinho!`,
      action: <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
        <ShoppingCartIcon className="h-4 w-4 text-primary" />
      </div>,
    })

    setTimeout(() => {
      setAddedToCart(false)
    }, 2000)

    setTimeout(() => {
      const cartButton = document.querySelector("[data-cart-trigger]") as HTMLButtonElement
      if (cartButton) {
        cartButton.click()
      }
    }, 100)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border-2 hover:border-primary/30">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted-foreground/5">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.stock <= 5 && (
          <Badge variant="destructive" className="absolute top-2 right-2 animate-pulse">
            Estoque baixo
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-2 flex-1 bg-background">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg line-clamp-1 text-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
          <Badge variant="secondary" className="animate-fade-in">{product.category}</Badge>
        </div>

        <div className="text-sm text-muted-foreground">Estoque: {product.stock} unidades</div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-2 bg-background flex flex-col items-center">
        {showActions ? (
          <div className="flex gap-2 w-full justify-center items-center">
            <Button 
              onClick={handleAddToCart} 
              className="flex-1 h-9 text-sm shadow-sm hover:shadow-md transition-all rounded-full cursor-pointer min-w-[120px]"
              disabled={product.stock === 0}
            >
              {addedToCart ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  <span>Adicionado!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span className="truncate">
                    {product.stock === 0 ? "Fora de estoque" : "Adicionar"}
                  </span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(product)}
              className="flex items-center justify-center h-9 w-9 p-0 font-medium text-primary hover:bg-primary/10 hover:text-primary transition-all shadow-sm hover:shadow rounded-full cursor-pointer"
              title="Editar produto"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(product)}
              className="flex items-center justify-center h-9 w-9 p-0 font-medium text-destructive hover:bg-destructive/10 hover:text-destructive transition-all shadow-sm hover:shadow rounded-full cursor-pointer"
              title="Excluir produto"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Excluir</span>
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button 
              onClick={handleAddToCart} 
              className="w-40 h-11 text-base shadow-sm hover:shadow-md transition-all rounded-full cursor-pointer"
              disabled={product.stock === 0}
            >
              {addedToCart ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  <span>Adicionado!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span className="truncate">
                    {product.stock === 0 ? "Fora de estoque" : "Adicionar"}
                  </span>
                </>
              )}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}