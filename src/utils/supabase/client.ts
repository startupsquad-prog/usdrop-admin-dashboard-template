import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zuxtvswstrvksytueoqb.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1eHR2c3dzdHJ2a3N5dHVlb3FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Mjc1MzYsImV4cCI6MjA3NjEwMzUzNn0.9VUyLm40tZ9eFuVIJvYucOmjDm3pgv9s2oPfaCYDtWg'
  )
}
