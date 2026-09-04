import { Link } from 'react-router-dom'
import { Wordmark } from '@/components/Wordmark'

type NavbarProps = {
    githubUrl?: string
}

const links = [
    { label: 'Workspace', href: '#workspace' },
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how' },
]

export function Navbar({ githubUrl = 'https://github.com' }: NavbarProps) {
    return (
        <header className="fixed inset-x-0 top-0 z-40 h-(--header-h) border-b border-border/80 bg-canvas/85 backdrop-blur-md">
            <nav className="mx-auto flex h-full max-w-7xl items-center gap-10 px-8">
                <Wordmark />

                <div className="label hidden flex-1 items-center justify-center gap-9 text-muted md:flex">
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="transition-colors hover:text-cream"
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href={githubUrl}
                        className="transition-colors hover:text-cream"
                        target="_blank"
                        rel="noreferrer"
                    >
                        GitHub
                    </a>
                </div>

                <div className="ml-auto flex items-center gap-5 md:ml-0">
                    <Link
                        to="/login"
                        className="label text-muted transition-colors hover:text-cream"
                    >
                        Log in
                    </Link>
                    <Link to="/register" className="pill-solid">
                        Get started
                    </Link>
                </div>
            </nav>
        </header>
    )
}
