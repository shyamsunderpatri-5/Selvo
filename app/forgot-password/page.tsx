"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Mail, ArrowLeft, Check } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (!response.ok) {
        setMessage(result.message)
        setSuccess(false)
      } else {
        setSuccess(true)
        setMessage(result.message)
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.")
      setSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">
              Selvo<span className="text-gradient">.ai</span>
            </span>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="pt-6 text-center">
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Check your email</h2>
              <p className="text-muted-foreground mb-4">
                We sent a password reset link to your email.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link href="/login" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold">
            Selvo<span className="text-gradient">.ai</span>
          </span>
        </Link>

        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Forgot password?</CardTitle>
            <CardDescription>
              No worries, we'll send you a reset link
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/login" className="text-purple-400 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}