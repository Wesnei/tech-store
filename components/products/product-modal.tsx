"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Upload, Link, X, CheckCircle, AlertCircle } from "lucide-react"
import type { Product } from "@/hooks/use-products"
import { useProducts } from "@/hooks/use-products"
import { useToast } from "@/hooks/use-toast"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product?: Product | null
  mode: "create" | "edit"
  onSuccess?: () => void
}

const categories = ["Smartphones", "Notebooks", "Acessórios", "Tablets", "Smartwatches"]

export function ProductModal({ isOpen, onClose, product, mode, onSuccess }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imageMode, setImageMode] = useState<"url" | "upload">("url")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  const { addProduct, updateProduct, isLoading } = useProducts()
  const { toast } = useToast()

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image: product.image,
      })
      setPreviewUrl(product.image)
      
      if (product.image && (product.image.startsWith('http') || product.image.startsWith('/'))) {
        setImageMode("url")
      } else {
        setImageMode("upload")
      }
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
      })
      setPreviewUrl("")
      setImageMode("url")
    }
    setErrors({})
    setSelectedFile(null)
  }, [product, mode, isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Erro no upload",
          description: "Por favor, selecione apenas arquivos de imagem.",
          variant: "destructive",
          action: <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>,
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive",
          action: <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>,
        })
        return
      }

      setSelectedFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória"
    }

    if (!formData.price) {
      newErrors.price = "Preço é obrigatório"
    } else if (Number.parseFloat(formData.price) <= 0) {
      newErrors.price = "Preço deve ser maior que zero"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    let imageData: File | string = formData.image || `/placeholder.svg?height=300&width=300&query=${formData.name}`
    
    if (imageMode === "upload" && selectedFile) {
      imageData = selectedFile
    }

    const productData: any = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number.parseFloat(formData.price),
      image: imageData,
    }

    let result
    if (mode === "create") {
      result = await addProduct(productData)
    } else if (product) {
      result = await updateProduct(product.id, productData)
    }

    if (result) {
      if (result.success) {
        toast({
          title: `"${productData.name}" ${mode === "create" ? "criado" : "atualizado"} com sucesso!`,
          action: <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>,
        })
        
        onSuccess?.()
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        toast({
          title: "Erro na operação",
          description: result.message,
          variant: "destructive",
          action: <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>,
        })
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto" aria-describedby="product-modal-description">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Adicionar Produto" : "Editar Produto"}</DialogTitle>
          <DialogDescription id="product-modal-description" className="sr-only">
            {mode === "create" ? "Formulário para adicionar um novo produto" : "Formulário para editar um produto existente"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: iPhone 15 Pro"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o produto..."
                rows={3}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-sm text-descriptive">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
            </div>

            <div className="space-y-3">
              <Label>Imagem do Produto</Label>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={imageMode === "url" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImageMode("url")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Link className="h-4 w-4" />
                  URL
                </Button>
                <Button
                  type="button"
                  variant={imageMode === "upload" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImageMode("upload")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </div>

              {imageMode === "url" ? (
                <div className="space-y-2">
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value })
                      setPreviewUrl(e.target.value)
                    }}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  <p className="text-xs text-muted-foreground">Cole a URL da imagem do produto</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input id="imageFile" type="file" accept="image/*" onChange={handleFileChange} className="flex-1" />
                    {selectedFile && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFile(null)
                          setPreviewUrl("")
                        }}
                        className="cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Selecione uma imagem (máx. 5MB) - será enviada para o backend
                  </p>
                </div>
              )}

              {previewUrl && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <div className="w-32 h-32 border rounded-lg overflow-hidden bg-muted">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Handle image load error
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">Se não informado, será gerada uma imagem placeholder</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent cursor-pointer">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1 cursor-pointer">
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {mode === "create" ? "Adicionando..." : "Salvando..."}
                  </>
                ) : mode === "create" ? (
                  "Adicionar"
                ) : (
                  "Salvar"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}