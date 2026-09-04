import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import * as authService from '@/services/auth.service'
import { ApiError } from '@/services/api'
import { Spinner } from '@/components/ui/Spinner'
import { AuthLayout, Field, FormError } from '@/components/auth/AuthLayout'

export function RegisterPage() {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const setUser = useAuthStore((s) => s.setUser)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    if (user) {
        return <Navigate to="/dashboard" replace />
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        setError(null)
        setSubmitting(true)

        try {
            const { user } = await authService.register(email, name, password)
            setUser(user)
            void navigate('/dashboard')
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Start a room and invite your team in seconds."
            footerQuestion="Already have an account?"
            footerTo="/login"
            footerLabel="Log in"
        >
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <Field label="Name">
                    <input
                        type="text"
                        required
                        minLength={2}
                        autoComplete="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="field"
                    />
                </Field>

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
                        minLength={8}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
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
                    {submitting ? 'Creating account…' : 'Create account'}
                </button>
            </form>
        </AuthLayout>
    )
}
