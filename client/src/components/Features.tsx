import { LuZap, LuFolderTree, LuMessageSquare, LuUsers, LuEye, LuHistory } from 'react-icons/lu'
import type { IconType } from 'react-icons'

const features: { title: string; description: string; icon: IconType }[] = [
    {
        title: 'Real-time editing',
        description: 'CRDT-backed keystrokes land in every session in under 20ms.',
        icon: LuZap,
    },
    {
        title: 'File explorer',
        description: 'A shared tree: create, rename and move without stepping on anyone.',
        icon: LuFolderTree,
    },
    {
        title: 'Team chat',
        description: "Threads pinned to the line they're about, not lost in another app.",
        icon: LuMessageSquare,
    },
    {
        title: 'Live presence',
        description: 'See every cursor, selection and open file as it happens.',
        icon: LuUsers,
    },
    {
        title: 'Instant preview',
        description: 'Hot-reloaded output beside the code, shared by URL.',
        icon: LuEye,
    },
    {
        title: 'Version history',
        description: "Scrub the room's timeline and restore any point in the session.",
        icon: LuHistory,
    },
]

export function Features() {
    return (
        <section id="features" className="screen">
            <div className="mx-auto w-full max-w-7xl">
                <div className="flex flex-col gap-4 border-b border-border pb-[clamp(1.5rem,4vh,3.5rem)]">
                    <span className="label text-dim">Features</span>
                    <h2 className="display m-0 max-w-3xl text-[clamp(2.25rem,4.5vw,3.5rem)] text-heading">
                        Everything a room needs
                    </h2>
                    {/* On short screens the subtitle is the first thing to go:
                        without it the two rows of cards still fit the viewport. */}
                    <p className="m-0 max-w-xl text-[17px] leading-[1.6] text-muted [@media(height<860px)]:hidden">
                        Six primitives, one socket. The parts that make working in the same file
                        feel normal.
                    </p>
                </div>

                {/* A grid of rules rather than cards: fewer boxes, more page.
                    The dividers live on the container (gap + background) so
                    nothing has to chase :nth-child at every breakpoint. */}
                <div className="grid grid-cols-1 gap-px border-b border-border bg-border md:grid-cols-2 lg:grid-cols-3">
                    {features.map(({ icon: Icon, ...feature }) => (
                        <article
                            key={feature.title}
                            className="group flex flex-col gap-[clamp(0.5rem,1.5vh,1rem)] bg-canvas py-[clamp(1.25rem,3.5vh,2.5rem)] md:px-8"
                        >
                            <Icon
                                className="size-5 text-dim transition-colors group-hover:text-cream"
                                aria-hidden="true"
                            />
                            <h3 className="m-0 font-serif text-2xl leading-tight text-heading">
                                {feature.title}
                            </h3>
                            <p className="m-0 text-[15px] leading-[1.6] text-muted">
                                {feature.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
