import { LuZap, LuFolderTree, LuMessageSquare, LuUsers, LuEye, LuHistory } from 'react-icons/lu'
import type { IconType } from 'react-icons'

const features: { title: string; description: string; icon: IconType }[] = [
    {
        title: 'Real-time Editing',
        description: 'CRDT-backed keystrokes land in every session in under 20ms.',
        icon: LuZap,
    },
    {
        title: 'File Explorer',
        description: 'A shared tree: create, rename and move without stepping on anyone.',
        icon: LuFolderTree,
    },
    {
        title: 'Team Chat',
        description: "Threads pinned to the line they're about, not lost in another app.",
        icon: LuMessageSquare,
    },
    {
        title: 'Live Presence',
        description: 'See every cursor, selection and open file as it happens.',
        icon: LuUsers,
    },
    {
        title: 'Instant Preview',
        description: 'Hot-reloaded output beside the code, shared by URL.',
        icon: LuEye,
    },
    {
        title: 'Version History',
        description: "Scrub the room's timeline and restore any point in the session.",
        icon: LuHistory,
    },
]

export function Features() {
    return (
        <section id="features" className="px-8 py-26">
            <div className="mx-auto max-w-295">
                <div className="mb-13 flex max-w-140 flex-col gap-3">
                    <span className="font-mono text-[11px] tracking-[0.12em] text-accent">
                        FEATURES
                    </span>
                    <h2 className="m-0 text-[38px] leading-[1.12] font-semibold tracking-[-0.025em]">
                        Everything a room needs
                    </h2>
                    <p className="m-0 text-base leading-[1.55] text-muted">
                        Six primitives, one socket. The parts that make working in the same file
                        feel normal.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {features.map(({ icon: Icon, ...feature }) => (
                        <div
                            key={feature.title}
                            className="flex flex-col gap-3.5 rounded-xl border border-border bg-surface p-6 hover:border-border-strong hover:bg-surface-raised"
                        >
                            <div className="flex size-10 items-center justify-center rounded-[10px] border border-border-strong bg-border">
                                <Icon className="size-4.5 text-accent" aria-hidden="true" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <h3 className="m-0 text-base font-semibold tracking-[-0.01em]">
                                    {feature.title}
                                </h3>
                                <p className="m-0 text-sm leading-[1.5] text-muted">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
