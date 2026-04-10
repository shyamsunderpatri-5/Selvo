"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { PricingCard } from "@/components/pricing-card"
import { FreeGenerator } from "@/components/free-generator"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        
        {/* Free Generator Section */}
        <FreeGenerator />
        
        <Features />
        
        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Simple, transparent <span className="text-gradient">pricing</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Start free. Upgrade when you need more. No hidden fees, no surprises.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <PricingCard
                tier="free"
                price="₹0"
                title="Free"
                description="Perfect for trying out and occasional creators"
                features={[
                  "3 scripts lifetime",
                  "Basic hooks",
                  "All languages",
                  "Copy to clipboard",
                ]}
                ctaText="Get Started"
                ctaHref="/signup"
              />
              
              <PricingCard
                tier="pro"
                price="₹99"
                title="Pro"
                description="For serious creators who post daily"
                highlighted
                badge="BEST VALUE"
                features={[
                  "Unlimited scripts",
                  "Premium viral hooks",
                  "All languages",
                  "Priority AI processing",
                  "All tones & durations",
                  "Caption generation",
                  "Hashtag suggestions",
                ]}
                ctaText="Get Pro Now"
                ctaHref="/signup?plan=pro"
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-purple-500/10 to-pink-500/10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to go viral?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 1,000+ Indian creators who are already creating viral content with Selvo.ai.
            </p>
            
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Common questions
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  q: "How does the free tier work?",
                  a: "You get 1 free script without login. Sign up for 3 lifetime scripts. Upgrade to Pro for unlimited access."
                },
                {
                  q: "Can I use scripts for YouTube Shorts?",
                  a: "Absolutely! Scripts are optimized for both Instagram Reels and YouTube Shorts. Just select your preferred duration."
                },
                {
                  q: "Is Hinglish output really natural?",
                  a: "Yes! Our AI is trained specifically for Indian content creators. The output sounds natural and relatable."
                },
                {
                  q: "How do I pay?",
                  a: "We accept UPI (GPay, PhonePe, Paytm), Credit/Debit cards, and NetBanking."
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Yes! Cancel anytime from your dashboard. No questions asked."
                },
              ].map((faq, index) => (
                <Card key={index} className="p-6 bg-card border-border">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* WhatsApp CTA */}
        <section className="py-12 bg-green-500/10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageCircle className="h-6 w-6 text-green-500" />
              <span className="text-lg font-semibold">Join our WhatsApp Channel</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Get tips, tricks, and updates directly on WhatsApp
            </p>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              Join Now
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
