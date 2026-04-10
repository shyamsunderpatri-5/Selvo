"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Crown, AlertCircle, Hash, Copy, Check, Sparkles, Loader2, User } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "hinglish", label: "Hinglish" },
  { code: "te", label: "Telugu" },
  { code: "te_hinglish", label: "Telugu Hinglish" },
  { code: "ta", label: "Tamil" },
  { code: "bn", label: "Bengali" },
  { code: "mr", label: "Marathi" },
]

const TONES = [
  { value: "storytelling", label: "📖 Story" },
  { value: "educational", label: "📚 Education" },
  { value: "funny", label: "😄 Funny" },
  { value: "hype", label: "🔥 Hype" },
  { value: "motivational", label: "💪 Motivation" },
]

const TRENDING_HASHTAGS = [
  "viral", "reels", "trending", "fyp", "foryou", 
  "explore", "india", "motivation", "success"
]

const DURATIONS = [
  { value: "30", label: "⏱️ 30 sec" },
  { value: "60", label: "⏱️ 60 sec" },
  { value: "90", label: "⏱️ 90 sec" },
]

interface User {
  id: string
  email: string
  name: string
  isPro: boolean
  scriptsUsed: number
  scriptsLimit: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [scriptData, setScriptData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("storytelling")
  const [duration, setDuration] = useState("60")
  const [selectedLang, setSelectedLang] = useState("en")
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [freeScriptUsed, setFreeScriptUsed] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("selvo_user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    const usedFree = localStorage.getItem("free_script_used")
    if (usedFree === "true") {
      setFreeScriptUsed(true)
    }
  }, [])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    if (!user && freeScriptUsed) {
      return
    }

