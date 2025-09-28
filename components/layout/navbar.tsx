"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Menu,
  X,
  Search,
  Store,
  LogOut,
  UserCircle,
  User,
  ShoppingCart,
} from "lucide-react"
import { CartDropdown } from "@/components/cart/cart-dropdown"
import { useAuth } from "@/hooks/use-auth"
import { useProducts } from "@/hooks/use-products"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const { user, logout } = useAuth()
  const { setSearchTerm } = useProducts()
  const router = useRouter()

  const handleAuthClick = () => {
    if (user) {
      logout()
    } else {
      router.push("/auth")
    }
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setSearchTerm(value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const productsSection = document.querySelector(".products-grid")
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between min-w-0">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">TechStore</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-[180px] lg:max-w-[220px] mx-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar Produtos..."
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
              />
            </form>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            {/* Cart */}
            <CartDropdown />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 hover:bg-muted transition-colors cursor-pointer px-2 py-1"
                  >
                    <UserCircle className="h-10 w-10 text-primary" />
                    <span className="hidden lg:inline text-xl font-semibold text-foreground">
                      {user.name.split(" ")[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAuthClick}
                className="hover:bg-muted transition-colors cursor-pointer flex items-center px-2 py-1"
              >
                <User className="h-10 w-10 text-primary" />
                <span className="hidden lg:inline ml-2 font-semibold text-xl text-foreground">Entrar</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-muted transition-colors cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background animate-fade-in overflow-hidden">
            <div className="px-2 pt-2 pb-3 space-y-3 max-w-full">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar Produtos..."
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                />
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
