import { PasswordResetForm } from "@/components/auth/password-reset-form";

export default function PasswordResetPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">{/* Logo can be added here if needed */}</div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <PasswordResetForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <img
                    src="/img/placeholder.svg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
