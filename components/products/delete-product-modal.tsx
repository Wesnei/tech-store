"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertMessage } from "@/components/ui/alert-message"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AlertTriangle } from "lucide-react"
import type { Product } from "@/hooks/use-products"
import { useProducts } from "@/hooks/use-products"

interface DeleteProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onSuccess?: () => void
}

export function DeleteProductModal({ isOpen, onClose, product, onSuccess }: DeleteProductModalProps) {
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const { deleteProduct, isLoading } = useProducts()

  const handleDelete = async () => {
    if (!product) return

    const result = await deleteProduct(product.id)

    setAlert({
      type: result.success ? "success" : "error",
      message: result.message,
    })

    if (result.success) {
      onSuccess?.()
      setTimeout(() => {
        onClose()
      }, 1500)
    }
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
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
          {alert && <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

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
