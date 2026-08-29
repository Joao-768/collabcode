import { Link } from 'react-router-dom'

type NavbarProps = {
    githubUrl?: string
}

export function Navbar({ githubUrl = 'https://github.com' }: NavbarProps) {
    return (
        <header className="sticky top-0 z-40 border-b border-border bg-canvas/82 backdrop-blur-md">
            <nav className="mx-auto flex max-w-295 items-center gap-8 px-8 py-4">
                <Link to="/" className="flex items-center gap-2.5">
                    <span className="flex size-7 items-center justify-center gap-0.75 rounded-[7px] border border-border-strong bg-surface-raised">
                        <span className="size-1 rounded-full bg-accent" />
                        <span className="size-1 rounded-full bg-[#3b6fef]" />
                        <span className="size-1 rounded-full bg-[#5b84f2]" />
                    </span>
                    <span className="text-[15px] font-semibold tracking-tight text-heading">
                        CollabCode
                    </span>
                </Link>

                <div className="flex flex-1 items-center gap-6.5 text-sm text-muted">
                    <a href="#features" className="hover:text-heading">
                        Features
                    </a>
                    <a href="#how" className="hover:text-heading">
                        How it works
                    </a>
                    <a href={githubUrl} className="hover:text-heading">
                        GitHub
                    </a>
                </div>

                <div className="flex items-center gap-2.5">
                    <Link
                        to="/login"
                        className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-raised hover:text-heading"
                    >
                        Login
                    </Link>
                    <Link
                        to="/login"
                        className="rounded-lg bg-accent px-3.75 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>
        </header>
    )
}
