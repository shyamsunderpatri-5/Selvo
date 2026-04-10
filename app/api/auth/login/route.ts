import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

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
