"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type ComponentPropsWithoutRef, type FormEvent, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { resetPassword } from "@/service/auth.service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, CookieIcon } from "lucide-react"
import Link from "next/link"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "../ui/input-otp"
import { useCookies } from "react-cookie"

export function PasswordResetForm({ className, ...props }: ComponentPropsWithoutRef<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cookies] = useCookies(['systemId']);
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Extract OTP from URL if present
  useEffect(() => {
    const otpParam = searchParams.get("otp")
  if (otpParam) {
      setOtp(otpParam)
    }
  }, [searchParams])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setLoading(false)
      return
    }

    try {
      await resetPassword(cookies.systemId, otp, password)
      setSuccess(true)

      setTimeout(() => {
        router.push("/auth/login")
      }, 5000)
    } catch (err) {
      console.error("Password reset failed:", err)
      setError("Failed to reset password. The OTP may be invalid or expired.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col gap-6">
        <Alert className="border-green-500 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your password has been reset successfully. You will be redirected to the login page shortly.
          </AlertDescription>
        </Alert>
        <Button asChild>
          <Link href="/auth/login">Return to Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-balance text-sm text-muted-foreground">Enter your new password below</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3 justify-items-center mb-7">
          <Label htmlFor="otp">OTP Code</Label>
          <InputOTP id='otp' maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} value={otp} onChange={(otp) => setOtp(otp)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Resetting Password..." : "Reset Password"}
        </Button>
        <div className="text-center text-sm">
          Remember your password?{" "}
          <Link href="/auth/login" className="underline underline-offset-4">
            Back to login
          </Link>
        </div>
      </div>
    </form>
  )
}
