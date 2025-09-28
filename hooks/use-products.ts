"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  createdAt: Date
}

interface ProductStore {
  products: Product[]
  isLoading: boolean
  searchTerm: string
  selectedCategory: string
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<{ success: boolean; message: string }>
  updateProduct: (id: string, product: Partial<Product>) => Promise<{ success: boolean; message: string }>
  deleteProduct: (id: string) => Promise<{ success: boolean; message: string }>
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: string) => void
  getFilteredProducts: () => Product[]
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    description: "O mais avançado iPhone com chip A17 Pro e câmera profissional",
    price: 8999.99,
    image: "/iphone-15-pro.png",
    category: "Smartphones",
    stock: 15,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "MacBook Air M3",
    description: "Notebook ultrafino com chip M3 e bateria de longa duração",
    price: 12999.99,
    image: "/macbook-air-laptop.jpg",
    category: "Notebooks",
    stock: 8,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    name: "AirPods Pro 2",
    description: "Fones sem fio com cancelamento ativo de ruído",
    price: 2499.99,
    image: "/airpods-pro-wireless-earbuds.jpg",
    category: "Acessórios",
    stock: 25,
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "4",
    name: "Samsung Galaxy S24",
    description: "Smartphone Android com IA integrada e câmera de 200MP",
    price: 7499.99,
    image: "/samsung-galaxy-s24-smartphone.jpg",
    category: "Smartphones",
    stock: 12,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "5",
    name: "Dell XPS 13",
    description: "Notebook premium com tela InfinityEdge e processador Intel",
    price: 9999.99,
    image: "/dell-xps-13-laptop.jpg",
    category: "Notebooks",
    stock: 6,
    createdAt: new Date("2024-02-05"),
  },
  {
    id: "6",
    name: "Sony WH-1000XM5",
    description: "Headphone premium com cancelamento de ruído líder da indústria",
    price: 1899.99,
    image: "/sony-wh-1000xm5.png",
    category: "Acessórios",
    stock: 18,
    createdAt: new Date("2024-02-10"),
  },
]

export const useProducts = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      isLoading: false,
      searchTerm: "",
      selectedCategory: "",

      addProduct: async (productData) => {
        set({ isLoading: true })

        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
          createdAt: new Date(),
        }

        set((state) => ({
          products: [...state.products, newProduct],
          isLoading: false,
        }))

        return { success: true, message: "Produto adicionado com sucesso!" }
      },

      updateProduct: async (id, productData) => {
        set({ isLoading: true })

        await new Promise((resolve) => setTimeout(resolve, 1000))

        set((state) => ({
          products: state.products.map((product) => (product.id === id ? { ...product, ...productData } : product)),
          isLoading: false,
        }))

        return { success: true, message: "Produto atualizado com sucesso!" }
      },

      deleteProduct: async (id) => {
        set({ isLoading: true })

        await new Promise((resolve) => setTimeout(resolve, 500))

        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
          isLoading: false,
        }))

        return { success: true, message: "Produto removido com sucesso!" }
      },

      setSearchTerm: (term) => {
        set({ searchTerm: term })
      },

      setSelectedCategory: (category) => {
        set({ selectedCategory: category })
      },

      getFilteredProducts: () => {
        const { products, searchTerm, selectedCategory } = get()

        return products.filter((product) => {
          const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())

          const matchesCategory = selectedCategory === "" || product.category === selectedCategory

          return matchesSearch && matchesCategory
        })
      },
    }),
    {
      name: "products-storage",
    },
  ),
)
