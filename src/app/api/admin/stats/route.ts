import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
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

    // Get all users for admin view using service role
    let stats = {
      total: 0,
      free: 0,
      pro: 0,
      enterprise: 0,
      admins: 0
    }

    try {
      // Use service role client for admin operations
      const serviceSupabase = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      // Get all profiles using service role
      const { data: profiles, error: profilesError } = await serviceSupabase
        .from('profile')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError)
        // Fallback to current user only
        const { data: fallbackUsers } = await supabase
          .from('profile')
          .select('*')
          .eq('id', user.id)

        stats = {
          total: fallbackUsers?.length || 0,
          free: fallbackUsers?.filter(u => u.plan === 'free').length || 0,
          pro: fallbackUsers?.filter(u => u.plan === 'pro').length || 0,
          enterprise: fallbackUsers?.filter(u => u.plan === 'enterprise').length || 0,
          admins: fallbackUsers?.filter(u => ['admin', 'owner'].includes(u.role_id)).length || 0
        }
      } else {
        // Calculate stats from all profiles
        console.log('Profiles fetched:', profiles?.length || 0)
        stats = {
          total: profiles?.length || 0,
          free: profiles?.filter(u => u.plan === 'free').length || 0,
          pro: profiles?.filter(u => u.plan === 'pro').length || 0,
          enterprise: profiles?.filter(u => u.plan === 'enterprise').length || 0,
          admins: profiles?.filter(u => ['admin', 'owner'].includes(u.role_id)).length || 0
        }
        console.log('Calculated stats:', stats)
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      // Final fallback
      stats = {
        total: 0,
        free: 0,
        pro: 0,
        enterprise: 0,
        admins: 0
      }
    }

    return NextResponse.json({ stats, profile })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
