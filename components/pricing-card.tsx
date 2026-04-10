"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Zap, Crown } from "lucide-react"
import Link from "next/link"

interface PricingCardProps {
  tier: "free" | "pro"
  price: string
  title: string
  description: string
  features: string[]
  highlighted?: boolean
  badge?: string
  ctaText: string
  ctaHref: string
}

export function PricingCard({
  tier,
  price,
  title,
  description,
  features,
  highlighted = false,
  badge,
  ctaText,
  ctaHref,
}: PricingCardProps) {
  const Icon = tier === "pro" ? Crown : Zap

  return (
    <Card 
      className={clsx(
        "relative overflow-hidden transition-all duration-300",
        highlighted 
          ? "border-purple-500 shadow-lg shadow-purple-500/20 scale-105" 
          : "border-border hover:border-purple-500/50"
      )}
    >
      {highlighted && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
      )}
      
      <CardHeader className="text-center pb-2">
        {badge && (
          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            {badge}
          </Badge>
        )}
        
        <div className={clsx(
          "mx-auto mb-4 p-3 rounded-full",
          highlighted ? "bg-gradient-to-br from-purple-500 to-pink-500" : "bg-muted"
        )}>
          <Icon className={clsx(
            "h-6 w-6",
            highlighted ? "text-white" : "text-muted-foreground"
          )} />
        </div>
        
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="text-center">
        <div className="mb-6">
          <span className="text-5xl font-bold">{price}</span>
          {price !== "₹0" && (
            <span className="text-muted-foreground">/month</span>
          )}
        </div>
        
        <ul className="space-y-3 text-left">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <Check className={clsx(
                "h-5 w-5 flex-shrink-0 mt-0.5",
                highlighted ? "text-purple-400" : "text-green-500"
              )} />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Link href={ctaHref} className="w-full">
          <Button 
            className="w-full" 
            size="lg"
            variant={highlighted ? "default" : "outline"}
          >
            {highlighted && <Sparkles className="h-4 w-4 mr-2" />}
            {ctaText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

// Helper for clsx
function clsx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ")
}
