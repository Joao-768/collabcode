import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { TechStrip } from '@/components/TechStrip'
import { Features } from '@/components/Features'
import { HowItWorks } from '@/components/HowItWorks'
import { Footer } from '@/components/Footer'

const githubUrl = 'https://github.com'
const builtBy = 'João Caetano'
const showCursors = true
const showTechStrip = false

export function LandingPage() {
    return (
        <div className="min-h-screen overflow-x-hidden bg-canvas text-heading">
            <Navbar githubUrl={githubUrl} />
            <Hero githubUrl={githubUrl} showCursors={showCursors} />
            {showTechStrip && <TechStrip />}
            <Features />
            <HowItWorks githubUrl={githubUrl} />
            <Footer githubUrl={githubUrl} builtBy={builtBy} />
        </div>
    )
}
