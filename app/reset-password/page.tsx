"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Lock, ArrowRight } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for auth token in URL hash
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      setReady(true)
    } else {
      router.push('/login')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    if (password !== confirmPassword) {
      setMessage("Passwords don't match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      const { error } = await supabase.auth.updateUser({
        password
      })

      if (error) {
        setMessage(error.message)
      } else {
        setSuccess(true)
        setMessage("Password updated! Redirecting to login...")
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (err: any) {
      setMessage(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Password updated!</h2>
          <p className="text-muted-foreground mb-4">
            Redirecting to login...
          </p>
          <Link href="/login" className="text-purple-400 hover:underline">
            Go to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold">
            Selvo<span className="text-gradient">.ai</span>
          </span>
        </Link>

        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reset password</CardTitle>
            <CardDescription>
              Enter your new password
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Min 6 characters"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {message && (
                <p className={`text-sm ${success ? "text-green-500" : "text-destructive"}`}>
                  {message}
                </p>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update password"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}