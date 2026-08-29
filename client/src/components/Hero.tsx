type HeroProps = {
    githubUrl?: string
    showCursors?: boolean
}

export function Hero({ githubUrl = 'https://github.com', showCursors = true }: HeroProps) {
    return (
        <section id="top" className="relative px-8 pt-26 pb-10">
            <div
                className="pointer-events-none absolute inset-0 mask-[radial-gradient(ellipse_70%_60%_at_50%_0%,#000_25%,transparent_75%)] bg-[linear-gradient(#141414_1px,transparent_1px),linear-gradient(90deg,#141414_1px,transparent_1px)] bg-size-[64px_64px]"
                aria-hidden="true"
            />

            <div className="relative mx-auto flex max-w-295 flex-col items-center gap-5.5 text-center">
                <h1 className="m-0 max-w-205 text-[72px] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
                    Code together.
                    <br />
                    <span className="text-muted">Ship faster.</span>
                </h1>

                <p className="m-0 max-w-140 text-lg leading-[1.55] text-muted text-pretty">
                    A collaborative editor where your whole team edits the same files, in the same
                    room, at the same time. No merging, no refreshing.
                </p>

                <div className="mt-1.5 flex items-center gap-3">
                    <a
                        href="#top"
                        className="rounded-[9px] bg-accent px-5 py-3 text-[15px] font-medium text-white hover:bg-accent-hover"
                    >
                        Get Started
                    </a>
                    <a
                        href={githubUrl}
                        className="rounded-[9px] border border-border-strong bg-surface px-5 py-3 text-[15px] font-medium text-heading hover:border-[#3a3a3a] hover:bg-border"
                    >
                        View on GitHub
                    </a>
                </div>
            </div>

            <CodeWindow showCursors={showCursors} />
        </section>
    )
}