    if (user && user.scriptsUsed >= user.scriptsLimit && !user.isPro) {
      return
    }
    
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-language": selectedLang,
          "x-user-id": user?.id || ""
        },
        body: JSON.stringify({ topic, tone, duration }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to generate script")
      }

      const result = await response.json()
      setScriptData(result.data)

      if (user) {
        const updatedUser = {
          ...user,
          scriptsUsed: user.scriptsUsed + 1,
        }
        setUser(updatedUser)
        localStorage.setItem("selvo_user", JSON.stringify(updatedUser))
      } else {
        localStorage.setItem("free_script_used", "true")
        setFreeScriptUsed(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("selvo_user")
    document.cookie = "selvo_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/")
  }

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  const scriptsRemaining = user ? user.scriptsLimit - user.scriptsUsed : 0
  const isLimitReached = user ? (scriptsRemaining <= 0 && !user.isPro) : freeScriptUsed

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={!!user} isPro={user?.isPro} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {user ? `Namaste, ${user.name}! 👋` : "Welcome! 🎉"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user ? "Generate your viral content" : "Try for FREE - No login needed!"}
            </p>
          </div>

          {!user && (
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                <User className="h-4 w-4 mr-2" />
                Sign up for more
              </Button>
            </Link>
          )}

          {user && !user.isPro && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                <span className="text-sm">
                  <span className="font-bold">{scriptsRemaining}</span>
                  <span className="text-muted-foreground">/ {user.scriptsLimit} scripts left</span>
                </span>
              </div>
            </div>
          )}
          
          {user?.isPro && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <Crown className="h-4 w-4 mr-1" />
              Pro Creator
            </Badge>
          )}
        </div>

        {isLimitReached && (
          <Card className="p-4 mb-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Your free script is ready!</p>
                  <p className="text-sm text-muted-foreground">Sign up now to generate unlimited viral scripts</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500">Sign Up Free</Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            <Card className="p-4 bg-card border-border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                {user ? "Script Generator" : "Try FREE Script Generator"}
                {!user && <Badge className="bg-green-500">FREE</Badge>}
              </h2>
              
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="What topic? (e.g., 5 tips for glowing skin)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full h-14 px-4 text-base bg-card border border-border rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    disabled={isLoading || isLimitReached}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Language</label>
                  <div className="grid grid-cols-4 gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setSelectedLang(lang.code)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          selectedLang === lang.code
                            ? "bg-purple-500 text-white"
                            : "bg-muted hover:bg-muted/80 text-muted-foreground"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Tone</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full h-11 px-3 bg-card border border-border rounded-lg focus:border-purple-500 focus:outline-none"
                      disabled={isLoading || isLimitReached}
                    >
                      {TONES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full h-11 px-3 bg-card border border-border rounded-lg focus:border-purple-500 focus:outline-none"
                      disabled={isLoading || isLimitReached}
                    >
                      {DURATIONS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                  disabled={isLoading || isLimitReached || !topic.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating in {LANGUAGES.find(l => l.code === selectedLang)?.label}...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      {user ? "Generate Script" : "Generate FREE Script"}
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {scriptData?.script && (
              <Card className="p-4 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    📜 Script 
                    <Badge variant="outline" className="text-xs">
                      {LANGUAGES.find(l => l.code === selectedLang)?.label}
                    </Badge>
                    {duration}s
                  </h3>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(scriptData.script, 'script')}>
                    {copiedSection === 'script' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap font-sans text-muted-foreground">
                    {scriptData.script}
                  </pre>
                </div>
              </Card>
            )}

            {scriptData?.hooks && scriptData.hooks.length > 0 && (
              <Card className="p-4 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">🎣 Hooks</h3>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(scriptData.hooks.join('\n\n'), 'hooks')}>
                    {copiedSection === 'hooks' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="space-y-3">
                  {scriptData.hooks.map((hook: string, i: number) => (
                    <div key={i} className="p-3 bg-muted/30 rounded-lg text-sm">
                      {hook}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {scriptData?.hashtagsNiche && scriptData.hashtagsNiche.length > 0 && (
              <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Hash className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-semibold">Hashtags</h3>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => {
                    const allTags = [...TRENDING_HASHTAGS, ...(scriptData?.hashtagsNiche || [])].map(t => '#' + t.replace(/^#/, '')).join(' ')
                    copyToClipboard(allTags, 'all-tags')
                  }}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy All
                  </Button>
                </div>
                
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">Related to: {topic}</p>
                  <div className="flex flex-wrap gap-2">
                    {scriptData.hashtagsNiche.map((tag: string, i: number) => (
                      <button
                        key={'niche-' + i}
                        onClick={() => {
                          copyToClipboard('#' + tag.replace(/^#/, ''), 'niche-' + i)
                          setCopiedSection('niche-' + i)
                          setTimeout(() => setCopiedSection(null), 2000)
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          copiedSection === 'niche-' + i
                            ? "bg-green-500 text-white"
                            : "bg-purple-500/20 hover:bg-purple-500/30 text-purple-400"
                        }`}
                      >
                        #{tag.replace(/^#/, '')}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Trending</p>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_HASHTAGS.map((tag, i) => (
                      <button
                        key={'trending-' + i}
                        onClick={() => {
                          copyToClipboard('#' + tag, 'trending-' + i)
                          setCopiedSection('trending-' + i)
                          setTimeout(() => setCopiedSection(null), 2000)
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          copiedSection === 'trending-' + i
                            ? "bg-green-500 text-white"
                            : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {scriptData?.captions && scriptData.captions.length > 0 && (
              <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">✨ AI Captions</h3>
                </div>
                <Tabs defaultValue="0" className="w-full">
                  <TabsList className="grid grid-cols-5 gap-1 h-auto bg-muted/50 p-1 mb-4">
                    {scriptData.captions.map((cap: any, i: number) => (
                      <TabsTrigger 
                        key={i} 
                        value={String(i)}
                        className="text-xs py-1.5 data-[state=active]:bg-green-500 data-[state=active]:text-white"
                      >
                        {cap.style?.substring(0, 8) || 'Style ' + (i+1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {scriptData.captions.map((cap: any, i: number) => (
                    <TabsContent key={i} value={String(i)} className="mt-0">
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge style={{ backgroundColor: cap.color }} className="text-white border-0 text-xs">
                            {cap.engagement}
                          </Badge>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(cap.text, 'caption-' + i)}>
                            {copiedSection === 'caption-' + i ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-sm">{cap.text}</p>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </Card>
            )}

            {!scriptData && !user && (
              <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <div className="text-center">
                  <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Ready to go viral?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate 1 FREE script now. No login needed!
                  </p>
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 w-full">
                      Sign Up for Unlimited Scripts
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            <Card className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Want Unlimited Scripts?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sign up for FREE and get more scripts!
                </p>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
