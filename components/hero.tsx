"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">
              Made for Indian Creators 🇮🇳
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in-delay-1">
            AI Content Generator{" "}
            <span className="text-gradient">in Seconds</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-delay-2">
            Topic daalo → Content ready → Viral hooo!
            <br />
            Scripts, Captions, Hashtags & Thumbnails — sab kuchh ek jagah!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-3">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                <Sparkles className="h-5 w-5 mr-2" />
                Shuru Karo Free
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                <Play className="h-5 w-5 mr-2" />
                Demo Dekho
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-12 animate-fade-in-delay-4">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by <span className="font-semibold text-foreground">1,000+</span> Indian creators
            </p>
            <div className="flex items-center justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                +995 creators
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
