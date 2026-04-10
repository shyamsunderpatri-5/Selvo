import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const MAX_FREE_ACCOUNTS_PER_IP = 2

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 })
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 })
    }

    const { data: ipUsers } = await supabaseAdmin
      .from('ip_tracker')
      .select('*')
      .eq('ip_address', ip)

    const freeAccountCount = (ipUsers?.length || 0)
    
    if (freeAccountCount >= MAX_FREE_ACCOUNTS_PER_IP) {
      return NextResponse.json({ 
        message: "Maximum free accounts reached from this device. Please upgrade to Pro." 
      }, { status: 403 })
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { name: name || email.split('@')[0] }
    })

    if (authError) {
      return NextResponse.json({ message: authError.message }, { status: 400 })
    }

    if (authData.user) {
        await supabaseAdmin.from('users').insert({
        id: authData.user.id,
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        is_pro: false,
        scripts_limit: 3,
        scripts_used: 0,
        is_lifetime: true,
      })

      await supabaseAdmin.from('ip_tracker').insert({
        user_id: authData.user.id,
        ip_address: ip,
      })
    }

    return NextResponse.json({ success: true, user: authData.user })

  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: error.message || "Signup failed" }, { status: 500 })
  }
}
