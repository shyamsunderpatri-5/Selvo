"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Sparkles, 
  Menu, 
  X, 
  User, 
  LogOut,
  Crown
} from "lucide-react"
import { useState } from "react"

interface HeaderProps {
  isLoggedIn?: boolean
  isPro?: boolean
  onLogout?: () => void
}

export function Header({ isLoggedIn = false, isPro = false, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              Selvo<span className="text-gradient">.ai</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/#features" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            {isLoggedIn && (
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {isPro && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-xs font-medium text-purple-400">
                    <Crown className="h-3 w-3" />
                    Pro
                  </span>
                )}
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              <Link 
                href="/#features" 
                className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/pricing" 
                className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              {isLoggedIn && (
                <Link 
                  href="/dashboard" 
                  className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                {isLoggedIn ? (
                  <Button variant="outline" onClick={onLogout} className="mx-4">
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link href="/login" className="mx-4">
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link href="/signup" className="mx-4">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                        Get Started Free
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
