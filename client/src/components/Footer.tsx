import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Wordmark } from '@/components/Wordmark'

type FooterProps = {
    githubUrl?: string
    builtBy?: string
}

export function Footer({ githubUrl = 'https://github.com', builtBy = 'Your Name' }: FooterProps) {
    return (
        <footer className="border-t border-border px-8 pt-20 pb-12">
            <div className="mx-auto w-full max-w-7xl">
                <div className="flex flex-wrap items-start justify-between gap-10">
                    <div className="flex max-w-xs flex-col gap-4">
                        <Wordmark />
                        <p className="m-0 text-sm leading-[1.6] text-dim">
                            A collaborative editor for teams that would rather build together than
                            merge afterwards.
                        </p>
                    </div>

                    <div className="flex gap-16">
                        <FooterColumn title="Product">
                            <FooterLink href="#features">Features</FooterLink>
                            <FooterLink href="#how">How it works</FooterLink>
                            <FooterLink href="#workspace">Workspace</FooterLink>
                        </FooterColumn>

                        <FooterColumn title="Account">
                            <FooterRoute to="/login">Log in</FooterRoute>
                            <FooterRoute to="/register">Get started</FooterRoute>
                            <FooterLink href={githubUrl}>GitHub</FooterLink>
                        </FooterColumn>
                    </div>
                </div>

                <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-7 font-mono text-[11.5px] text-faint">
                    <span>© 2026 CollabCode</span>
                    <span>Built by {builtBy}</span>
                </div>
            </div>
        </footer>
    )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-4">
            <span className="label text-faint">{title}</span>
            <div className="flex flex-col gap-3 text-sm text-muted">{children}</div>
        </div>
    )
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <a href={href} className="transition-colors hover:text-cream">
            {children}
        </a>
    )
}

function FooterRoute({ to, children }: { to: string; children: ReactNode }) {
    return (
        <Link to={to} className="transition-colors hover:text-cream">
            {children}
        </Link>
    )
}
