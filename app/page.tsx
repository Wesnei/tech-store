"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/products/product-card"
import { ProductSkeleton } from "@/components/products/product-skeleton"
import { ProductModal } from "@/components/products/product-modal"
import { DeleteProductModal } from "@/components/products/delete-product-modal"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles, Shield, Truck } from "lucide-react"
import { useProducts, type Product } from "@/hooks/use-products"
import { useAuth } from "@/hooks/use-auth"
import { isAdmin } from "@/lib/permissions"

export default function HomePage() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [isClient, setIsClient] = useState(false)
  const [dynamicSearchTerm, setDynamicSearchTerm] = useState("")
  
  const { 
    products, 
    isLoading, 
    error, 
    searchProducts, 
    fetchProducts, 
    getProducts 
  } = useProducts()

  const { user } = useAuth()
  
  const canEditProducts = isAdmin(user)
  
  const filteredProducts = dynamicSearchTerm 
    ? products.filter(product => 
        product.name.toLowerCase().includes(dynamicSearchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(dynamicSearchTerm.toLowerCase())
      )
    : products

  useEffect(() => {
    setIsClient(true)
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const handleDynamicSearch = (event: CustomEvent) => {
      const searchTerm = event.detail.searchTerm
      setDynamicSearchTerm(searchTerm)
      
      if (searchTerm && searchTerm.trim()) {
        searchProducts(searchTerm)
      } else {
        fetchProducts()
      }
    }

    window.addEventListener('dynamicSearch', handleDynamicSearch as EventListener)
    
    return () => {
      window.removeEventListener('dynamicSearch', handleDynamicSearch as EventListener)
    }
  }, [searchProducts, fetchProducts])

  useEffect(() => {
    const handleOpenCreateProductModal = () => {
      if (canEditProducts) {
        setSelectedProduct(null)
        setModalMode("create")
        setIsProductModalOpen(true)
      }
    }
    
    window.addEventListener('openCreateProductModal', handleOpenCreateProductModal)
    
    return () => {
      window.removeEventListener('openCreateProductModal', handleOpenCreateProductModal)
    }
  }, [canEditProducts])

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

  const hasProducts = filteredProducts.length > 0

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background">
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

            <div className="products-grid">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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

          <div className="products-grid">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16 ${hasProducts ? 'block' : 'hidden'}`}>
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="animate-slide-up">
                      <ProductCard
                        product={product}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                        showActions={canEditProducts}
                      />
                    </div>
                  ))}
                </div>
                
                <div className={`text-center py-16 animate-fade-in mb-16 ${hasProducts ? 'hidden' : 'block'}`}>
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">Nenhum produto encontrado</h3>
                    <p className="text-muted-foreground">
                      {dynamicSearchTerm 
                        ? `Nenhum produto encontrado para "${dynamicSearchTerm}"` 
                        : "Nenhum produto disponível no momento."}
                    </p>
                  </div>
                </div>
              </>
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
        onSuccess={() => {
          if (dynamicSearchTerm) {
            searchProducts(dynamicSearchTerm)
          } else {
            fetchProducts()
          }
        }}
      />

      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        product={selectedProduct}
        onSuccess={() => {
          if (dynamicSearchTerm) {
            searchProducts(dynamicSearchTerm)
          } else {
            fetchProducts()
          }
        }}
      />
    </div>
  )
}