# Selvo.ai - AI Content Generator for Indian Creators

> Topic daalo → Content ready → Viral hooo!

An AI-powered SaaS application for Indian content creators to generate viral scripts, captions, hashtags, thumbnails, and more for Instagram Reels and YouTube Shorts.

## Features

- 🎬 **Script Generation** - AI-powered script generation in seconds
- 🎣 **Viral Hooks** - 3 scroll-stopping hook options
- 🇮🇳 **Hinglish Native** - Natural Hindi-in-English content
- 📝 **Auto Captions** - Readymade captions with emojis
- #️⃣ **Hashtags** - 30+ trending hashtags
- ⏱️ **Multiple Durations** - 30s, 60s, or 90s scripts
- 🎭 **Tone Selection** - Funny, Educational, Hype, Emotional, Motivational
- 💳 **UPI Payments** - Accepts all Indian payment methods

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4 / Google Gemini
- **Payments**: Razorpay
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key (or use built-in mock)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd reelscript

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Fill in your values in .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase/schema.sql` in your SQL Editor
3. Get your Supabase URL and keys
4. Add them to `.env.local`

### AI Setup (Optional)

The app works with mock responses by default. To use real AI:

1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com)
2. Or use Google Gemini (update the API route)
3. Add the key to `.env.local`

## Project Structure

```
reelscript/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard (logged in)
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── signup/
│   │   └── page.tsx          # Signup page
│   ├── pricing/
│   │   └── page.tsx          # Pricing page
│   └── api/
│       └── generate/
│           └── route.ts      # Script generation API
├── components/
│   ├── ui/                   # Shadcn/UI components
│   ├── header.tsx            # Header component
│   ├── footer.tsx            # Footer component
│   ├── hero.tsx              # Hero section
│   ├── features.tsx          # Features section
│   ├── pricing-card.tsx      # Pricing card
│   ├── script-form.tsx       # Script input form
│   └── script-output.tsx    # Script output display
├── supabase/
│   └── schema.sql            # Database schema
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# OpenAI (optional)
OPENAI_API_KEY=your_openai_key

# Razorpay (for payments)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS
- Google Cloud

## Roadmap

- [x] MVP with mock AI
- [ ] Real AI integration (OpenAI/Gemini)
- [ ] Razorpay payment integration
- [ ] Email authentication
- [ ] Script history
- [ ] Save templates
- [ ] Multi-language support (Tamil, Telugu)
- [ ] Browser extension
- [ ] Mobile app

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

---

Made with ❤️ in India for Indian creators
