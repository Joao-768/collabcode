type FooterProps = {
    githubUrl?: string
    builtBy?: string
}

export function Footer({ githubUrl = 'https://github.com', builtBy = 'Your Name' }: FooterProps) {
    return (
        <footer className="border-t border-border bg-canvas px-8 pt-9 pb-12">
            <div className="mx-auto flex max-w-295 flex-wrap items-center justify-between gap-5">
                <div className="flex items-center gap-2.5">
                    <span className="flex size-6 items-center justify-center gap-0.5 rounded-md border border-border-strong bg-surface-raised">
                        <span className="size-0.75 rounded-full bg-accent" />
                        <span className="size-0.75 rounded-full bg-[#3b6fef]" />
                        <span className="size-0.75 rounded-full bg-[#5b84f2]" />
                    </span>
                    <span className="text-sm font-semibold">CollabCode</span>
                </div>

                <div className="flex items-center gap-5.5 text-[13.5px] text-muted">
                    <a href={githubUrl} className="hover:text-heading">
                        GitHub
                    </a>
                    <span className="font-mono text-[12.5px] text-dim">Built by {builtBy}</span>
                </div>

                <div className="font-mono text-xs text-[#5a5a5a]">© 2026 CollabCode</div>
            </div>
        </footer>
    )
}
