import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DebugServerPage() {
  const supabase = await createClient()
  
  // Get user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('id', user?.id || '')
    .single()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Debug Server-Side Auth</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Server Auth State</CardTitle>
            <CardDescription>User authentication from server</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify({
                user: user ? {
                  id: user.id,
                  email: user.email,
                  email_confirmed_at: user.email_confirmed_at,
                  created_at: user.created_at
                } : null,
                authError: authError?.message || null
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Server Profile Data</CardTitle>
            <CardDescription>Profile data from server</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify({
                profile: profile || null,
                profileError: profileError?.message || null
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
