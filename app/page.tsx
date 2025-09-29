"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/products/product-card"
import { ProductSkeleton } from "@/components/products/product-skeleton"
import { ProductModal } from "@/components/products/product-modal"
import { DeleteProductModal } from "@/components/products/delete-product-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Sparkles, Shield, Truck } from "lucide-react"
import { useProducts, type Product } from "@/hooks/use-products"
import { useAuth } from "@/hooks/use-auth"

export default function HomePage() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [isLoading, setIsLoading] = useState(true)

  const { searchTerm, selectedCategory, setSearchTerm, setSelectedCategory, getFilteredProducts } = useProducts()

  const { user } = useAuth()
  const filteredProducts = getFilteredProducts()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateProduct = () => {
    setSelectedProduct(null)
    setModalMode("create")
    setIsProductModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setModalMode("edit")
    setIsProductModalOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteModalOpen(true)
  }

  const categories = [
    { value: "all", label: "Todas as categorias" },
    { value: "Smartphones", label: "Smartphones" },
    { value: "Notebooks", label: "Notebooks" },
    { value: "Acessórios", label: "Acessórios" },
    { value: "Tablets", label: "Tablets" },
    { value: "Smartwatches", label: "Smartwatches" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-6 mb-16 animate-slide-up bg-gradient-to-r from-background to-muted/30 p-8 rounded-2xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight">
              Bem-vindo à <span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-primary/70">TechStore</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
              Descubra os melhores produtos de tecnologia com preços incríveis e qualidade garantida.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Compra Segura</span>
              </div>
              <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full">
                <Truck className="h-4 w-4 text-blue-600" />
                <span>Frete Grátis</span>
              </div>
              <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>Produtos Originais</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 form-input-sm"
              />
            </div>

            <Select
              value={selectedCategory || "all"}
              onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}
            >
              <SelectTrigger className="w-full sm:w-48 form-input-sm">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {user && (
              <Button onClick={handleCreateProduct} className="whitespace-nowrap form-button-sm cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Adicionar Produto</span>
                <span className="sm:hidden">Adicionar</span>
              </Button>
            )}
          </div>

          <div className="products-grid">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16 animate-fade-in">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="animate-slide-up">
                    <ProductCard
                      product={product}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                      showActions={!!user}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 animate-fade-in mb-16">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">Nenhum produto encontrado</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedCategory
                      ? "Tente ajustar os filtros para encontrar o que procura."
                      : "Nenhum produto disponível no momento."}
                  </p>
                  {(searchTerm || selectedCategory) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedCategory("")
                      }}
                      className="cursor-pointer"
                    >
                      Limpar Filtros
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        mode={modalMode}
        onSuccess={() => {}} // Remove the redundant toast callbacks
      />

      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        product={selectedProduct}
        onSuccess={() => {}} // Remove the redundant toast callbacks
      />
    </div>
  )
}