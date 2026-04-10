"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Download, 
  Copy, 
  Check, 
  Image, 
  Sparkles,
  Palette,
  ChevronDown,
  ChevronUp,
  Camera,
  RefreshCw,
  Move,
  Type,
  Square,
  Layers
} from "lucide-react"
import { clsx } from "clsx"

interface ThumbnailTemplate {
  id: string
  name: string
  icon: string
  gradient: string[]
  textColor: string
  style: "modern" | "bold" | "minimal" | "gradient" | "dark"
  fontStyle: string
  shadow: boolean
}

const TEMPLATES: ThumbnailTemplate[] = [
  {
    id: "gradient-purple",
    name: "Purple Gradient",
    icon: "🎨",
    gradient: ["#667eea", "#764ba2", "#f093fb"],
    textColor: "#ffffff",
    style: "gradient",
    fontStyle: "bold",
    shadow: true
  },
  {
    id: "gradient-orange",
    name: "Sunset",
    icon: "🌅",
    gradient: ["#f093fb", "#f5576c", "#fe8c00"],
    textColor: "#ffffff",
    style: "gradient",
    fontStyle: "bold",
    shadow: true
  },
  {
    id: "dark-blue",
    name: "Dark Blue",
    icon: "🌑",
    gradient: ["#0f0c29", "#302b63", "#24243e"],
    textColor: "#ffffff",
    style: "dark",
    fontStyle: "bold",
    shadow: true
  },
  {
    id: "neon-green",
    name: "Neon",
    icon: "⚡",
    gradient: ["#000000", "#0a0a0a", "#00ff88"],
    textColor: "#00ff88",
    style: "modern",
    fontStyle: "bold",
    shadow: false
  },
  {
    id: "minimal-white",
    name: "Minimal",
    icon: "✨",
    gradient: ["#ffffff", "#f8f8f8", "#ffffff"],
    textColor: "#000000",
    style: "minimal",
    fontStyle: "normal",
    shadow: false
  },
  {
    id: "bold-red",
    name: "Bold Red",
    icon: "🔥",
    gradient: ["#ff0000", "#cc0000", "#ff3333"],
    textColor: "#ffffff",
    style: "bold",
    fontStyle: "bold",
    shadow: true
  },
  {
    id: "gradient-blue",
    name: "Ocean",
    icon: "🌊",
    gradient: ["#2193b0", "#6dd5ed", "#ffffff"],
    textColor: "#ffffff",
    style: "gradient",
    fontStyle: "bold",
    shadow: true
  },
  {
    id: "dark-purple",
    name: "Dark Purple",
    icon: "💜",
    gradient: ["#0f0c29", "#302b63", "#764ba2"],
    textColor: "#ffffff",
    style: "dark",
    fontStyle: "bold",
    shadow: true
  },
  {
    id: "hype-yellow",
    name: "Hype Yellow",
    icon: "⚡",
    gradient: ["#ffff00", "#ffcc00", "#ff9900"],
    textColor: "#000000",
    style: "bold",
    fontStyle: "bold",
    shadow: false
  },
  {
    id: "pastel-pink",
    name: "Pastel",
    icon: "🌸",
    gradient: ["#ffecd2", "#fcb69f", "#ffecd2"],
    textColor: "#000000",
    style: "minimal",
    fontStyle: "normal",
    shadow: false
  },
]

