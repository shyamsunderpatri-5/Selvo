"use client"

import { Card } from "@/components/ui/card"
import { 
  Zap, 
  Sparkles, 
  Hash, 
  Copy, 
  Clock, 
  Languages,
  IndianRupee,
  Smartphone,
  Image,
  Music,
  Camera
} from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Viral Hooks",
    description: "3 scroll-stopping hooks jo 3 seconds me attention capture karein.",
  },
  {
    icon: Languages,
    title: "English + Hindi",
    description: "Dono languages me content banao - aapke audience ko pasand aayega.",
  },
  {
    icon: Hash,
    title: "30+ Hashtags",
    description: "Trending hashtags automatically generate hote hain. Sirf copy karo!",
  },
  {
    icon: Copy,
    title: "One-Click Copy",
    description: "Hooks, scripts, captions, hashtags - sab separately copy kar sakte ho.",
  },
  {
    icon: Clock,
    title: "30 to 90 Seconds",
    description: "Video duration choose karo. Perfectly timed scripts milenge.",
  },
  {
    icon: IndianRupee,
    title: "₹99/month Only",
    description: "Chai se sasta! Unlimited scripts. Free tier ke liye credit card nahi chahiye.",
  },
  {
    icon: Music,
    title: "Trending Audio",
    description: "Instagram pe trending audio suggestions automatically milte hain.",
  },
  {
    icon: Camera,
    title: "Thumbnail Maker",
    description: "Free thumbnail banao - 10 templates, koi design skill nahi chahiye!",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Sab kuchh ek jagah <span className="text-gradient">viral</span> ke liye
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Indian creators ke liye banaya gaya - bina hours lagaye engaging content banao.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 bg-card border-border hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
