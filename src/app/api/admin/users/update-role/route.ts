import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
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
    const { userId, newRole } = body

    if (!userId || !newRole) {
      return NextResponse.json({ 
        error: 'User ID and new role are required' 
      }, { status: 400 })
    }

    // Validate role
    if (!['client', 'admin', 'owner'].includes(newRole)) {
      return NextResponse.json({ 
        error: 'Invalid role. Must be client, admin, or owner' 
      }, { status: 400 })
    }

    // Use service role client for admin operations
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Update user role in profile table
    const { data: updatedProfile, error: updateError } = await serviceSupabase
      .from('profile')
      .update({ role_id: newRole })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating user role:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update user role' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      user: updatedProfile,
      message: 'User role updated successfully' 
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