export function ThumbnailGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [fontSize, setFontSize] = useState(48)
  const [preview, setPreview] = useState(false)

  const template = TEMPLATES[selectedTemplate]

  // Draw thumbnail on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = 1280
    const height = 720

    canvas.width = width
    canvas.height = height

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    template.gradient.forEach((color, i) => {
      gradient.addColorStop(i / (template.gradient.length - 1), color)
    })
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Add decorative elements based on style
    if (template.style === "gradient") {
      // Add glow circles
      ctx.globalAlpha = 0.3
      ctx.beginPath()
      ctx.arc(width * 0.8, height * 0.2, 200, 0, Math.PI * 2)
      ctx.fillStyle = "#ffffff"
      ctx.fill()
      ctx.beginPath()
      ctx.arc(width * 0.2, height * 0.8, 150, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }

    if (template.style === "dark") {
      // Add subtle grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)"
      ctx.lineWidth = 1
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }
    }

    // Set text styles
    const fontFamily = template.fontStyle === "bold" ? "Arial Black, sans-serif" : "Arial, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Draw title
    if (title) {
      // Shadow
      if (template.shadow) {
        ctx.shadowColor = "rgba(0,0,0,0.5)"
        ctx.shadowBlur = 20
        ctx.shadowOffsetX = 5
        ctx.shadowOffsetY = 5
      }

      // Main text
      ctx.fillStyle = template.textColor
      ctx.font = `${fontSize}px ${fontFamily}`
      ctx.fillText(title.toUpperCase(), width / 2, height / 2 - (subtitle ? 30 : 0))
    }

    // Draw subtitle
    if (subtitle) {
      ctx.font = `${fontSize * 0.5}px ${fontFamily}`
      ctx.fillStyle = template.textColor
      ctx.globalAlpha = 0.9
      ctx.fillText(subtitle, width / 2, height / 2 + fontSize * 0.6)
      ctx.globalAlpha = 1
    }

    // Add "REELSCRIPT" watermark
    ctx.font = "16px Arial, sans-serif"
    ctx.fillStyle = "rgba(255,255,255,0.5)"
    ctx.textAlign = "right"
    ctx.fillText("Made with ReelScript", width - 20, height - 20)
    ctx.textAlign = "center"

    // Reset shadow
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

  }, [template, title, subtitle, fontSize])

  const downloadThumbnail = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `thumbnail-${Date.now()}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const copyToClipboard = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png")
      })
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold">🖼️ AI Thumbnail Generator</p>
            <p className="text-xs text-muted-foreground">Create viral thumbnails in seconds</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-violet-500/20 text-violet-400 border-0">✨ AI</Badge>
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>

      {expanded && (
        <Card className="p-6 bg-card border-violet-500/20 space-y-6">
          {/* Template Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium">Templates</span>
              </div>
              <span className="text-xs text-muted-foreground">{TEMPLATES.length} styles</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {TEMPLATES.map((t, index) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(index)}
                  className={clsx(
                    "relative h-16 rounded-lg overflow-hidden transition-all hover:scale-105",
                    selectedTemplate === index 
                      ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-card scale-105" 
                      : "hover:ring-2 hover:ring-violet-500/50"
                  )}
                >
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${t.gradient.join(", ")})`
                    }}
                  />
                  {selectedTemplate === index && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1 text-xs">{t.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Type className="h-4 w-4" />
                Title
              </label>
              <Input
                placeholder="Your catchy title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-muted border-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Subtitle
              </label>
              <Input
                placeholder="Supporting text..."
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="bg-muted border-border"
              />
            </div>
          </div>

          {/* Font Size Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Move className="h-4 w-4" />
                Title Size
              </span>
              <span className="text-xs text-muted-foreground">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="80"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Preview</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreview(!preview)}
                className="text-xs"
              >
                {preview ? "Hide" : "Show"} Full Preview
              </Button>
            </div>
            <div className={clsx(
              "relative overflow-hidden rounded-xl border border-border bg-muted",
              preview ? "w-full" : "max-w-md mx-auto"
            )}>
              <canvas
                ref={canvasRef}
                className={clsx(
                  "w-full h-auto",
                  preview ? "aspect-video" : "aspect-video"
                )}
                style={{ maxHeight: preview ? "500px" : "300px" }}
              />
              {!title && !subtitle && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <p className="text-muted-foreground text-sm">Enter title above</p>
                </div>
              )}
            </div>
          </div>

          {/* Download Actions */}
          <div className="flex gap-3">
            <Button
              onClick={downloadThumbnail}
              className="flex-1 gap-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </Button>
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setTitle("")
                setSubtitle("")
              }}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          {/* Tips */}
          <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="font-medium text-violet-400">Pro Tips:</span>
              Keep titles short (3-5 words), use bold contrast, and make it readable even at small sizes.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
