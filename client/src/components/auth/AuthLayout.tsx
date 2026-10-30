import { useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Wordmark } from '@/components/Wordmark'

type AuthLayoutProps = {
    title: string
    subtitle: string
    children: ReactNode
    /** Footer: a question plus a link to the other auth page. */
    footerQuestion: string
    footerTo: string
    footerLabel: string
}

/** Frame shared by log in and register: wordmark on top, serif title,
 *  the form, and a footer linking to the other page. */
export function AuthLayout({
    title,
    subtitle,
    children,
    footerQuestion,
    footerTo,
    footerLabel,
}: AuthLayoutProps) {
    return (
        <div className="grid min-h-svh grid-rows-[auto_1fr] bg-canvas text-heading">
            <header className="flex items-center justify-between px-8 py-6">
                <Wordmark />
                <ThemeToggle />
            </header>

            <main className="grid place-items-center px-8 pb-24">
                <div className="w-full max-w-105">
                    <div className="flex flex-col gap-2.5 pb-9">
                        <h1 className="display m-0 text-[clamp(2rem,4vw,2.75rem)] text-heading">
                            {title}
                        </h1>
                        <p className="m-0 text-[15px] leading-[1.6] text-muted">{subtitle}</p>
                    </div>

                    {children}

                    <p className="mt-8 m-0 text-sm text-dim">
                        {footerQuestion}{' '}
                        <Link
                            to={footerTo}
                            className="text-cream underline decoration-faint underline-offset-4 transition-colors hover:decoration-cream"
                        >
                            {footerLabel}
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    )
}

type FieldProps = {
    label: string
    children: ReactNode
}

/** Uppercase mono label above the input, like the app's panel headers. */
export function Field({ label, children }: FieldProps) {
    return (
        <label className="flex flex-col gap-2">
            <span className="label text-dim">{label}</span>
            {children}
        </label>
    )
}

/** Password input with an eye button that toggles the characters visible. */
export function PasswordInput(props: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
    const [visible, setVisible] = useState(false)
    const Icon = visible ? LuEyeOff : LuEye

    return (
        <span className="relative block">
            <input {...props} type={visible ? 'text' : 'password'} className="field pr-11" />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? 'Hide password' : 'Show password'}
                aria-pressed={visible}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-dim transition-colors hover:text-cream"
            >
                <Icon className="size-4" aria-hidden="true" />
            </button>
        </span>
    )
}

export function FormError({ message }: { message: string }) {
    return (
        <p className="m-0 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger">
            {message}
        </p>
    )
}
