"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useCart } from "./use-cart"
import { authApi } from "@/lib/api"
import { isTokenExpired } from "@/lib/auth"

export interface User {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
  token?: string
  role?: string // Add role to the user interface
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
  checkAuthStatus: () => void
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
            // Log the actual response data to understand its structure
            console.log("Login API Response:", result.data);
            
            // Extract user and token from response - handle various possible structures
            let userData, token;
            
            // Case 1: Direct user object with token
            if (result.data.user && result.data.token) {
              userData = result.data.user;
              token = result.data.token;
            } 
            else if (result.data.id && result.data.token) {
              userData = result.data;
              token = result.data.token;
            }
            else if (result.data.user && result.data.user.token) {
              userData = result.data.user;
              token = result.data.user.token;
            }
            else if (typeof result.data === 'string' && result.data.startsWith('eyJ')) {
              userData = { email }; 
              token = result.data;
            }
            else {
              userData = result.data.user || result.data;
              token = Object.values(result.data).find(val => 
                typeof val === 'string' && val.startsWith('eyJ')
              ) || result.data.token || userData.token;
            }
            
            const user: User = {
              id: userData.id || '',
              name: userData.name || 'Unknown User',
              email: userData.email || email,
              cpf: userData.cpf || '',
              phone: userData.phone || '',
              role: userData.role || '', 
              token: token 
            }
            
            console.log("Final user object to be stored:", user);
            
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
      
      checkAuthStatus: () => {
        const { user } = get();
        if (user?.token && isTokenExpired(user.token)) {
          console.log("Token expired, logging out");
          get().logout();
        }
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }), 
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error("Auth storage hydration error:", error);
          } else if (state?.user?.token) {
            if (isTokenExpired(state.user.token)) {
              console.log("Token expired on hydration, logging out");
              state.logout();
            }
          }
        };
      },
    },
  ),
)