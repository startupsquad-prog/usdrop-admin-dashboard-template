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

const signupSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignupFormData = z.infer<typeof signupSchema>

export function SignupForm({
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
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    
    try {
      // Step 1: Create auth user
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
          },
        },
      })

      if (error) {
        // Handle specific error cases professionally
        if (error.message.includes("already registered") ||
            error.message.includes("already been registered") ||
            error.message.includes("User already registered") ||
            error.message.includes("already exists") ||
            error.message.includes("duplicate key")) {
          toast.error("📧 An account with this email already exists. Please sign in instead.", {
            action: {
              label: "Sign In",
              onClick: () => router.push("/signin")
            },
            duration: 5000
          })
          setError("email", {
            message: "This email is already registered. Please sign in instead."
          })
        } else if (error.message.includes("Invalid email") ||
                   error.message.includes("invalid email") ||
                   error.message.includes("email format")) {
          toast.error("📧 Please enter a valid email address.", {
            duration: 4000
          })
          setError("email", { message: "Please enter a valid email address" })
        } else if (error.message.includes("Password should be at least") ||
                   error.message.includes("password too short") ||
                   error.message.includes("weak password")) {
          toast.error("🔒 Password must be at least 8 characters long.", {
            duration: 4000
          })
          setError("password", { message: "Password must be at least 8 characters long" })
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
        } else if (error.message.includes("Too many requests") ||
                   error.message.includes("rate limit")) {
          toast.error("⏰ Too many signup attempts. Please wait a moment and try again.", {
            duration: 5000
          })
        } else if (error.message.includes("signup disabled") ||
                   error.message.includes("registration disabled")) {
          toast.error("🚫 New account registration is currently disabled. Please contact support.", {
            duration: 6000
          })
        } else {
          // Generic error fallback
          toast.error("❌ Unable to create account. Please try again or contact support if the problem persists.", {
            duration: 5000
          })
        }
        return
      }

          if (authData.user) {
            // Profile will be created automatically by database trigger
            // Step 2: Success - show toast and redirect
            toast.success("🎉 Account created successfully! Welcome to USDrop AI!", {
              duration: 4000
            })
            router.push("/dashboard")
          }
    } catch (error) {
      console.error('Signup error:', error)
      
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
          <CardTitle className="text-lg font-sans">Start Your Journey</CardTitle>
          <CardDescription className="text-sm font-sans">
            Join thousands of successful dropshippers
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="name" className="text-sm font-sans">Full Name</FieldLabel>
              <Input 
                id="name" 
                type="text" 
                placeholder="Enter your full name" 
                className="h-9 font-sans"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </Field>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="password" className="text-sm font-sans">Password</FieldLabel>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Min 8 characters"
                  className="h-9 font-sans"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword" className="text-sm font-sans">
                  Confirm
                </FieldLabel>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Confirm password"
                  className="h-9 font-sans"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
                )}
              </Field>
            </div>
            <Button type="submit" className="w-full h-9 font-sans" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-sans">
                Already have an account?{" "}
                <a href="/signin" className="text-primary hover:underline font-medium">Sign in here</a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground text-center px-4 font-sans">
        By creating an account, you agree to our{" "}
        <a href="#" className="text-primary hover:underline">Terms</a> and{" "}
        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
      </p>
    </div>
  )
}
