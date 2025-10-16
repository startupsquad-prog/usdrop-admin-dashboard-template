import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user to verify admin access
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin using regular client
    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('role_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || !['admin', 'owner'].includes(profile.role_id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, full_name, role_id, plan } = body

    // Validate required fields
    if (!email || !password || !full_name || !role_id || !plan) {
      return NextResponse.json({ 
        error: 'Missing required fields: email, password, full_name, role_id, plan' 
      }, { status: 400 })
    }

    // Use service role client for admin operations
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Try to create user directly - if it fails due to duplicate email, handle it gracefully
    console.log('Attempting to create user with email:', email)

    // Create user in auth.users
    const { data: authUser, error: createUserError } = await serviceSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for admin-created users
      user_metadata: {
        full_name
      }
    })

    if (createUserError || !authUser.user) {
      console.error('Error creating auth user:', createUserError)
      
      // Check if it's a duplicate email error
      if (createUserError?.message?.includes('already registered') || 
          createUserError?.message?.includes('already exists') ||
          createUserError?.message?.includes('duplicate')) {
        return NextResponse.json({ 
          error: 'User with this email already exists' 
        }, { status: 400 })
      }
      
      return NextResponse.json({ 
        error: `Failed to create user account: ${createUserError?.message || 'Unknown error'}` 
      }, { status: 500 })
    }

    // Check if profile already exists (in case of race condition)
    const { data: existingProfile } = await serviceSupabase
      .from('profile')
      .select('id')
      .eq('id', authUser.user.id)
      .single()
    
    if (existingProfile) {
      console.log('Profile already exists, cleaning up auth user')
      await serviceSupabase.auth.admin.deleteUser(authUser.user.id)
      return NextResponse.json({ 
        error: 'User profile already exists' 
      }, { status: 400 })
    }

    // Create profile record
    const { data: profileData, error: createProfileError } = await serviceSupabase
      .from('profile')
      .insert({
        id: authUser.user.id,
        full_name,
        role_id,
        plan
      })
      .select()
      .single()

    if (createProfileError) {
      console.error('Error creating profile:', createProfileError)
      console.error('Profile creation details:', {
        userId: authUser.user.id,
        fullName: full_name,
        roleId: role_id,
        plan: plan
      })
      
      // Try to clean up the auth user if profile creation fails
      try {
        await serviceSupabase.auth.admin.deleteUser(authUser.user.id)
        console.log('Successfully cleaned up auth user after profile creation failure')
      } catch (cleanupError) {
        console.error('Failed to clean up auth user:', cleanupError)
      }
      
      // Check if it's a duplicate key error
      if (createProfileError.code === '23505' || createProfileError.message?.includes('duplicate key')) {
        return NextResponse.json({ 
          error: 'User profile already exists' 
        }, { status: 400 })
      }
      
      return NextResponse.json({ 
        error: `Failed to create user profile: ${createProfileError.message}` 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: authUser.user.id,
        email: authUser.user.email,
        full_name: profileData.full_name,
        role_id: profileData.role_id,
        plan: profileData.plan,
        created_at: authUser.user.created_at
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