function CodeWindow({ showCursors }: { showCursors: boolean }) {
    return (
        <div className="relative mx-auto mt-16 max-w-270">
            <div className="overflow-hidden rounded-[14px] border border-border-strong bg-[#0f0f0f] shadow-[0_40px_90px_-30px_rgba(0,0,0,.9),0_0_0_1px_rgba(255,255,255,.02)_inset]">
                <div className="flex items-center gap-3.5 border-b border-border bg-surface-raised px-3.5 py-2.75">
                    <div className="flex gap-1.5">
                        <span className="size-2.75 rounded-full bg-[#ff5f57]" />
                        <span className="size-2.75 rounded-full bg-[#febc2e]" />
                        <span className="size-2.75 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="font-mono text-xs text-dim">
                        collabcode.dev/r/9fa21c<span className="text-[#3a3a3a]"> · main</span>
                    </div>
                    <div className="flex-1" />
                    {showCursors && (
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                <span className="flex size-5.5 items-center justify-center rounded-full border-2 border-surface-raised bg-[#f472b6] text-[10px] font-semibold text-[#1a0a12]">
                                    M
                                </span>
                                <span className="-ml-1.75 flex size-5.5 items-center justify-center rounded-full border-2 border-surface-raised bg-success text-[10px] font-semibold text-[#062015]">
                                    R
                                </span>
                                <span className="-ml-1.75 flex size-5.5 items-center justify-center rounded-full border-2 border-surface-raised bg-[#fb923c] text-[10px] font-semibold text-[#1f1005]">
                                    A
                                </span>
                            </div>
                            <span className="font-mono text-[11px] text-dim">live</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-[196px_1fr]">
                    <FileExplorer />
                    <CodeBody showCursors={showCursors} />
                </div>

                <div className="flex items-center gap-4 border-t border-border bg-surface-raised px-3.5 py-2 font-mono text-[11px] text-dim">
                    <span className="text-accent">● synced</span>
                    <span>ws://rooms · 3 collaborators</span>
                    <div className="flex-1" />
                    <span>TypeScript · Ln 11, Col 42</span>
                </div>
            </div>
        </div>
    )
}

function FileExplorer() {
    return (
        <aside className="flex flex-col gap-2.25 border-r border-border bg-[#0d0d0d] px-3 py-3.5 font-mono text-xs text-dim">
            <div className="pl-1 text-[10px] tracking-[0.08em] text-[#4a4a4a]">EXPLORER</div>
            <div className="flex items-center gap-1.75 p-1 text-muted">
                <span className="size-1.5 rounded-sm border border-[#3a3a3a]" />
                src
            </div>
            <div className="rounded-md bg-border py-1 pr-1 pl-4.5 text-heading">Editor.tsx</div>
            <div className="py-1 pr-1 pl-4.5">room.ts</div>
            <div className="py-1 pr-1 pl-4.5">presence.ts</div>
            <div className="flex items-center gap-1.75 p-1 text-muted">
                <span className="size-1.5 rounded-sm border border-[#3a3a3a]" />
                server
            </div>
            <div className="py-1 pr-1 pl-4.5">socket.ts</div>
            <div className="py-1 pr-1 pl-4.5">schema.sql</div>
        </aside>
    )
}

function LineNumber({ n }: { n: number }) {
    return <span className="w-13 pr-4.5 text-right text-[#333]">{n}</span>
}

function PeerLabel({ color, textColor, name }: { color: string; textColor: string; name: string }) {
    return (
        <span className="ml-px inline-flex items-center gap-1.5 align-middle">
            <span
                className="h-3.5 w-0.5 animate-[caret_1.1s_steps(1)_infinite]"
                style={{ background: color, animationDelay: '0s' }}
            />
            <span
                className="rounded px-1.5 py-0.5 text-[10.5px] font-semibold whitespace-nowrap"
                style={{ background: color, color: textColor }}
            >
                {name}
            </span>
        </span>
    )
}

function CodeLine1() {
    return (
        <span>
            <span className="text-[#ff7b72]">import</span>{' '}
            <span className="text-[#e6edf3]">{'{ useRoom }'}</span>{' '}
            <span className="text-[#ff7b72]">from</span>{' '}
            <span className="text-[#7ee787]">"@collabcode/live"</span>;
        </span>
    )
}

function CodeLine3() {
    return (
        <span>
            <span className="text-[#ff7b72]">export function</span>{' '}
            <span className="text-[#d2a8ff]">Editor</span>
            <span className="text-[#e6edf3]">({'{ roomId }'})</span> {'{'}
        </span>
    )
}

function CodeBody({ showCursors }: { showCursors: boolean }) {
    return (
        <div className="overflow-hidden py-4 pb-6.5 font-mono text-[13.5px] leading-6.5">
            <div className="flex">
                <LineNumber n={1} />
                <CodeLine1 />
            </div>
            <div className="flex">
                <LineNumber n={2} />
                <span />
            </div>
            <div className="flex">
                <LineNumber n={3} />
                <CodeLine3 />
            </div>

            <div className="flex">
                <LineNumber n={4} />
                <span>
                    {'        '}
                    <span className="text-[#ff7b72]">const</span>{' '}
                    <span className="text-[#e6edf3]">{'{ peers, doc }'}</span> ={' '}
                    <span className="text-[#d2a8ff]">useRoom</span>(
                    <span className="text-[#e6edf3]">roomId</span>);
                    {showCursors && <PeerLabel color="#f472b6" textColor="#1a0a12" name="Maya" />}
                </span>
            </div>

            <div className="flex">
                <LineNumber n={5} />
                <span />
            </div>
            <div className="flex">
                <LineNumber n={6} />
                <span className="text-dim">
                    {'        // presence + patches stream over one socket'}
                </span>
            </div>
            <div className="flex">
                <LineNumber n={7} />
                <span>
                    {'        '}
                    <span className="text-[#e6edf3]">doc</span>.
                    <span className="text-[#d2a8ff]">on</span>(
                    <span className="text-[#7ee787]">"change"</span>, (
                    <span className="text-[#ffa657]">patch</span>){' '}
                    <span className="text-[#ff7b72]">=&gt;</span> {'{'}
                </span>
            </div>

            <div className="flex">
                <LineNumber n={8} />
                <span>
                    {'            '}
                    <span className="text-[#d2a8ff]">broadcast</span>(
                    <span className="text-[#e6edf3]">patch</span>,{' '}
                    <span className="text-[#e6edf3]">peers</span>);
                    {showCursors && <PeerLabel color="#34d399" textColor="#062015" name="Ravi" />}
                </span>
            </div>

            <div className="flex">
                <LineNumber n={9} />
                <span>{'        });'}</span>
            </div>
            <div className="flex">
                <LineNumber n={10} />
                <span />
            </div>

            <div className="flex">
                <LineNumber n={11} />
                <span>
                    {'        '}
                    <span className="text-[#ff7b72]">return</span>{' '}
                    <span className="text-[#e6edf3]">&lt;</span>
                    <span className="text-[#7ee787]">Canvas</span>{' '}
                    <span className="text-[#ffa657]">doc</span>=
                    <span className="text-[#e6edf3]">{'{doc}'}</span>{' '}
                    <span className="text-[#ffa657]">peers</span>=
                    <span className="text-[#e6edf3]">{'{peers}'}</span>{' '}
                    <span className="text-[#e6edf3]">/&gt;</span>;
                    {showCursors && <PeerLabel color="#fb923c" textColor="#1f1005" name="Ada" />}
                </span>
            </div>

            <div className="flex">
                <LineNumber n={12} />
                <span>{'}'}</span>
            </div>
        </div>
    )
}
