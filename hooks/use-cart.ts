"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { cartApi } from "@/lib/api"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  addItem: (item: Omit<CartItem, "quantity">) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => void
  getTotalPrice: () => number
  fetchCart: () => Promise<void>
}

let hasWarnedAboutAPI = false;

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await cartApi.getCart()
          console.log("🛒 Cart API response:", response)
          if (response.success && response.data) {
            const cartItems = response.data.items?.map((item: any) => ({
              id: item.product?.id || item.productId,
              name: item.product?.name || 'Unknown Product',
              price: item.product?.price || 0,
              image: item.product?.imageUrl || item.product?.image || "/placeholder.svg",
              quantity: item.quantity || 1
            })) || []
            
            set({ items: cartItems, isLoading: false })
          } else {
            if (!hasWarnedAboutAPI) {
              console.warn("🛒 Cart API not available, using local storage data")
              hasWarnedAboutAPI = true;
            }
            set({ isLoading: false })
          }
        } catch (error: any) {
          // If API is not available, keep local storage data
          if (!hasWarnedAboutAPI) {
            console.warn("🛒 Cart API not available, using local storage data:", error.message)
            hasWarnedAboutAPI = true;
          }
          set({ isLoading: false })
        }
      },

      addItem: async (item) => {
        set({ isLoading: true, error: null })
        try {
          const response = await cartApi.addProductToCart(item.id, 1)
          console.log("🛒 Add to cart API response:", response)
          if (response.success) {
            const items = get().items
            const existingItem = items.find((i) => i.id === item.id)

            if (existingItem) {
              set({
                items: items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
                isLoading: false
              })
            } else {
              set({ 
                items: [...items, { ...item, quantity: 1 }], 
                isLoading: false 
              })
            }
          } else {
            const items = get().items
            const existingItem = items.find((i) => i.id === item.id)

            if (existingItem) {
              set({
                items: items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
                isLoading: false
              })
            } else {
              set({ 
                items: [...items, { ...item, quantity: 1 }], 
                isLoading: false 
              })
            }
          }
        } catch (error: any) {
          if (!hasWarnedAboutAPI) {
            console.warn("🛒 Cart API not available, using local storage:", error.message)
            hasWarnedAboutAPI = true;
          }
          const items = get().items
          const existingItem = items.find((i) => i.id === item.id)

          if (existingItem) {
            set({
              items: items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
              isLoading: false
            })
          } else {
            set({ 
              items: [...items, { ...item, quantity: 1 }], 
              isLoading: false 
            })
          }
        }
      },

      removeItem: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const response = await cartApi.removeProductFromCart(id)
          if (response.success) {
            set({ 
              items: get().items.filter((item) => item.id !== id),
              isLoading: false
            })
          } else {
            set({ 
              items: get().items.filter((item) => item.id !== id),
              isLoading: false
            })
          }
        } catch (error: any) {
          if (!hasWarnedAboutAPI) {
            console.warn("🛒 Cart API not available, using local storage:", error.message)
            hasWarnedAboutAPI = true;
          }
          set({ 
            items: get().items.filter((item) => item.id !== id),
            isLoading: false
          })
        }
      },

      updateQuantity: async (id, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(id)
          return
        }

        set({ isLoading: true, error: null })
        try {
          const response = await cartApi.decreaseProductQuantity(id, quantity)
          if (response.success) {
            set({
              items: get().items.map((item) => (item.id === id ? { ...item, quantity } : item)),
              isLoading: false
            })
          } else {
            set({
              items: get().items.map((item) => (item.id === id ? { ...item, quantity } : item)),
              isLoading: false
            })
          }
        } catch (error: any) {
          if (!hasWarnedAboutAPI) {
            console.warn("🛒 Cart API not available, using local storage:", error.message)
            hasWarnedAboutAPI = true;
          }
          set({
            items: get().items.map((item) => (item.id === id ? { ...item, quantity } : item)),
            isLoading: false
          })
        }
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)