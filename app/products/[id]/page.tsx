"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useProducts } from "@/hooks/use-products"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { getProducts, fetchProducts } = useProducts()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        // Fetch products to ensure we have the latest data
        await fetchProducts()
        
        // Find the product by ID
        const products = getProducts()
        const foundProduct = products.find((p: any) => p.id === id)
        
        if (foundProduct) {
          setProduct(foundProduct)
        } else {
          setError("Produto não encontrado")
        }
      } catch (err) {
        setError("Erro ao carregar o produto")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadProduct()
    }
  }, [id, getProducts, fetchProducts])

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || product.imageUrl || "/placeholder.svg"
      })
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-200 rounded-xl h-96"></div>
                <div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded w-1/3 mt-8"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold text-red-500 mb-4">{error || "Produto não encontrado"}</h1>
              <Button onClick={handleGoBack} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
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
          <Button 
            onClick={handleGoBack} 
            variant="outline" 
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-muted rounded-xl overflow-hidden flex items-center justify-center h-96">
              <img 
                src={product.image || product.imageUrl || "/placeholder.svg"} 
                alt={product.name}
                className="object-contain h-full w-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            
            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-2xl font-semibold text-primary mb-6">
                R$ {product.price.toFixed(2)}
              </p>
              
              <div className="prose max-w-none mb-8">
                <p className="text-muted-foreground">
                  {product.description}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={handleAddToCart}
                  className="flex items-center"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Adicionar ao Carrinho
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}