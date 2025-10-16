export default function TestEnvPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Supabase URL:</h2>
          <p className="text-sm text-muted-foreground">
            {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
          </p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Supabase Anon Key:</h2>
          <p className="text-sm text-muted-foreground">
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set'}
          </p>
        </div>
      </div>
    </div>
  )
}
