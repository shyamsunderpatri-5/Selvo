"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Loader2, Hash, Copy, Check, ArrowRight } from "lucide-react"
import Link from "next/link"

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "hinglish", label: "Hinglish" },
  { code: "te", label: "Telugu" },
  { code: "te_hinglish", label: "Telugu Hinglish" },
]

const TONES = [
  { value: "storytelling", label: "📖 Story" },
  { value: "educational", label: "📚 Education" },
  { value: "funny", label: "😄 Funny" },
  { value: "hype", label: "🔥 Hype" },
  { value: "motivational", label: "💪 Motivation" },
]

const DURATIONS = [
  { value: "30", label: "30 sec" },
  { value: "60", label: "60 sec" },
  { value: "90", label: "90 sec" },
]

export function FreeGenerator() {
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("storytelling")
  const [duration, setDuration] = useState("60")
  const [selectedLang, setSelectedLang] = useState("hinglish")
  const [isLoading, setIsLoading] = useState(false)
  const [scriptData, setScriptData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [freeUsed, setFreeUsed] = useState(false)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim() || freeUsed) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-language": selectedLang,
          "x-user-id": ""
        },
        body: JSON.stringify({ topic, tone, duration }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to generate")
      }

      const result = await response.json()
      setScriptData(result.data)
      setFreeUsed(true)
      localStorage.setItem("free_script_used", "true")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-purple-500/5">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
            ⚡ Try FREE - No Login Required
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Generate Your First Viral Script
          </h2>
          <p className="text-muted-foreground">
            Just enter your topic and get a complete script in seconds
          </p>
        </div>

        {!freeUsed ? (
          <Card className="p-6 bg-card border-purple-500/20 shadow-xl shadow-purple-500/10">
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <input
                  type="text"
                  placeholder="What topic? (e.g., 5 tips for glowing skin)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full h-14 px-4 text-base bg-background border border-border rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Language</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setSelectedLang(lang.code)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full h-11 px-3 bg-background border border-border rounded-lg"
                    disabled={isLoading}
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
                    className="w-full h-11 px-3 bg-background border border-border rounded-lg"
                    disabled={isLoading}
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
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                disabled={isLoading || !topic.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate FREE Script
                  </>
                )}
              </Button>
            </form>
          </Card>
        ) : (
          <div className="space-y-6">
            {scriptData && (
              <>
                <Card className="p-6 bg-card border-green-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="font-semibold text-green-500">Script Generated!</span>
                    </div>
                    <Badge className="bg-purple-500">{LANGUAGES.find(l => l.code === selectedLang)?.label} • {duration}s</Badge>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg mb-4">
                    <pre className="text-sm whitespace-pre-wrap">{scriptData.script}</pre>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mb-4"
                    onClick={() => copyToClipboard(scriptData.script, 'script')}
                  >
                    {copiedSection === 'script' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy Script
                  </Button>
                </Card>

                {scriptData.captions && scriptData.captions.length > 0 && (
                  <Card className="p-6 bg-card border-purple-500/20">
                    <h3 className="font-semibold mb-4">✨ AI Captions</h3>
                    <Tabs defaultValue="0" className="w-full">
                      <TabsList className="grid grid-cols-5 gap-1 h-auto bg-muted/50 p-1 mb-4">
                        {scriptData.captions.map((cap: any, i: number) => (
                          <TabsTrigger key={i} value={String(i)} className="text-xs py-1.5 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                            {cap.style?.substring(0, 8)}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {scriptData.captions.map((cap: any, i: number) => (
                        <TabsContent key={i} value={String(i)} className="mt-0">
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <div className="flex justify-end mb-2">
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

                <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Want Unlimited Scripts?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sign up for FREE to generate more viral scripts
                    </p>
                    <Link href="/signup">
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                        Sign Up Free
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
