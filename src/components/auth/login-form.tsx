"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/service/auth.service"
import { type ComponentPropsWithoutRef, type FormEvent, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCookies } from "react-cookie"
import Link from "next/link"

export function LoginForm({ className, ...props }: ComponentPropsWithoutRef<"form">) {
    const router = useRouter()
    const [systemId, setSystemId] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [cookies, setCookie] = useCookies(["auth_token", "systemId"])

    useEffect(() => {
        if (cookies.systemId) {
            setSystemId(cookies.systemId)
        }
    }, [cookies.systemId])

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await login(systemId, password)

            // Store systemId first
            setCookie("systemId", systemId, { path: "/", maxAge: 375 })

            // Proceed to OTP verification regardless of token
            router.replace("/auth/otp-verification")
        } catch (err) {
            setError("Invalid system ID or password. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your system id below to login to your account
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="username">System ID</Label>
                    <Input
                        id="username"
                        type="username"
                        placeholder="cmb-sta-zLtf"
                        value={systemId}
                        onChange={(e) => setSystemId(e.target.value)}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/auth/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
                            Forgot your password?
                        </Link>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </div>
            {/* <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div> */}
        </form>
    )
}
