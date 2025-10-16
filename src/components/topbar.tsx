"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Crown, Shield, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createSupabaseBrowser } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"

interface UserProfile {
  id: string
  full_name: string
  role_id: string
  plan: string
}

export function Topbar() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const supabase = createSupabaseBrowser()
  const router = useRouter()

  useEffect(() => {
    const getProfile = async () => {
      if (!user) {
        setProfile(null)
        setProfileLoading(false)
        return
      }

      try {
        const { data: profileData, error } = await supabase
          .from('profile')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (error) {
          console.error('Error fetching profile:', error)
          // If profile doesn't exist, create a default one
          if (error.code === 'PGRST116') {
            console.log('Profile not found, creating default profile...')
            const { data: newProfile, error: createError } = await supabase
              .from('profile')
              .insert({
                id: user.id,
                full_name: user.user_metadata?.full_name || '',
                role_id: 'client',
                plan: 'free'
              })
              .select()
              .single()
            
            if (createError) {
              console.error('Error creating profile:', createError)
              // Set a default profile to prevent UI issues
              setProfile({
                id: user.id,
                full_name: user.user_metadata?.full_name || '',
                role_id: 'client',
                plan: 'free'
              })
            } else {
              setProfile(newProfile)
            }
          } else {
            // For other errors, set a default profile
            setProfile({
              id: user.id,
              full_name: user.user_metadata?.full_name || '',
              role_id: 'client',
              plan: 'free'
            })
          }
        } else {
          setProfile(profileData)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        // Set a default profile to prevent UI issues
        setProfile({
          id: user.id,
          full_name: user.user_metadata?.full_name || '',
          role_id: 'client',
          plan: 'free'
        })
      } finally {
        setProfileLoading(false)
      }
    }

    getProfile()
  }, [user, supabase])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Signed out successfully!")
      router.push('/signin')
    } catch (error) {
      toast.error("Failed to sign out")
    }
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'enterprise': return <Shield className="size-4" />
      case 'pro': return <Crown className="size-4" />
      default: return <User className="size-4" />
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'default'
      case 'pro': return 'secondary'
      default: return 'outline'
    }
  }

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'Enterprise'
      case 'pro': return 'Pro'
      default: return 'Free'
    }
  }

  const isAdmin = profile?.role_id === 'admin' || profile?.role_id === 'owner'

  if (authLoading || profileLoading) {
    return (
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <TrendingUp className="size-5" />
            </div>
            <span className="text-xl font-bold font-sans">USDrop AI</span>
          </div>
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </header>
    )
  }

  if (!user || !profile) {
    return (
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <TrendingUp className="size-5" />
            </div>
            <span className="text-xl font-bold font-sans">USDrop AI</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/signin')}>
              Sign In
            </Button>
            <Button size="sm" onClick={() => router.push('/signup')}>
              Sign Up
            </Button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <TrendingUp className="size-5" />
          </div>
          <span className="text-xl font-bold font-sans">USDrop AI</span>
          {isAdmin && (
            <Badge variant="secondary" className="ml-2">
              <Shield className="size-3 mr-1" />
              Admin
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Plan Status */}
          <Badge variant={getPlanColor(profile.plan)} className="flex items-center gap-1">
            {getPlanIcon(profile.plan)}
            {getPlanLabel(profile.plan)}
          </Badge>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {profile.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm">{profile.full_name || user.email}</span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                <User className="size-4 mr-2" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="size-4 mr-2" />
                Settings
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    <Shield className="size-4 mr-2" />
                    Admin Portal
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="size-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

