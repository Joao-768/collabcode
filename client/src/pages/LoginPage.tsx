import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { nextPath, withNext } from '@/lib/redirect'
import { useAuthStore } from '@/stores/auth.store'
import * as authService from '@/services/auth.service'
import { ApiError } from '@/services/api'
import { Spinner } from '@/components/ui/Spinner'
import { AuthLayout, Field, FormError } from '@/components/auth/AuthLayout'

export function LoginPage() {
    const navigate = useNavigate()
    const [search] = useSearchParams()
    const user = useAuthStore((s) => s.user)
    const setUser = useAuthStore((s) => s.setUser)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    if (user) {
        return <Navigate to={nextPath(search)} replace />
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        setError(null)
        setSubmitting(true)

        try {
            const { user } = await authService.login(email, password)
            setUser(user)
            void navigate(nextPath(search))
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <AuthLayout
            title="Log in to your room"
            subtitle="Pick up right where your team left off."
            footerQuestion="Don't have an account?"
            footerTo={withNext('/register', search)}
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
