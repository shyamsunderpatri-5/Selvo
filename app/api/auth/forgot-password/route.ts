import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const RESET_CODE_EXPIRY = 15 * 60 * 1000 // 15 minutes

export async function POST(request: NextRequest) {
  try {
    const { email, action } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Generate reset code
    if (action === 'generate') {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .single()

      if (!user) {
        return NextResponse.json({ message: "Code sent to your email" })
      }

      // Generate 6-digit code
      const code = randomBytes(3).toString('hex').toUpperCase()
      
      // Store code in DB
      await supabaseAdmin.from('password_resets').insert({
        user_id: user.id,
        code: code,
        expires_at: new Date(Date.now() + RESET_CODE_EXPIRY).toISOString()
      })

      // In production, send via email. For now, return code for testing
      // TODO: Integrate with email service
      console.log("Password reset code for", email, ":", code)

      return NextResponse.json({ 
        message: "Code sent to your email",
        // Remove this in production
        devCode: code 
      })
    }

    // Verify code and reset password
    if (action === 'reset') {
      const { code, newPassword } = await request.json()

      if (!code || !newPassword) {
        return NextResponse.json({ message: "Code and new password required" }, { status: 400 })
      }

      // Find valid reset code
      const { data: reset } = await supabaseAdmin
        .from('password_resets')
        .select('id, user_id, expires_at')
        .eq('code', code.toUpperCase())
        .gt('expires_at', new Date().toISOString())
        .single()

      if (!reset) {
        return NextResponse.json({ message: "Invalid or expired code" }, { status: 400 })
      }

      // Update user password in Supabase Auth
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        reset.user_id,
        { password: newPassword }
      )

      if (authError) {
        console.error("Auth update error:", authError)
        return NextResponse.json({ message: "Failed to reset password" }, { status: 500 })
      }

      // Delete used code
      await supabaseAdmin.from('password_resets').delete().eq('id', reset.id)

      return NextResponse.json({ message: "Password reset successfully" })
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 })

  } catch (error: any) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}