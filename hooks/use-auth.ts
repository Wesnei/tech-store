"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useCart } from "./use-cart"
import { authApi } from "@/lib/api"

export interface User {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (userData: {
    name: string
    email: string
    cpf: string
    phone: string
    password: string
  }) => Promise<{ success: boolean; message: string }>
  logout: () => void
  setUser: (user: User | null) => void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          const result = await authApi.login({ email, password })

          if (result.success && result.data) {
            const user = result.data.user || result.data
            set({ user, isLoading: false })
            return { success: true, message: "Login realizado com sucesso!" }
          } else {
            set({ isLoading: false })
            return { success: false, message: result.message }
          }
        } catch (error: any) {
          set({ isLoading: false, error: error.message || "Erro desconhecido" })
          return { success: false, message: error.message || "Falha ao fazer login" }
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null })

        try {
          const result = await authApi.register(userData)

          if (result.success && result.data) {
            set({ isLoading: false })
            return { success: true, message: "Cadastro realizado com sucesso! Faça login para continuar." }
          } else {
            set({ isLoading: false })
            return { success: false, message: result.message }
          }
        } catch (error: any) {
          set({ isLoading: false, error: error.message || "Erro desconhecido" })
          return { success: false, message: error.message || "Falha ao registrar" }
        }
      },

      logout: () => {
        set({ user: null, error: null })
        const { clearCart } = useCart.getState()
        clearCart()
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }), 
    },
  ),
)