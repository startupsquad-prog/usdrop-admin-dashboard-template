import { TrendingUp } from "lucide-react"

import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <TrendingUp className="size-5" />
            </div>
            <span className="text-xl font-bold font-sans">USDrop AI</span>
          </div>
          <p className="text-sm text-muted-foreground font-sans">Winning products • Faster ops • Lower risk</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
