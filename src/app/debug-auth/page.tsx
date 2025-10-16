"use client"

import { useState, useEffect } from "react"
import { createSupabaseBrowser } from "@/utils/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugAuthPage() {
  const [authState, setAuthState] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowser()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check auth state
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          setAuthState({ error: authError.message })
        } else if (user) {
          setAuthState({ user })
          
          // Check profile
          const { data: profile, error: profileError } = await supabase
            .from('profile')
            .select('*')
            .eq('id', user.id)
            .single()
          
          if (profileError) {
            setProfileData({ error: profileError.message })
          } else {
            setProfileData({ profile })
          }
        } else {
          setAuthState({ message: "No user logged in" })
        }
      } catch (error) {
        setAuthState({ error: String(error) })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      checkAuth()
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const testLogin = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@test.com',
        password: 'admin123'
      })
      
      if (error) {
        setAuthState({ error: error.message })
      } else {
        setAuthState({ user: data.user })
        // Refresh profile data
        const { data: profile, error: profileError } = await supabase
          .from('profile')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        if (profileError) {
          setProfileData({ error: profileError.message })
        } else {
          setProfileData({ profile })
        }
      }
    } catch (error) {
      setAuthState({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  const testLogout = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      setAuthState({ message: "Logged out" })
      setProfileData(null)
    } catch (error) {
      setAuthState({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Debug Auth - Loading...</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Debug Authentication</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Button onClick={testLogin} disabled={loading}>
          Test Admin Login
        </Button>
        <Button onClick={testLogout} variant="outline" disabled={loading}>
          Test Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication State</CardTitle>
            <CardDescription>Current user authentication status</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(authState, null, 2)}
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
              {JSON.stringify(profileData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
