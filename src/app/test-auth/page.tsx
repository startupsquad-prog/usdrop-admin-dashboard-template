"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createSupabaseBrowser } from "@/utils/supabase/client"
import { toast } from "sonner"

export default function TestAuthPage() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("testpassword123")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  
  const supabase = createSupabaseBrowser()

  const testSignin = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(`Signin failed: ${error.message}`)
        setResult({ error: error.message, errorCode: error.status })
      } else {
        toast.success("Signin successful!")
        setResult({ success: true, user: data.user })
      }
    } catch (err) {
      toast.error(`Unexpected error: ${err}`)
      setResult({ error: String(err) })
    } finally {
      setIsLoading(false)
    }
  }

  const testWrongPassword = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "wrongpassword123",
      })

      if (error) {
        toast.error(`Wrong password test: ${error.message}`)
        setResult({ error: error.message, errorCode: error.status })
      } else {
        toast.success("Unexpected success!")
        setResult({ success: true, user: data.user })
      }
    } catch (err) {
      toast.error(`Unexpected error: ${err}`)
      setResult({ error: String(err) })
    } finally {
      setIsLoading(false)
    }
  }

  const testNonExistentUser = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "nonexistent@example.com",
        password: "password123",
      })

      if (error) {
        toast.error(`Non-existent user test: ${error.message}`)
        setResult({ error: error.message, errorCode: error.status })
      } else {
        toast.success("Unexpected success!")
        setResult({ success: true, user: data.user })
      }
    } catch (err) {
      toast.error(`Unexpected error: ${err}`)
      setResult({ error: String(err) })
    } finally {
      setIsLoading(false)
    }
  }

  const testSignup = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: `test${Date.now()}@example.com`,
        password: "testpassword123",
        options: {
          data: {
            full_name: "Test User",
          },
        },
      })

      if (error) {
        toast.error(`Signup failed: ${error.message}`)
        setResult({ error: error.message })
      } else {
        toast.success("Signup successful!")
        setResult({ success: true, user: data.user })
      }
    } catch (err) {
      toast.error(`Unexpected error: ${err}`)
      setResult({ error: String(err) })
    } finally {
      setIsLoading(false)
    }
  }

  const testSignout = async () => {
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        toast.error(`Signout failed: ${error.message}`)
      } else {
        toast.success("Signed out successfully!")
        setResult(null)
      }
    } catch (err) {
      toast.error(`Unexpected error: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-sans mb-2">Authentication Test</h1>
          <p className="text-muted-foreground font-sans">
            Test the authentication system with various scenarios
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Signin</CardTitle>
            <CardDescription>
              Test signin with existing user credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email:</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password:</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="testpassword123"
                className="mt-1"
              />
            </div>
            <Button onClick={testSignin} disabled={isLoading} className="w-full">
              {isLoading ? "Testing..." : "Test Signin"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Error Scenarios</CardTitle>
            <CardDescription>
              Test various error conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={testWrongPassword} disabled={isLoading} variant="outline" className="w-full">
              {isLoading ? "Testing..." : "Test Wrong Password"}
            </Button>
            <Button onClick={testNonExistentUser} disabled={isLoading} variant="outline" className="w-full">
              {isLoading ? "Testing..." : "Test Non-Existent User"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Signup</CardTitle>
            <CardDescription>
              Test signup with new user (will create unique email)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testSignup} disabled={isLoading} className="w-full">
              {isLoading ? "Testing..." : "Test Signup"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Signout</CardTitle>
            <CardDescription>
              Test signout functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testSignout} disabled={isLoading} className="w-full">
              {isLoading ? "Testing..." : "Test Signout"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Test Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Test credentials: test@example.com / testpassword123
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => window.location.href = '/signup'}>
              Go to Signup
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/signin'}>
              Go to Signin
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
