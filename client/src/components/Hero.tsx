import { Link } from 'react-router-dom'
import { LuArrowRight } from 'react-icons/lu'

type HeroProps = {
    githubUrl?: string
}

export function Hero({ githubUrl = 'https://github.com' }: HeroProps) {
    return (
        // justify-end sits the content on the bottom of the screen: the leftover
        // space all collects above it.
        <section id="top" className="screen relative justify-end pb-[clamp(3rem,10vh,7rem)]">
            <div className="relative mx-auto w-full max-w-7xl">
                {/* Left aligned, which reads more editorial than centered. */}
                <h1 className="display m-0 max-w-4xl text-[clamp(3rem,7.5vw,6.25rem)] text-heading">
                    Code together.
                    <br />
                    Ship faster.
                </h1>

                <p className="mt-8 mb-0 max-w-2xl text-[17px] leading-[1.6] text-muted">
                    A collaborative editor where your whole team edits the same files, in the same
                    room, at the same time.{' '}
                    <span className="text-dim">
                        No merging, no refreshing, no "can you push that first?"
                    </span>
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                    <Link to="/register" className="pill-solid">
                        Try for free
                        <LuArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                    <a href={githubUrl} target="_blank" rel="noreferrer" className="pill-outline">
                        View source
                    </a>

                    <span className="label ml-auto hidden items-center gap-2.5 text-dim lg:flex">
                        <span className="size-1.5 rounded-full bg-live" aria-hidden="true" />
                        Open a room in ten seconds
                    </span>
                </div>
            </div>
        </section>
    )
}

/** The code window gets a screen of its own. Pairing it with the headline
 *  forced both to shrink until neither had room to breathe. */
export function HeroPreview({ showCursors = true }: { showCursors?: boolean }) {
    return (
        // Short padding and px-4, so the window grows to nearly the full screen.
        <section
            id="workspace"
            className="screen justify-stretch px-4! py-[clamp(1.5rem,4vh,3rem)]"
        >
            <CodeWindow showCursors={showCursors} />
        </section>
    )
}

