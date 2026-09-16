import { useState } from 'react'
import type { FormEvent } from 'react'
import { Spinner } from '@/components/ui/Spinner'
import { AuthLayout, Field, FormError } from '@/components/auth/AuthLayout'

export function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        // TODO: call POST /api/auth/login, then navigate to the dashboard.
    }

    return (
        <AuthLayout
            title="Log in to your room"
            subtitle="Pick up right where your team left off."
            footerQuestion="Don't have an account?"
            footerTo="/register"
            footerLabel="Get started"
        >
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <Field label="Email">
                    <input
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="field"
                    />
                </Field>

                <Field label="Password">
                    <input
                        type="password"
                        required
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="field"
                    />
                </Field>

                {error && <FormError message={error} />}

                <button type="submit" disabled={submitting} className="pill-solid mt-1 w-full">
                    {submitting && (
                        <Spinner className="size-3.5 border-canvas/30 border-t-canvas" />
                    )}
                    {submitting ? 'Logging in…' : 'Continue'}
                </button>
            </form>
        </AuthLayout>
    )
}
