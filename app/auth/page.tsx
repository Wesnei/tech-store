"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { useAuth } from "@/hooks/use-auth"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4 w-full">
      {isLogin ? (
        <div className="w-full max-w-sm mx-auto">
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto">
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        </div>
      )}
    </div>
  )
}