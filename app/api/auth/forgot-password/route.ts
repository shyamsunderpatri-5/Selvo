import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Check if user exists
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single()

    if (!user) {
      // Don't reveal if email exists or not
      return NextResponse.json({ 
        message: "If that email exists, we've sent a reset link" 
      })
    }

    // Send password reset email via Supabase Auth
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(
      email.toLowerCase(),
      {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      }
    )

    if (error) {
      console.error("Password reset error:", error)
      return NextResponse.json({ 
        message: "If that email exists, we've sent a reset link" 
      })
    }

    return NextResponse.json({ 
      message: "If that email exists, we've sent a reset link" 
    })

  } catch (error: any) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ 
      message: "If that email exists, we've sent a reset link" 
    }, { status: 500 })
  }
}