"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Sparkles } from "lucide-react"

interface ScriptFormProps {
  onGenerate: (data: { topic: string; tone: string; duration: string }) => Promise<void>
  isLoading: boolean
  disabled?: boolean
}

export function ScriptForm({ onGenerate, isLoading, disabled }: ScriptFormProps) {
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("storytelling")
  const [duration, setDuration] = useState("60")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return
    await onGenerate({ topic, tone, duration })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Topic Input - Bigger Box */}
      <div className="space-y-2">
        <Input
          placeholder="Kya baat kar rahe ho? (e.g., 5 tips for glowing skin)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="h-14 text-base bg-card border-border focus:border-purple-500"
          disabled={disabled || isLoading}
          required
        />
      </div>

      {/* Tone and Duration - Side by Side */}
      <div className="grid grid-cols-2 gap-3">
        <Select value={tone} onValueChange={setTone} disabled={disabled || isLoading}>
          <SelectTrigger className="h-11 bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="storytelling">📖 Story</SelectItem>
            <SelectItem value="educational">📚 Education</SelectItem>
            <SelectItem value="funny">😄 Funny</SelectItem>
            <SelectItem value="hype">🔥 Hype</SelectItem>
            <SelectItem value="motivational">💪 Motivation</SelectItem>
          </SelectContent>
        </Select>

        <Select value={duration} onValueChange={setDuration} disabled={disabled || isLoading}>
          <SelectTrigger className="h-11 bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">⏱️ 30 sec</SelectItem>
            <SelectItem value="60">⏱️ 60 sec</SelectItem>
            <SelectItem value="90">⏱️ 90 sec</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all duration-200 disabled:opacity-50"
        disabled={disabled || isLoading || !topic.trim()}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Generate ho raha hai...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Generate Viral Script
          </>
        )}
      </Button>
    </form>
  )
}
