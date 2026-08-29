import { useState } from 'react'
import type { FormEvent } from 'react'
import { LuCode } from 'react-icons/lu'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import * as authService from '@/services/auth.service'
import { ApiError } from '@/services/api'
import { Spinner } from '@/components/ui/Spinner'

export function LoginPage() {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const setUser = useAuthStore((s) => s.setUser)

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
            const { user } = await authService.login(email, password)
            setUser(user)
            void navigate('/dashboard')
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="grid min-h-screen place-items-center bg-canvas px-8 text-heading">
            <div className="w-full max-w-100">
                <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
                    <span className="flex size-7 items-center justify-center gap-0.75 rounded-[7px] border border-border-strong bg-surface-raised">
                        <span className="size-1 rounded-full bg-accent" />
                        <span className="size-1 rounded-full bg-[#3b6fef]" />
                        <span className="size-1 rounded-full bg-[#5b84f2]" />
                    </span>
                    <span className="text-[15px] font-semibold tracking-tight text-heading">
                        CollabCode
                    </span>
                </Link>

                <div className="rounded-[14px] border border-border-strong bg-[#0f0f0f] p-8 shadow-[0_40px_90px_-30px_rgba(0,0,0,.9),0_0_0_1px_rgba(255,255,255,.02)_inset]">
                    <div className="mb-6 flex flex-col items-center gap-1.5 text-center">
                        <LuCode className="size-6 text-accent" aria-hidden="true" />
                        <h1 className="m-0 text-xl font-semibold tracking-[-0.015em]">
                            Log in to your room
                        </h1>
                        <p className="m-0 text-sm text-muted">
                            Pick up right where your team left off.
                        </p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <label className="flex flex-col gap-1.5">
                            <span className="font-mono text-xs text-muted">Email</span>
                            <input
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-[9px] border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-heading outline-none placeholder:text-dim focus:border-accent"
                            />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="font-mono text-xs text-muted">Password</span>
                            <input
                                type="password"
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="rounded-[9px] border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-heading outline-none placeholder:text-dim focus:border-accent"
                            />
                        </label>

                        {error && (
                            <p className="m-0 rounded-[9px] border border-red-900/60 bg-red-950/40 px-3.5 py-2.5 text-sm text-red-300">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-2 flex items-center justify-center gap-2 rounded-[9px] bg-accent px-5 py-3 text-[15px] font-medium text-white hover:bg-accent-hover disabled:opacity-60"
                        >
                            {submitting && (
                                <Spinner className="size-4 border-white/40 border-t-white" />
                            )}
                            {submitting ? 'Logging in…' : 'Continue'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-accent hover:text-accent-hover">
                            Get started
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
