import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Wordmark } from '@/components/Wordmark'

type AuthLayoutProps = {
    title: string
    subtitle: string
    children: ReactNode
    /** Rodape: pergunta + link para a outra pagina de auth. */
    footerQuestion: string
    footerTo: string
    footerLabel: string
}

/** Moldura partilhada pelo login e pelo registo: marca em cima,
 *  titulo serif, formulario e um rodape com a rota alternativa. */
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
            <header className="px-8 py-6">
                <Wordmark />
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

/** Label em mono maiusculo por cima do input, como os cabecalhos da app. */
export function Field({ label, children }: FieldProps) {
    return (
        <label className="flex flex-col gap-2">
            <span className="label text-dim">{label}</span>
            {children}
        </label>
    )
}

export function FormError({ message }: { message: string }) {
    return (
        <p className="m-0 rounded-lg border border-red-900/50 bg-red-950/30 px-3.5 py-2.5 text-sm text-red-300">
            {message}
        </p>
    )
}
