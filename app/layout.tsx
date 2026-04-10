import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Selvo.ai - AI Content Generator for Indian Creators',
  description: 'Generate viral scripts, captions, hashtags & thumbnails. Topic daalo, content ready — viral hooo! Made in India.',
  keywords: 'ai content generator, hindi script, hinglish, youtube shorts, instagram reels, content creator, viral script',
  openGraph: {
    title: 'Selvo.ai - AI Content Generator',
    description: 'Generate viral content in seconds. Made for Indian creators.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
