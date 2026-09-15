const technologies = ['React', 'TypeScript', 'Yjs CRDT', 'WebSockets', 'PostgreSQL']

/** A strip divided by vertical rules, like a logo bar, but carrying the stack
 *  instead of clients. Unlike the other sections it does not fill a screen:
 *  it is a thread between two that do. */
export function TechStrip() {
    return (
        <section className="border-y border-border px-8">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-3 lg:grid-cols-6">
                <div className="label grid place-items-center px-6 py-5 text-dim">Built with</div>
                {technologies.map((tech) => (
                    <div
                        key={tech}
                        className="grid place-items-center px-6 py-5 font-mono text-[13px] text-muted transition-colors hover:text-cream"
                    >
                        {tech}
                    </div>
                ))}
            </div>
        </section>
    )
}
