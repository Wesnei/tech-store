"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"
import type { Product } from "@/hooks/use-products"
import { useProducts } from "@/hooks/use-products"
import { useToast } from "@/hooks/use-toast"

interface DeleteProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onSuccess?: () => void
}

export function DeleteProductModal({ isOpen, onClose, product, onSuccess }: DeleteProductModalProps) {
  const { deleteProduct, isLoading } = useProducts()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!product) return

    const result = await deleteProduct(product.id)

    if (result.success) {
      toast({
        title: `"${product.name}" removido com sucesso!`,
        action: <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
          <CheckCircle className="h-4 w-4 text-red-600" />
        </div>,
      })
      
      onSuccess?.()
      setTimeout(() => {
        onClose()
      }, 1500)
    } else {
      toast({
        title: "Erro ao excluir produto!",
        variant: "destructive",
        action: <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-4 w-4 text-red-600" />
        </div>,
      })
    }
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. O produto será removido permanentemente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium">{product.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
            <p className="text-sm font-medium mt-2">
              Preço:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(product.price)}
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent font-bold cursor-pointer">
              Cancelar
            </Button>
            <Button onClick={handleDelete} disabled={isLoading} variant="destructive" className="flex-1 text-black font-bold cursor-pointer">
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}