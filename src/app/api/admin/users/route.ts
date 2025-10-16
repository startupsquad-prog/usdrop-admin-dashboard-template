import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { UserTableResponse } from '@/types/user'

export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const search = searchParams.get('search') || ''
    const roleFilter = searchParams.get('role')
    const planFilter = searchParams.get('plan')

    // Create service role client for admin operations
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get all users from auth.users (admin only)
    const { data: authUsers, error: authUsersError } = await serviceSupabase.auth.admin.listUsers()
    
    if (authUsersError) {
      console.error('Error fetching auth users:', authUsersError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Build Supabase query with filters
    let query = serviceSupabase
      .from('profile')
      .select('*', { count: 'exact' })

    // Apply role filter
    if (roleFilter) {
      query = query.eq('role_id', roleFilter)
    }

    // Apply plan filter  
    if (planFilter) {
      query = query.eq('plan', planFilter)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Execute query to get all profiles first
    const { data: allProfiles, error: profilesError, count } = await query

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    // Combine auth users with profiles and apply search filter
    let combinedUsers = allProfiles?.map(profile => {
      const authUser = authUsers.users.find(au => au.id === profile.id)
      return {
        id: profile.id,
        full_name: profile.full_name || 'No name',
        role_id: profile.role_id || 'client',
        plan: profile.plan || 'free',
        created_at: authUser?.created_at || profile.created_at,
        updated_at: profile.updated_at,
        email: authUser?.email || 'No email'
      }
    }) || []

    // Apply search filter after combining data
    if (search) {
      const searchLower = search.toLowerCase()
      combinedUsers = combinedUsers.filter(user => 
        user.full_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      )
    }

    // Apply pagination after filtering
    const totalCount = combinedUsers.length
    const from = (page - 1) * pageSize
    const to = from + pageSize
    const paginatedUsers = combinedUsers.slice(from, to)

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / pageSize)

    const response: UserTableResponse = {
      users: paginatedUsers,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalCount
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
