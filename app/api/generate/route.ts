import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const TONE_MAP: Record<string, string> = {
  storytelling: "Storytelling",
  educational: "Educational",
  funny: "Funny/Humor",
  hype: "Hype/Exciting",
  emotional: "Emotional",
  motivational: "Motivational",
}

const LANG_MAP: Record<string, { name: string; instruction: string }> = {
  en: { name: "English", instruction: "Write in English only" },
  hi: { name: "Hindi", instruction: "Write in pure Hindi (Devanagari script)" },
  hinglish: { name: "Hinglish", instruction: "Write in Hinglish (mix of Hindi + English)" },
  te: { name: "Telugu", instruction: "Write in pure Telugu script" },
  te_hinglish: { name: "Telugu Hinglish", instruction: "Write in Telugu Hinglish (mix of Telugu + English words)" },
  ta: { name: "Tamil", instruction: "Write in Tamil script" },
  bn: { name: "Bengali", instruction: "Write in Bengali script" },
  mr: { name: "Marathi", instruction: "Write in Marathi script" },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, tone, duration } = body
    const language = request.headers.get("x-language") || "en"
    const userId = request.headers.get("x-user-id")

    if (!topic || !tone || !duration) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey || apiKey === 'gsk_your_groq_api_key_here') {
      return NextResponse.json({ message: "Please add GROQ_API_KEY in .env.local" }, { status: 500 })
    }

    const groq = new Groq({ apiKey })
    const toneLabel = TONE_MAP[tone] || tone
    const langConfig = LANG_MAP[language] || LANG_MAP.en
    const durationNum = parseInt(duration) || 60

    const systemPrompt = "You are an expert viral content creator for " + langConfig.name + ". " + 
      langConfig.instruction + ". " +
      "IMPORTANT: Create a DETAILED script for EXACTLY " + duration + " seconds. " +
      "For 60s script: write 150-200 words with 3 main points. " +
      "For 90s script: write 250-300 words with 4 main points. " +
      "For 30s script: write 60-80 words with 1 main point. " +
      "Structure: " +
      "[0-" + Math.floor(durationNum * 0.05) + "s] HOOK - Attention grabbing opening " +
      "[" + Math.floor(durationNum * 0.05) + "-" + Math.floor(durationNum * 0.15) + "s] INTRO - Introduce topic " +
      "[" + Math.floor(durationNum * 0.15) + "-" + Math.floor(durationNum * 0.85) + "s] MAIN - " + 
      (durationNum >= 60 ? "3 key points with examples and explanations" : "1 key point explained") + " " +
      "[" + Math.floor(durationNum * 0.85) + "-" + durationNum + "s] CTA - Call to action. " +
      "Return ONLY valid JSON: " +
      '{"hooks":["hook1","hook2","hook3"],"script":"DETAILED script for ' + duration + ' seconds in ' + langConfig.name + ' with timing markers [0-5s], [5-10s] etc","captions":[{"style":"Viral Hook","text":"caption in ' + langConfig.name + '","engagement":"High","emojis":["x"],"color":"#f00"},{"style":"Storytelling","text":"caption","engagement":"Medium","emojis":["x"],"color":"#00f"},{"style":"Quick Tips","text":"caption","engagement":"High","emojis":["x"],"color":"#0f0"},{"style":"FOMO","text":"caption","engagement":"Very High","emojis":["x"],"color":"#ff0"},{"style":"Q&A","text":"caption","engagement":"High","emojis":["x"],"color":"#0ff"}],"hashtagsNiche":["' + topic.split(' ').slice(0, 3).join(' ') + ' tips","' + topic.split(' ').slice(0, 2).join(' ') + ' guide","' + topic.split(' ')[0] + ' hacks"],"hashtagsTrending":["viral","reels","trending","fyp","india"]}'

    const userMessage = "Write a DETAILED " + duration + " second script about: " + topic + ". Tone: " + toneLabel + ". Language: " + langConfig.name + ". Make it long enough for " + duration + " seconds!"

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 4096,
    })

    const responseText = chatCompletion.choices[0]?.message?.content || ''
    
    let scriptData
    try {
      const cleaned = responseText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .replace(/[\x00-\x1F\x7F]/g, ' ')
        .trim()
      
      const jsonStart = cleaned.indexOf('{')
      const jsonEnd = cleaned.lastIndexOf('}') + 1
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const jsonStr = cleaned.substring(jsonStart, jsonEnd)
        scriptData = JSON.parse(jsonStr)
      } else {
        throw new Error('No JSON found')
      }
    } catch (parseError) {
      console.error('Parse error:', responseText.substring(0, 300))
      return NextResponse.json({ message: 'AI returned invalid format. Try again.' }, { status: 500 })
    }

    const hashtags = [
      ...(scriptData.hashtagsNiche || []),
      ...(scriptData.hashtagsTrending || []),
      "contentcreator", "reelsinstagram", "viralcontent"
    ].map(t => '#' + t.replace(/^#/, '')).join(' ')

    scriptData.hashtags = hashtags

    if (userId) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        await supabase.from('scripts').insert({
          user_id: userId,
          topic,
          tone,
          duration: parseInt(duration),
          hooks: scriptData.hooks,
          script: scriptData.script,
          caption: scriptData.captions?.[0]?.text || '',
          hashtags: scriptData.hashtags,
        })
      } catch (dbError) {
        console.error('Database error:', dbError)
      }
    }

    return NextResponse.json({
      success: true,
      data: scriptData,
      language: langConfig.name,
      duration: durationNum,
    })

  } catch (error: any) {
    console.error('Script generation error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to generate script. Please try again.' },
      { status: 500 }
    )
  }
}
