"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupabaseBrowser } from "@/utils/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Crown, Shield, User, Zap, Sun, Moon, GripVertical, ChevronDown, ChevronUp } from "lucide-react"

export function QuickLogin() {
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createSupabaseBrowser()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  
  // Drag and resize state
  const [position, setPosition] = useState({ x: 16, y: 16 })
  const [size, setSize] = useState({ width: 320, height: 'auto' })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isMinimized, setIsMinimized] = useState(false)
  
  const cardRef = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)

  // Drag handlers
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.target !== dragHandleRef.current && !dragHandleRef.current?.contains(e.target as Node)) return
    e.preventDefault()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - size.width
    const maxY = window.innerHeight - 200 // Approximate card height
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    })
  }

  // Responsive positioning
  useEffect(() => {
    const handleResize = () => {
      const maxX = window.innerWidth - size.width
      const maxY = window.innerHeight - 200
      
      setPosition(prev => ({
        x: Math.min(prev.x, maxX),
        y: Math.min(prev.y, maxY)
      }))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [size.width])

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: typeof size.height === 'number' ? size.height : 300
    })
  }

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return
    const deltaX = e.clientX - resizeStart.x
    const newWidth = Math.max(280, Math.min(500, resizeStart.width + deltaX))
    setSize(prev => ({ ...prev, width: newWidth }))
  }

  const handleResizeEnd = () => {
    setIsResizing(false)
  }

  // Event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove)
      document.addEventListener('mouseup', handleDragEnd)
      return () => {
        document.removeEventListener('mousemove', handleDragMove)
        document.removeEventListener('mouseup', handleDragEnd)
      }
    }
  }, [isDragging, dragStart])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
      return () => {
        document.removeEventListener('mousemove', handleResizeMove)
        document.removeEventListener('mouseup', handleResizeEnd)
      }
    }
  }, [isResizing, resizeStart])

  const quickLogin = async (email: string, password: string, userType: string) => {
    setLoading(userType)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(`Login failed: ${error.message}`)
      } else if (data.user) {
        toast.success(`Logged in as ${userType}!`)
        
        // Get user profile to check actual role
        const { data: profile, error: profileError } = await supabase
          .from('profile')
          .select('role_id, plan')
          .eq('id', data.user.id)
          .single()
        
        if (profileError) {
          console.error('Error fetching profile:', profileError)
          // If profile doesn't exist, create a default one
          if (profileError.code === 'PGRST116') {
            console.log('Profile not found, creating default profile...')
            const { data: newProfile, error: createError } = await supabase
              .from('profile')
              .insert({
                id: data.user.id,
                full_name: data.user.user_metadata?.full_name || '',
                role_id: 'client',
                plan: 'free'
              })
              .select()
              .single()
            
            if (createError) {
              console.error('Error creating profile:', createError)
              toast.error('Error setting up user profile')
              router.push('/dashboard')
            } else {
              // Redirect based on created profile
              if (['admin', 'owner'].includes(newProfile.role_id)) {
                router.push('/admin')
              } else {
                router.push('/dashboard')
              }
            }
          } else {
            toast.error('Error fetching user profile')
            router.push('/dashboard')
          }
        } else {
          // Redirect based on actual role from database
          if (['admin', 'owner'].includes(profile.role_id)) {
            router.push('/admin')
          } else {
            router.push('/dashboard')
          }
        }
      }
    } catch (err) {
      toast.error(`Unexpected error: ${err}`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card 
      ref={cardRef}
      className="fixed z-50 bg-background/95 backdrop-blur-sm border shadow-lg select-none max-w-[calc(100vw-32px)] sm:max-w-none"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        cursor: isDragging ? 'grabbing' : 'default',
        maxWidth: 'calc(100vw - 32px)'
      }}
    >
      <CardHeader 
        ref={dragHandleRef}
        className="pb-3 cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <GripVertical className="size-4 text-muted-foreground" />
            <Zap className="size-4" />
            Quick Login (Testing)
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-8 w-8 p-0"
            >
              {theme === 'dark' ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>
          </div>
        </div>
        {!isMinimized && (
          <CardDescription className="text-xs">
            Quick access for testing different user types
          </CardDescription>
        )}
      </CardHeader>
      {!isMinimized && (
        <CardContent className="space-y-2">
        <Button
          size="sm"
          variant="outline"
          className="w-full justify-start"
          onClick={() => quickLogin('admin@test.com', 'admin123', 'Admin')}
          disabled={loading === 'Admin'}
        >
          <Shield className="size-4 mr-2" />
          {loading === 'Admin' ? 'Logging in...' : 'Login as Admin'}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          className="w-full justify-start"
          onClick={() => quickLogin('free@test.com', 'free123', 'Free User')}
          disabled={loading === 'Free User'}
        >
          <User className="size-4 mr-2" />
          {loading === 'Free User' ? 'Logging in...' : 'Login as Free User'}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          className="w-full justify-start"
          onClick={() => quickLogin('pro@test.com', 'pro123', 'Pro User')}
          disabled={loading === 'Pro User'}
        >
          <Crown className="size-4 mr-2" />
          {loading === 'Pro User' ? 'Logging in...' : 'Login as Pro User'}
        </Button>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Admin: admin@test.com / admin123<br/>
            Free: free@test.com / free123<br/>
            Pro: pro@test.com / pro123
          </p>
        </div>
        </CardContent>
      )}
      
      {/* Resize handle */}
      <div
        ref={resizeHandleRef}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity"
        onMouseDown={handleResizeStart}
        style={{
          background: 'linear-gradient(-45deg, transparent 30%, currentColor 30%, currentColor 70%, transparent 70%)',
          color: 'hsl(var(--border))'
        }}
      />
    </Card>
  )
}
