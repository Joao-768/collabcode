const technologies = ['React', 'TypeScript', 'Yjs CRDT', 'WebSockets', 'PostgreSQL']

/** Faixa dividida por separadores verticais, como a barra de logos da
 *  referencia -- aqui com a stack em vez de clientes. Ao contrario das
 *  outras seccoes nao ocupa um ecra: e so um fio entre duas que ocupam. */
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
