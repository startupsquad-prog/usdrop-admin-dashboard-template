import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function TestAuthFlowPage() {
  const supabase = await createClient()
  
  // Get user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Auth Error</h1>
        <pre className="bg-red-100 p-4 rounded text-xs overflow-auto">
          {JSON.stringify(authError, null, 2)}
        </pre>
      </div>
    )
  }

  if (!user) {
    redirect('/signin')
  }

  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Profile Error</h1>
        <pre className="bg-red-100 p-4 rounded text-xs overflow-auto">
          {JSON.stringify(profileError, null, 2)}
        </pre>
      </div>
    )
  }

  // Check if admin and redirect
  if (profile && ['admin', 'owner'].includes(profile.role_id)) {
    redirect('/admin')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Auth Flow Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Data</CardTitle>
            <CardDescription>Authentication user information</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify({
                id: user.id,
                email: user.email,
                email_confirmed_at: user.email_confirmed_at,
                created_at: user.created_at
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Data</CardTitle>
            <CardDescription>User profile from database</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Routing Decision</CardTitle>
            <CardDescription>Where this user should be redirected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Role:</strong> {profile.role_id}</p>
              <p><strong>Plan:</strong> {profile.plan}</p>
              <p><strong>Is Admin:</strong> {['admin', 'owner'].includes(profile.role_id) ? 'Yes' : 'No'}</p>
              <p><strong>Should Redirect To:</strong> {['admin', 'owner'].includes(profile.role_id) ? '/admin' : '/dashboard'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
