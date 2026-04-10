import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const MAX_FREE_ACCOUNTS_PER_IP = 2

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (userError) {
      return NextResponse.json(
        { message: "User not found. Please sign up first." },
        { status: 401 }
      )
    }

    const { data: ipData } = await supabaseAdmin
      .from('ip_tracker')
      .select('user_id')
      .eq('ip_address', ip)

    const accountCount = ipData?.length || 0
    
    // Get user's subscription status
    const isPro = userData.is_pro === true || userData.is_lifetime === true
    
    // Block only if: NOT subscribed AND has more than allowed free accounts
    if (!isPro && accountCount >= MAX_FREE_ACCOUNTS_PER_IP) {
      return NextResponse.json(
        { message: "Maximum free accounts reached from this device. Please upgrade to Pro to continue." },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        is_pro: userData.is_pro,
        scripts_used: userData.scripts_used,
        scripts_limit: userData.scripts_limit,
        is_lifetime: userData.is_lifetime || false,
      }
    })

  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json(
      { message: error.message || "Failed to login" },
      { status: 500 }
    )
  }
}
