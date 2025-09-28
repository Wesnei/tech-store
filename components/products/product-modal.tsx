"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertMessage } from "@/components/ui/alert-message"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Upload, Link, X } from "lucide-react"
import type { Product } from "@/hooks/use-products"
import { useProducts } from "@/hooks/use-products"

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
    category: "",
    stock: "",
    image: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [imageMode, setImageMode] = useState<"url" | "upload">("url")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  const { addProduct, updateProduct, isLoading } = useProducts()

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        image: product.image,
      })
      setPreviewUrl(product.image)
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: "",
      })
      setPreviewUrl("")
    }
    setErrors({})
    setAlert(null)
    setSelectedFile(null)
    setImageMode("url")
  }, [product, mode, isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setAlert({
          type: "error",
          message: "Por favor, selecione apenas arquivos de imagem",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setAlert({
          type: "error",
          message: "A imagem deve ter no máximo 5MB",
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.split(",")[1]
        resolve(base64)
      }
      reader.onerror = (error) => reject(error)
    })
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

    if (!formData.category) {
      newErrors.category = "Categoria é obrigatória"
    }

    if (!formData.stock) {
      newErrors.stock = "Estoque é obrigatório"
    } else if (Number.parseInt(formData.stock) < 0) {
      newErrors.stock = "Estoque não pode ser negativo"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    let imageData = formData.image || `/placeholder.svg?height=300&width=300&query=${formData.name}`

    if (imageMode === "upload" && selectedFile) {
      try {
        imageData = await fileToBase64(selectedFile)
      } catch (error) {
        setAlert({
          type: "error",
          message: "Erro ao processar a imagem",
        })
        return
      }
    }

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number.parseFloat(formData.price),
      category: formData.category,
      stock: Number.parseInt(formData.stock),
      image: imageData,
    }

    let result
    if (mode === "create") {
      result = await addProduct(productData)
    } else if (product) {
      result = await updateProduct(product.id, productData)
    }

    if (result) {
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
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Adicionar Produto" : "Editar Produto"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {alert && <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

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

            <div className="grid grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  className={errors.stock ? "border-destructive" : ""}
                />
                {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
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
                    Selecione uma imagem (máx. 5MB) - será convertida para base64 para o backend
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
                      onError={() => setPreviewUrl("")}
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
