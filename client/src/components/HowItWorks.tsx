const steps = [
    {
        number: '01',
        title: 'Create a project',
        description: 'Start empty or pull a repo. The room is live the moment it exists.',
    },
    {
        number: '02',
        title: 'Invite your team',
        description: 'Send one link. No installs, no environment setup, no onboarding call.',
    },
    {
        number: '03',
        title: 'Code together',
        description: 'Edit the same files at once, watch presence, ship from the room.',
    },
]

type HowItWorksProps = {
    githubUrl?: string
}

export function HowItWorks({ githubUrl = 'https://github.com' }: HowItWorksProps) {
    return (
        <section id="how" className="px-8 pt-8 pb-26">
            <div className="mx-auto max-w-295">
                <div className="mb-13 flex max-w-130 flex-col gap-3">
                    <span className="font-mono text-[11px] tracking-[0.12em] text-accent">
                        HOW IT WORKS
                    </span>
                    <h2 className="m-0 text-[38px] leading-[1.12] font-semibold tracking-[-0.025em]">
                        Three steps to a shared room
                    </h2>
                </div>

                <div className="grid grid-cols-3 border-t border-border">
                    {steps.map((step, i) => (
                        <div
                            key={step.number}
                            className={`flex flex-col gap-3 py-7 ${
                                i === 0
                                    ? 'border-r border-border pr-7'
                                    : i === 1
                                      ? 'border-r border-border px-7'
                                      : 'pl-7'
                            }`}
                        >
                            <span className="font-mono text-xs text-accent">{step.number}</span>
                            <h3 className="m-0 text-xl font-semibold tracking-[-0.015em]">
                                {step.title}
                            </h3>
                            <p className="m-0 text-[15px] leading-[1.55] text-muted">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border bg-surface px-10 py-9">
                    <div className="flex flex-col gap-2">
                        <h3 className="m-0 text-2xl font-semibold tracking-[-0.02em]">
                            Open a room in about ten seconds
                        </h3>
                        <p className="m-0 text-[15px] text-muted">
                            Free while it's a demo. The source is on GitHub.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href="#top"
                            className="rounded-[9px] bg-accent px-5 py-3 text-[15px] font-medium text-white hover:bg-accent-hover"
                        >
                            Get Started
                        </a>
                        <a
                            href={githubUrl}
                            className="rounded-[9px] border border-border-strong px-5 py-3 text-[15px] font-medium text-heading hover:border-[#3a3a3a] hover:bg-border"
                        >
                            View on GitHub
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
