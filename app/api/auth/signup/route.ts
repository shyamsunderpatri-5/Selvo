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

    const { data: existingUser, error: existingUserError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (existingUserError) {
      console.error("Check existing user error:", existingUserError)
    }

    if (existingUser) {
      console.log("Existing user in DB:", existingUser)
      return NextResponse.json({ message: "Email already registered" }, { status: 400 })
    }

    // Also check Supabase Auth - user might exist in Auth but not in our users table
    try {
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
      const authUser = authUsers?.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
      
      if (authUser) {
        console.log("Existing user in Auth:", authUser.id)
        // Sync user to our users table and allow login
        await supabaseAdmin.from('users').insert({
          id: authUser.id,
          email: email.toLowerCase(),
          name: authUser.user_metadata?.name || email.split('@')[0],
          is_pro: false,
          scripts_limit: 3,
          scripts_used: 0,
          is_lifetime: true,
        })
        
        return NextResponse.json({ 
          message: "Account synced. Please login." ,
          needsLogin: true
        }, { status: 400 })
      }
    } catch (authError) {
      console.error("Auth check error:", authError)
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
      const { error: insertError } = await supabaseAdmin.from('users').insert({
        id: authData.user.id,
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        is_pro: false,
        scripts_limit: 3,
        scripts_used: 0,
        is_lifetime: true,
      })

      if (insertError) {
        console.error("User insert error:", insertError)
        return NextResponse.json({ message: "Failed to create user: " + insertError.message }, { status: 500 })
      }

      await supabaseAdmin.from('ip_tracker').insert({
        user_id: authData.user.id,
        ip_address: ip,
      })
    }

    return NextResponse.json({ success: true, user: authData.user, redirectToLogin: true })

  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: error.message || "Signup failed" }, { status: 500 })
  }
}
