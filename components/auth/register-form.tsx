"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertMessage } from "@/components/ui/alert-message"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Eye, EyeOff, User, Mail, Phone, CreditCard, Lock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { validateEmail, validateCPF, formatCPF, formatPhone } from "@/lib/validations"

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const { register, isLoading } = useAuth()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres"
    }

    if (!formData.email) {
      newErrors.email = "Email é obrigatório"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.cpf) {
      newErrors.cpf = "CPF é obrigatório"
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido"
    }

    if (!formData.phone) {
      newErrors.phone = "Telefone é obrigatório"
    } else if (formData.phone.replace(/[^\d]/g, "").length < 10) {
      newErrors.phone = "Telefone inválido"
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const result = await register({
      name: formData.name.trim(),
      email: formData.email,
      cpf: formData.cpf,
      phone: formData.phone,
      password: formData.password,
    })

    setAlert({
      type: result.success ? "success" : "error",
      message: result.message,
    })
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setFormData({ ...formData, cpf: formatted })
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setFormData({ ...formData, phone: formatted })
  }

  return (
    <div className="auth-form-container mx-auto animate-fade-in w-full max-w-md" style={{width: '100%'}}>
      <Card className="w-full shadow-xl border-0 bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm rounded-2xl">
        <CardHeader className="space-y-1 text-center pb-4 pt-6">
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription className="text-sm">Registre-se para começar a comprar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          {alert && <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`pl-10 h-9 text-sm w-full ${errors.name ? "border-destructive" : ""} transition-all hover:shadow-sm focus:ring-2 focus:ring-primary/20`}
                />
              </div>
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`pl-10 h-9 text-sm w-full ${errors.email ? "border-destructive" : ""} transition-all hover:shadow-sm focus:ring-2 focus:ring-primary/20`}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{maxWidth: '100%'}}>
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-sm font-medium">CPF</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    maxLength={14}
                    className={`pl-10 h-9 text-sm w-full ${errors.cpf ? "border-destructive" : ""} transition-all hover:shadow-sm focus:ring-2 focus:ring-primary/20`}
                  />
                </div>
                {errors.cpf && <p className="text-xs text-destructive">{errors.cpf}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    maxLength={15}
                    className={`pl-10 h-9 text-sm w-full ${errors.phone ? "border-destructive" : ""} transition-all hover:shadow-sm focus:ring-2 focus:ring-primary/20`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`pl-10 h-9 text-sm w-full ${errors.password ? "border-destructive" : ""} transition-all hover:shadow-sm focus:ring-2 focus:ring-primary/20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`pl-10 h-9 text-sm w-full ${errors.confirmPassword ? "border-destructive" : ""} transition-all hover:shadow-sm focus:ring-2 focus:ring-primary/20`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full cursor-pointer mt-4 h-9 text-sm font-medium" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Cadastrando...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <button 
                onClick={onSwitchToLogin} 
                className="text-primary hover:underline font-medium transition-all hover:scale-105"
              >
                Faça login aqui
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
