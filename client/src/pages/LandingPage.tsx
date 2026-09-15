import { Navbar } from '@/components/Navbar'
import { Hero, HeroPreview } from '@/components/Hero'
import { TechStrip } from '@/components/TechStrip'
import { Features } from '@/components/Features'
import { HowItWorks } from '@/components/HowItWorks'
import { CallToAction } from '@/components/CallToAction'
import { Footer } from '@/components/Footer'

const githubUrl = 'https://github.com/Joao-768/collabcode'
const builtBy = 'João Caetano'

export function LandingPage() {
    return (
        <div className="overflow-x-hidden bg-canvas pt-(--header-h) text-heading">
            <Navbar githubUrl={githubUrl} />
            <Hero githubUrl={githubUrl} />
            <HeroPreview />
            <TechStrip />
            <Features />
            <HowItWorks />
            <CallToAction githubUrl={githubUrl} />
            <Footer githubUrl={githubUrl} builtBy={builtBy} />
        </div>
    )
}
