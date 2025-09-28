"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useCart } from "./use-cart"

export interface User {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (userData: {
    name: string
    email: string
    cpf: string
    phone: string
    password: string
  }) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

const mockUsers: Array<User & { password: string }> = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@email.com",
    cpf: "123.456.789-00",
    phone: "(11) 99999-9999",
    password: "123456",
  },
]

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })

        await new Promise((resolve) => setTimeout(resolve, 1000))

        const user = mockUsers.find((u) => u.email === email && u.password === password)

        if (user) {
          const { password: _, ...userWithoutPassword } = user
          set({ user: userWithoutPassword, isLoading: false })
          return { success: true, message: "Login realizado com sucesso!" }
        } else {
          set({ isLoading: false })
          return { success: false, message: "Email ou senha inválidos." }
        }
      },

      register: async (userData) => {
        set({ isLoading: true })

        await new Promise((resolve) => setTimeout(resolve, 1000))

        const existingUser = mockUsers.find((u) => u.email === userData.email || u.cpf === userData.cpf)

        if (existingUser) {
          set({ isLoading: false })
          if (existingUser.email === userData.email) {
            return { success: false, message: "Este email já está cadastrado." }
          } else {
            return { success: false, message: "Este CPF já está cadastrado." }
          }
        }

        const newUser = {
          id: Date.now().toString(),
          ...userData,
          password: userData.password,
        }

        mockUsers.push(newUser)

        const { password: _, ...userWithoutPassword } = newUser
        set({ user: userWithoutPassword, isLoading: false })

        return { success: true, message: "Cadastro realizado com sucesso!" }
      },

      logout: () => {
        set({ user: null })
        const { clearCart } = useCart.getState()
        clearCart()
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)