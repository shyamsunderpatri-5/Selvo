import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'
import nodemailer from 'nodemailer'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const RESET_CODE_EXPIRY = 15 * 60 * 1000 // 15 minutes

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  }
})

async function sendResetEmail(email: string, code: string) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log("Gmail not configured. Code:", code)
    return true
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  await transporter.sendMail({
    from: `"Selvo.ai" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Reset your Selvo.ai password',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #9333ea;">Reset your password</h2>
        <p>Your verification code is:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #9333ea;">
          ${code}
        </div>
        <p style="color: #6b7280; font-size: 14px;">This code expires in 15 minutes.</p>
        <p style="color: #6b7280; font-size: 14px;">If you didn't request this, ignore this email.</p>
      </div>
    `
  })
}

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

      // Send email
      await sendResetEmail(email.toLowerCase(), code)

      return NextResponse.json({ message: "Code sent to your email" })
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