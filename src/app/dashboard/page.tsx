import { TrendingUp, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Topbar } from "@/components/topbar"
import { QuickLogin } from "@/components/quick-login"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/signin')
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Profile error:', profileError)
    // If profile doesn't exist, redirect to signup or show error
    if (profileError.code === 'PGRST116') {
      console.log('Profile not found for user:', user.id)
      // You might want to redirect to a profile setup page
    }
  }

  // Redirect admins to admin portal
  if (profile && ['admin', 'owner'].includes(profile.role_id)) {
    console.log('Admin user detected, redirecting to /admin')
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Quick Login for Testing */}
      <QuickLogin />
      
      {/* Header */}
      <Topbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-sans mb-2">Dashboard</h1>
          <p className="text-muted-foreground font-sans">
            Welcome to your USDrop AI dashboard. Here's your account overview.
          </p>
          
          {/* Debug Info */}
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium mb-2">Debug Info:</h3>
            <div className="text-xs space-y-1">
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {profile?.role_id || 'Loading...'}</p>
              <p><strong>Plan:</strong> {profile?.plan || 'Loading...'}</p>
              <p><strong>Full Name:</strong> {profile?.full_name || 'Not set'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm font-medium">Name:</span>
                <p className="text-sm text-muted-foreground">
                  {profile?.full_name || 'Not set'}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Email:</span>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Plan:</span>
                <p className="text-sm text-muted-foreground capitalize">
                  {profile?.plan || 'free'}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Role:</span>
                <p className="text-sm text-muted-foreground capitalize">
                  {profile?.role_id || 'client'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                View Products
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Research Trends
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>
                Your subscription and usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Verified:</span>
                <span className={`text-sm ${user.email_confirmed_at ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user.email_confirmed_at ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Member Since:</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
