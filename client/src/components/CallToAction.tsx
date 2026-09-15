import { Link } from 'react-router-dom'
import { LuArrowRight } from 'react-icons/lu'

type CallToActionProps = {
    githubUrl?: string
}

/** The landing's closing note: inverted cream, the only light block on the page. */
export function CallToAction({ githubUrl = 'https://github.com' }: CallToActionProps) {
    return (
        <section className="screen">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 rounded-2xl bg-cream px-10 py-16 text-canvas md:px-16 md:py-24">
                <h2 className="display m-0 max-w-3xl text-[clamp(2.25rem,5vw,4rem)]">
                    Open a room in about ten seconds
                </h2>

                <p className="m-0 max-w-lg text-[17px] leading-[1.6] text-canvas/65">
                    Free while it's a demo. The source is on GitHub.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                    <Link to="/register" className="pill bg-canvas text-cream hover:bg-canvas/85">
                        Get started
                        <LuArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="pill border border-canvas/25 text-canvas hover:bg-canvas/8"
                    >
                        View source
                    </a>
                </div>
            </div>
        </section>
    )
}
