"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createSupabaseBrowser } from "@/utils/supabase/client"

const loginSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        // Handle specific error cases professionally
        if (error.message.includes("Invalid login credentials") ||
            error.message.includes("Invalid email or password") ||
            error.message.includes("Invalid credentials") ||
            error.message.includes("wrong password") ||
            error.message.includes("incorrect password")) {
          toast.error("❌ Invalid email or password. Please check your credentials and try again.", {
            duration: 5000
          })
          setError("email", { message: "Invalid email or password" })
          setError("password", { message: "Invalid email or password" })
        } else if (error.message.includes("Email not confirmed") ||
                   error.message.includes("email not verified") ||
                   error.message.includes("confirmation required")) {
          toast.error("📧 Please check your email and click the confirmation link before signing in.", {
            duration: 6000
          })
          setError("email", { message: "Email not confirmed" })
        } else if (error.message.includes("Too many requests") ||
                   error.message.includes("rate limit") ||
                   error.message.includes("too many attempts")) {
          toast.error("⏰ Too many login attempts. Please wait a moment and try again.", {
            duration: 5000
          })
        } else if (error.message.includes("User not found") ||
                   error.message.includes("user does not exist") ||
                   error.message.includes("no user found")) {
          toast.error("👤 No account found with this email. Please sign up first.", {
            action: {
              label: "Sign Up",
              onClick: () => router.push("/signup")
            },
            duration: 5000
          })
          setError("email", { message: "No account found with this email" })
        } else if (error.message.includes("Account disabled") ||
                   error.message.includes("account suspended") ||
                   error.message.includes("account banned")) {
          toast.error("🚫 Your account has been disabled. Please contact support.", {
            duration: 6000
          })
        } else if (error.message.includes("password") && error.message.includes("required")) {
          toast.error("🔒 Password is required.", {
            duration: 4000
          })
          setError("password", { message: "Password is required" })
        } else if (error.message.includes("email") && error.message.includes("required")) {
          toast.error("📧 Email is required.", {
            duration: 4000
          })
          setError("email", { message: "Email is required" })
        } else if (error.message.includes("Invalid email") ||
                   error.message.includes("invalid email format")) {
          toast.error("📧 Please enter a valid email address.", {
            duration: 4000
          })
          setError("email", { message: "Please enter a valid email address" })
        } else {
          toast.error("❌ Unable to sign in. Please try again or contact support if the problem persists.", {
            duration: 5000
          })
        }
        return
      }

      if (authData.user) {
        toast.success("🎉 Welcome back! You've been signed in successfully.", {
          duration: 3000
        })
        
        // Check if user is admin and redirect accordingly
        // We'll redirect to dashboard first, then the Topbar will handle admin redirect
        router.push("/dashboard")
      }
    } catch (error) {
      console.error('Signin error:', error)
      
      // Handle network or other unexpected errors
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          toast.error("🌐 Network error. Please check your connection and try again.", {
            duration: 5000
          })
        } else if (error.message.includes('timeout')) {
          toast.error("⏰ Request timed out. Please try again.", {
            duration: 5000
          })
        } else {
          toast.error("❌ An unexpected error occurred. Please try again or contact support.", {
            duration: 5000
          })
        }
      } else {
        toast.error("❌ An unexpected error occurred. Please try again or contact support.", {
          duration: 5000
        })
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card>
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg font-sans">Welcome Back</CardTitle>
          <CardDescription className="text-sm font-sans">
            Sign in to continue your dropshipping journey
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="email" className="text-sm font-sans">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="h-9 font-sans"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </Field>
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password" className="text-sm font-sans">Password</FieldLabel>
                <a
                  href="#"
                  className="ml-auto inline-block text-xs underline-offset-4 hover:underline text-primary"
                >
                  Forgot password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password"
                className="h-9 font-sans"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
              )}
            </Field>
            <Button type="submit" className="w-full h-9 font-sans" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-sans">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="text-primary hover:underline">Sign up</a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground text-center px-4 font-sans">
        By signing in, you agree to our{" "}
        <a href="#" className="text-primary hover:underline">Terms</a> and{" "}
        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
      </p>
    </div>
  )
}