function CodeWindow({ showCursors }: { showCursors: boolean }) {
    return (
        <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col">
            <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border-strong bg-[#0d0d0d] shadow-[0_40px_120px_-40px_rgba(0,0,0,.95)]">
                <div className="flex items-center gap-3.5 border-b border-border bg-surface px-4 py-3">
                    <div className="flex gap-1.5">
                        <span className="size-2.5 rounded-full bg-faint" />
                        <span className="size-2.5 rounded-full bg-faint" />
                        <span className="size-2.5 rounded-full bg-faint" />
                    </div>
                    <div className="font-mono text-[11px] text-dim">
                        collabcode.dev/r/9fa21c<span className="text-faint"> · main</span>
                    </div>
                    <div className="flex-1" />
                    {showCursors && (
                        <div className="flex items-center gap-2.5">
                            <div className="flex">
                                <Avatar color="#f472b6" text="#1a0a12" letter="M" />
                                <Avatar color="#7ee787" text="#062015" letter="R" overlap />
                                <Avatar color="#fbbf24" text="#1f1005" letter="A" overlap />
                            </div>
                            <span className="label text-dim">Live</span>
                        </div>
                    )}
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-[200px_1fr]">
                    <FileExplorer />
                    <CodeBody showCursors={showCursors} />
                </div>

                <div className="flex items-center gap-4 border-t border-border bg-surface px-4 py-2.5 font-mono text-[11px] text-dim">
                    <span className="flex items-center gap-1.5 text-live">
                        <span className="size-1.5 rounded-full bg-live" />
                        synced
                    </span>
                    <span>ws://rooms · 3 collaborators</span>
                    <div className="flex-1" />
                    <span className="hidden sm:inline">TypeScript · Ln 11, Col 42</span>
                </div>
            </div>
        </div>
    )
}

function Avatar({
    color,
    text,
    letter,
    overlap = false,
}: {
    color: string
    text: string
    letter: string
    overlap?: boolean
}) {
    return (
        <span
            className={`flex size-5.5 items-center justify-center rounded-full border-2 border-surface font-mono text-[10px] font-medium ${
                overlap ? '-ml-1.75' : ''
            }`}
            style={{ background: color, color: text }}
        >
            {letter}
        </span>
    )
}

function FileExplorer() {
    return (
        <aside className="flex flex-col gap-[clamp(0.35rem,1vh,0.6rem)] border-r border-border bg-[#0b0b0b] px-3 py-[clamp(1rem,2.5vh,2rem)] font-mono text-[11.5px] text-dim">
            <div className="label pl-1 text-faint">Explorer</div>
            <div className="flex items-center gap-1.75 p-1 text-muted">
                <span className="size-1.5 rounded-xs border border-faint" />
                src
            </div>
            <div className="rounded-md bg-border py-1 pr-1 pl-4.5 text-cream">Editor.tsx</div>
            <div className="py-1 pr-1 pl-4.5">room.ts</div>
            <div className="py-1 pr-1 pl-4.5">presence.ts</div>
            <div className="flex items-center gap-1.75 p-1 text-muted">
                <span className="size-1.5 rounded-xs border border-faint" />
                server
            </div>
            <div className="py-1 pr-1 pl-4.5">socket.ts</div>
            <div className="py-1 pr-1 pl-4.5">schema.sql</div>
        </aside>
    )
}

function LineNumber({ n }: { n: number }) {
    return <span className="w-13 pr-4.5 text-right text-faint">{n}</span>
}

function PeerLabel({ color, textColor, name }: { color: string; textColor: string; name: string }) {
    return (
        <span className="ml-px inline-flex items-center gap-1.5 align-middle">
            <span
                className="h-3.5 w-0.5 animate-[caret_1.1s_steps(1)_infinite]"
                style={{ background: color }}
            />
            <span
                className="rounded px-1.5 py-0.5 text-[10.5px] font-medium whitespace-nowrap"
                style={{ background: color, color: textColor }}
            >
                {name}
            </span>
        </span>
    )
}

function CodeBody({ showCursors }: { showCursors: boolean }) {
    return (
        <div className="overflow-hidden py-[clamp(1rem,2.5vh,2rem)] font-mono text-[13.5px] leading-[clamp(1.6rem,3.4vh,2.1rem)]">
            <div className="flex">
                <LineNumber n={1} />
                <span>
                    <span className="text-[#ff9492]">import</span>{' '}
                    <span className="text-cream">{'{ useRoom }'}</span>{' '}
                    <span className="text-[#ff9492]">from</span>{' '}
                    <span className="text-[#7ee787]">"@collabcode/live"</span>;
                </span>
            </div>
            <div className="flex">
                <LineNumber n={2} />
                <span />
            </div>
            <div className="flex">
                <LineNumber n={3} />
                <span>
                    <span className="text-[#ff9492]">export function</span>{' '}
                    <span className="text-[#dcbdfb]">Editor</span>
                    <span className="text-cream">({'{ roomId }'})</span> {'{'}
                </span>
            </div>

            <div className="flex">
                <LineNumber n={4} />
                <span>
                    {'        '}
                    <span className="text-[#ff9492]">const</span>{' '}
                    <span className="text-cream">{'{ peers, doc }'}</span> ={' '}
                    <span className="text-[#dcbdfb]">useRoom</span>(
                    <span className="text-cream">roomId</span>);
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
                    <span className="text-cream">doc</span>.
                    <span className="text-[#dcbdfb]">on</span>(
                    <span className="text-[#7ee787]">"change"</span>, (
                    <span className="text-[#ffa657]">patch</span>){' '}
                    <span className="text-[#ff9492]">=&gt;</span> {'{'}
                </span>
            </div>

            <div className="flex">
                <LineNumber n={8} />
                <span>
                    {'            '}
                    <span className="text-[#dcbdfb]">broadcast</span>(
                    <span className="text-cream">patch</span>,{' '}
                    <span className="text-cream">peers</span>);
                    {showCursors && <PeerLabel color="#7ee787" textColor="#062015" name="Ravi" />}
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
                    <span className="text-[#ff9492]">return</span>{' '}
                    <span className="text-cream">&lt;</span>
                    <span className="text-[#7ee787]">Canvas</span>{' '}
                    <span className="text-[#ffa657]">doc</span>=
                    <span className="text-cream">{'{doc}'}</span>{' '}
                    <span className="text-[#ffa657]">peers</span>=
                    <span className="text-cream">{'{peers}'}</span>{' '}
                    <span className="text-cream">/&gt;</span>;
                    {showCursors && <PeerLabel color="#fbbf24" textColor="#1f1005" name="Ada" />}
                </span>
            </div>

            <div className="flex">
                <LineNumber n={12} />
                <span>{'}'}</span>
            </div>
        </div>
    )
}
