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

export function HowItWorks() {
    return (
        <section id="how" className="screen">
            <div className="mx-auto w-full max-w-7xl">
                <div className="flex flex-col gap-5 border-b border-border pb-14">
                    <span className="label text-dim">How it works</span>
                    <h2 className="display m-0 max-w-2xl text-[clamp(2.25rem,4.5vw,3.5rem)] text-heading">
                        Three steps to a shared room
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-px border-b border-border bg-border md:grid-cols-3">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="flex flex-col gap-4 bg-canvas py-10 md:px-8"
                        >
                            <span className="label text-dim">{step.number}</span>
                            <h3 className="m-0 font-serif text-[26px] leading-tight text-heading">
                                {step.title}
                            </h3>
                            <p className="m-0 text-[15px] leading-[1.6] text-muted">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
