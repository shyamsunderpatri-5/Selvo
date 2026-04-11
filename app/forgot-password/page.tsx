"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Mail, Lock, ArrowLeft, Check } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [step, setStep] = useState<"email" | "code">("email")
  const [success, setSuccess] = useState(false)
  const [devCode, setDevCode] = useState("")

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "generate" }),
      })

      const result = await response.json()

      if (!response.ok) {
        setMessage(result.message)
      } else {
        setStep("code")
        setDevCode(result.devCode || "")
        setMessage(result.message)
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset", code, newPassword }),
      })

      const result = await response.json()

      if (!response.ok) {
        setMessage(result.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.")
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
              <h2 className="text-xl font-bold mb-2">Password reset!</h2>
              <p className="text-muted-foreground mb-4">
                Your password has been updated.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go to login
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
            <CardTitle className="text-2xl">
              {step === "email" ? "Forgot password?" : "Enter code"}
            </CardTitle>
            <CardDescription>
              {step === "email" 
                ? "Enter your email to get a reset code" 
                : "Enter the code from your email"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {step === "email" ? (
              <form onSubmit={handleSendCode} className="space-y-4">
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
                  <p className="text-sm text-destructive">{message}</p>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {devCode && (
                  <div className="p-3 bg-yellow-500/20 rounded-lg text-center">
                    <p className="text-sm text-yellow-500 font-mono">{devCode}</p>
                    <p className="text-xs text-muted-foreground mt-1">(Dev only - check console)</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reset code</label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="uppercase"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">New password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Min 6 characters"
                      className="pl-10"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                  <p className="text-sm text-destructive">{message}</p>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset password"}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="w-full text-sm text-muted-foreground hover:text-foreground"
                >
                  Didn't receive code? Send again
                </button>
              </form>
            )}

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