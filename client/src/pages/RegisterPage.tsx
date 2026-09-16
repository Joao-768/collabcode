import { useState } from 'react'
import type { FormEvent } from 'react'
import { Spinner } from '@/components/ui/Spinner'
import { AuthLayout, Field, FormError } from '@/components/auth/AuthLayout'

export function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })

            if (!response.ok) {
                const data = await response.json()
                setError(data.error || 'Something went wrong')
                setSubmitting(false)
                return
            }

            window.location.href = '/dashboard'
        } catch (err) {
            setError('Something went wrong')
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
