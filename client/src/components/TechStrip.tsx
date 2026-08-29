const technologies = ['React', 'TypeScript', 'Node.js', 'WebSockets', 'PostgreSQL']

export function TechStrip() {
    return (
        <section className="px-8 pt-12 pb-2">
            <div className="mx-auto flex max-w-295 flex-wrap items-center justify-center gap-2.5">
                <span className="mr-2 font-mono text-[11px] tracking-[0.1em] text-[#5a5a5a]">
                    BUILT WITH
                </span>
                {technologies.map((tech) => (
                    <span
                        key={tech}
                        className="rounded-full border border-border-strong bg-surface-raised px-3.25 py-1.5 font-mono text-[12.5px] text-muted"
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </section>
    )
}
