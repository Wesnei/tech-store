"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { productApi } from "@/lib/api"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

interface ProductsResponse {
  page?: number
  limit?: number
  total?: number
  products: Product[]
}

interface ProductStore {
  products: Product[]
  isLoading: boolean
  error: string | null
  searchTerm: string
  fetchProducts: () => Promise<void>
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<{ success: boolean; message: string }>
  updateProduct: (id: string, product: Partial<Product>) => Promise<{ success: boolean; message: string }>
  deleteProduct: (id: string) => Promise<{ success: boolean; message: string }>
  getProducts: () => Product[]
  getFilteredProducts: () => Product[]
  setSearchTerm: (term: string) => void
  searchProducts: (term: string) => Promise<void>
}

export const useProducts = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      error: null,
      searchTerm: "",

      fetchProducts: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await productApi.getProducts()
          if (response.success && response.data) {
            // Handle both array and object with products array
            let productsArray: Product[] = []
            
            if (Array.isArray(response.data)) {
              productsArray = response.data.map(product => ({
                ...product,
                // Map imageUrl to image for consistency
                image: product.imageUrl || product.image || "/placeholder.svg"
              }))
            } else if (typeof response.data === 'object' && 'products' in response.data) {
              const productsData = (response.data as ProductsResponse).products || []
              productsArray = productsData.map(product => ({
                ...product,
                // Map imageUrl to image for consistency
                image: product.imageUrl || product.image || "/placeholder.svg"
              }))
            }
            
            set({ products: productsArray, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error) {
          console.error("Error fetching products:", error)
          set({ error: "Failed to fetch products", isLoading: false })
        }
      },

      searchProducts: async (term: string) => {
        console.log("🔍 useProducts.searchProducts called with term:", term);
        set({ isLoading: true, error: null, searchTerm: term })
        try {
          console.log("🔍 Searching for products with term:", term)
          const response = await productApi.getProducts({ name: term })
          console.log("🔍 Search API response:", response)
          
          if (response.success && response.data) {
            // Handle both array and object with products array
            let productsArray: Product[] = []
            
            if (Array.isArray(response.data)) {
              productsArray = response.data.map(product => ({
                ...product,
                // Map imageUrl to image for consistency
                image: product.imageUrl || product.image || "/placeholder.svg"
              }))
            } else if (typeof response.data === 'object' && 'products' in response.data) {
              const productsData = (response.data as ProductsResponse).products || []
              productsArray = productsData.map(product => ({
                ...product,
                // Map imageUrl to image for consistency
                image: product.imageUrl || product.image || "/placeholder.svg"
              }))
            }
            
            console.log("🔍 Processed search results:", productsArray.length, "products")
            set({ products: productsArray, isLoading: false })
          } else {
            console.log("🔍 Search returned no results or error:", response.message)
            set({ products: [], error: response.message, isLoading: false })
          }
        } catch (error) {
          console.error("Error searching products:", error)
          set({ products: [], error: "Failed to search products", isLoading: false })
        }
      },

      addProduct: async (productData) => {
        set({ isLoading: true, error: null })

        try {
          const response = await productApi.createProduct(productData)
          
          if (response.success && response.data) {
            const newProduct = response.data.product || response.data
            
            set((state) => ({
              products: [...state.products, newProduct],
              isLoading: false,
            }))
            return { success: true, message: "Produto adicionado com sucesso!" }
          } else {
            set({ isLoading: false })
            return { success: false, message: response.message }
          }
        } catch (error) {
          console.error("Error adding product:", error)
          set({ isLoading: false })
          return { success: false, message: "Erro ao adicionar produto" }
        }
      },

      updateProduct: async (id, productData) => {
        set({ isLoading: true, error: null })

        try {
          const response = await productApi.updateProduct(id, productData)
          
          if (response.success && response.data) {
            const updatedProduct = response.data.product || response.data
            
            set((state) => ({
              products: state.products.map((product) => 
                product.id === id ? { ...product, ...updatedProduct } : product
              ),
              isLoading: false,
            }))
            return { success: true, message: "Produto atualizado com sucesso!" }
          } else {
            set({ isLoading: false })
            return { success: false, message: response.message }
          }
        } catch (error) {
          console.error("Error updating product:", error)
          set({ isLoading: false })
          return { success: false, message: "Erro ao atualizar produto" }
        }
      },

      deleteProduct: async (id) => {
        set({ isLoading: true, error: null })

        try {
          const response = await productApi.deleteProduct(id)
          
          if (response.success) {
            set((state) => ({
              products: state.products.filter((product) => product.id !== id),
              isLoading: false,
            }))
            return { success: true, message: "Produto removido com sucesso!" }
          } else {
            set({ isLoading: false })
            return { success: false, message: response.message }
          }
        } catch (error) {
          console.error("Error deleting product:", error)
          set({ isLoading: false })
          return { success: false, message: "Erro ao excluir produto" }
        }
      },

      getProducts: () => {
        const { products } = get()

        if (!Array.isArray(products)) {
          console.error("Products is not an array:", products)
          return []
        }

        return products
      },

      getFilteredProducts: () => {
        const { products, searchTerm } = get()

        if (!Array.isArray(products)) {
          console.error("Products is not an array:", products)
          return []
        }

        if (searchTerm) {
          return products;
        }
        
        return products;
      },

      setSearchTerm: (term: string) => {
        console.log("🔍 useProducts.setSearchTerm called with term:", term);
        set({ searchTerm: term });
      },
    }),
    {
      name: "products-storage",
    },
  ),
)