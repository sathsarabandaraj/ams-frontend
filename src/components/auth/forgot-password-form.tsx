"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type ComponentPropsWithoutRef, type FormEvent, useState } from "react"
import { requestPasswordReset } from "@/service/auth.service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useCookies } from "react-cookie"

export function ForgotPasswordForm({ className, ...props }: ComponentPropsWithoutRef<"form">) {
    const [cookies, setCookie] = useCookies(["systemId"])
    const [systemId, setSystemId] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        setLoading(true)
        setError(null)

        try {
            setCookie("systemId", systemId, {
                path: "/",
                maxAge: 375,
                secure: true,
                sameSite: "strict"
            })
            await requestPasswordReset(systemId)
            setSuccess(true)
        } catch (err) {
            console.error("Password reset request failed:", err)
            setError("Failed to process your request. Please try again.")
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
                        If your system ID exists in our records, you will receive password reset instructions shortly.
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
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your system ID below and we'll send you instructions to reset your password
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="systemId">System ID</Label>
                    <Input
                        id="systemId"
                        type="text"
                        placeholder="cmb-sta-zLtf"
                        value={systemId}
                        onChange={(e) => setSystemId(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Processing..." : "Send Reset Instructions"}
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
