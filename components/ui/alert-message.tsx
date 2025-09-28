"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertMessageProps {
  type: "success" | "error" | "warning"
  message: string
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}

export function AlertMessage({ type, message, onClose, autoClose = true, duration = 5000 }: AlertMessageProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  if (!isVisible) return null

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
  }

  const Icon = icons[type]

  const variants = {
    success: "border-success/20 bg-success/10 text-success-foreground",
    error: "border-destructive/20 bg-destructive/10 text-destructive-foreground",
    warning: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  }

  return (
    <Alert className={cn("animate-fade-in", variants[type])}>
      <Icon className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onClose && (
          <button
            onClick={() => {
              setIsVisible(false)
              onClose()
            }}
            className="ml-4 hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </AlertDescription>
    </Alert>
  )
}
