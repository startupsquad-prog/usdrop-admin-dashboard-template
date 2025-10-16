"use client"

import { TrendingUp, Users, UserCheck, UserX, Crown, Shield, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createSupabaseBrowser } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { UsersDataTable } from "@/components/admin/users-data-table"
import { QuickLogin } from "@/components/quick-login"
import { DataTableFilterTabs } from "@/components/admin/data-table/data-table-filter-tabs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AdminBreadcrumb } from "@/components/admin-breadcrumb"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    total: 0,
    free: 0,
    pro: 0,
    enterprise: 0,
    admins: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createSupabaseBrowser()
        
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          router.push('/signin')
          return
        }

        setUser(user)

        // Fetch admin stats and profile from API route
        const response = await fetch('/api/admin/stats')
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/signin')
            return
          }
          if (response.status === 403) {
            router.push('/dashboard')
            return
          }
          throw new Error('Failed to fetch admin data')
        }

        const { stats: statsData, profile: profileData } = await response.json()
        
        setProfile(profileData)
        setStats(statsData)
      } catch (error) {
        console.error('Error in AdminPage:', error)
        router.push('/signin')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Quick Login for Testing */}
      <QuickLogin />
      
      {/* Header */}
      <header className="border-b border-border flex-shrink-0">
        <div className="flex items-center gap-4 px-4 py-4">
          <SidebarTrigger />
          <div className="flex-1">
            <AdminBreadcrumb />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground font-sans">
              Welcome, {profile?.full_name || user.email} (Admin)
            </span>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <Settings className="size-4 mr-2" />
                User Dashboard
              </Button>
            </Link>
            <form action="/auth/signout" method="post">
              <Button variant="outline" size="sm" type="submit">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 flex-1 flex flex-col overflow-hidden">

        {/* User Management Title */}
        <div className="mb-2">
          <h3 className="text-2xl font-bold tracking-tight">User Management</h3>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and subscription plans with advanced filtering and sorting
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-3 flex-shrink-0">
          <Card className="py-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-2">
              <CardTitle className="text-xs font-medium">Total Users</CardTitle>
              <Users className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-2">
              <div className="text-lg font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All registered users
              </p>
            </CardContent>
          </Card>

          <Card className="py-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-2">
              <CardTitle className="text-xs font-medium">Free Users</CardTitle>
              <UserCheck className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-2">
              <div className="text-lg font-bold">{stats.free}</div>
              <p className="text-xs text-muted-foreground">
                Free plan users
              </p>
            </CardContent>
          </Card>

          <Card className="py-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-2">
              <CardTitle className="text-xs font-medium">Pro Users</CardTitle>
              <Crown className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-2">
              <div className="text-lg font-bold">{stats.pro}</div>
              <p className="text-xs text-muted-foreground">
                Pro plan users
              </p>
            </CardContent>
          </Card>

          <Card className="py-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-2">
              <CardTitle className="text-xs font-medium">Enterprise</CardTitle>
              <Shield className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-2">
              <div className="text-lg font-bold">{stats.enterprise}</div>
              <p className="text-xs text-muted-foreground">
                Enterprise users
              </p>
            </CardContent>
          </Card>

          <Card className="py-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-2">
              <CardTitle className="text-xs font-medium">Admins</CardTitle>
              <Shield className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-3 pb-2">
              <div className="text-lg font-bold">{stats.admins}</div>
              <p className="text-xs text-muted-foreground">
                Admin users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="mb-2">
          <DataTableFilterTabs 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />
        </div>

        {/* User Management */}
        <div className="flex-1 overflow-hidden">
          <UsersDataTable activeFilter={activeFilter} />
        </div>
      </main>
    </div>
  )
}
