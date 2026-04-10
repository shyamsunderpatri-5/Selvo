"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingCard } from "@/components/pricing-card"
import { Card } from "@/components/ui/card"
import { Check, X, MessageCircle, Headphones } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Simple, transparent <span className="text-gradient">pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Free se shuru karo. Jab zarurat ho, upgrade karo. Koi hidden fees nahi!
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <PricingCard
              tier="free"
              price="₹0"
              title="Free"
              description="Try karne ke liye perfect"
              features={[
                "3 scripts per day",
                "Basic viral hooks",
                "Standard quality",
                "English & Hindi output",
                "Copy to clipboard",
                "Mobile responsive",
              ]}
              ctaText="Free Shuru Karo"
              ctaHref="/signup"
            />
            
            <PricingCard
              tier="pro"
              price="₹99"
              title="Pro"
              description="Daily creators ke liye"
              highlighted
              badge="BEST VALUE"
              features={[
                "Unlimited scripts",
                "Premium viral hooks",
                "English & Hindi",
                "Priority AI speed",
                "All tones & durations",
                "Caption + Hashtags",
                "Trending Audio",
                "Thumbnail Ideas",
              ]}
              ctaText="Pro Bano"
              ctaHref="/signup?plan=pro"
            />
          </div>

          {/* Payment Methods */}
          <div className="text-center mb-16">
            <p className="text-sm text-muted-foreground mb-4">
              Saare payment methods accept karte hain
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="px-4 py-2 rounded-lg bg-muted text-sm font-medium">
                UPI
              </div>
              <div className="px-4 py-2 rounded-lg bg-muted text-sm font-medium">
                Credit Card
              </div>
              <div className="px-4 py-2 rounded-lg bg-muted text-sm font-medium">
                Debit Card
              </div>
              <div className="px-4 py-2 rounded-lg bg-muted text-sm font-medium">
                NetBanking
              </div>
              <div className="px-4 py-2 rounded-lg bg-muted text-sm font-medium">
                Wallet
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Secured by Razorpay 🔒
            </p>
          </div>

          {/* Comparison Table */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              Plans compare karo
            </h2>
            
            <Card className="overflow-hidden bg-card border-border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium">Feature</th>
                      <th className="text-center p-4 font-medium">Free</th>
                      <th className="text-center p-4 font-medium bg-purple-500/10">Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Daily scripts", free: "3", pro: "Unlimited", highlight: true },
                      { name: "Hook options", free: "1", pro: "3", highlight: true },
                      { name: "Language", free: "English + Hindi", pro: "Both", highlight: false },
                      { name: "Tone options", free: "3", pro: "5", highlight: false },
                      { name: "Duration options", free: "2", pro: "3", highlight: false },
                      { name: "Caption generation", free: false, pro: true, highlight: false },
                      { name: "Hashtag count", free: "15", pro: "30+", highlight: false },
                      { name: "Trending Audio", free: false, pro: true, highlight: false },
                      { name: "B-Roll suggestions", free: false, pro: true, highlight: false },
                      { name: "AI speed", free: "Standard", pro: "Priority", highlight: false },
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-border last:border-0">
                        <td className="p-4 text-sm">{row.name}</td>
                        <td className="p-4 text-center text-sm">
                          {typeof row.free === "boolean" ? (
                            row.free ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-muted-foreground">{row.free}</span>
                          )}
                        </td>
                        <td className="p-4 text-center text-sm bg-purple-500/5">
                          {typeof row.pro === "boolean" ? (
                            row.pro ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="font-medium">{row.pro}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              FAQs
            </h2>
            
            <div className="space-y-4">
              {[
                {
                  q: "Cancel anytime kar sakte hain?",
                  a: "Haan! Kabhi bhi cancel kar sakte ho. Koi question nahi, koi hidden fees nahi."
                },
                {
                  q: "Payment kaise kar sakte hain?",
                  a: "UPI (GPay, PhonePe, Paytm), Credit Cards, Debit Cards, NetBanking accept karte hain Razorpay ke through."
                },
                {
                  q: "Refund policy hai?",
                  a: "Haan, 7 din ka money-back guarantee hai. Agar satisfied nahi ho, full refund milega."
                },
                {
                  q: "Free tier ke liye credit card chahiye?",
                  a: "Nahin! Free tier ke liye koi credit card nahi chahiye. Sirf email se signup karo."
                },
              ].map((faq, index) => (
                <Card key={index} className="p-6 bg-card border-border">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <Headphones className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Help chahiye?</h3>
              <p className="text-muted-foreground mb-4">
                Answer nahi mila? Hamari support team madad ke liye ready hai.
              </p>
              <a href="mailto:support@selvo.in">
                <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity">
                  Contact Support
                </button>
              </a>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
