import { useEffect } from 'react'
import { initSmoothScroll, destroySmoothScroll, ScrollTrigger } from './lib/smoothScroll'

import AmbientBackground from './components/global/AmbientBackground'
import SpotlightCursor from './components/global/SpotlightCursor'
import GrainOverlay from './components/global/GrainOverlay'

import Hero from './components/sections/Hero'
import TransformationSplit from './components/sections/TransformationSplit'
import About from './components/sections/About'
import WashSection from './components/sections/WashSection'
import StraightenSection from './components/sections/StraightenSection'
import ColorSection from './components/sections/ColorSection'
import StyleTeamSection from './components/sections/StyleTeamSection'
import FinalReveal from './components/sections/FinalReveal'
import BookingCTA from './components/sections/BookingCTA'

export default function App() {
  useEffect(() => {
    initSmoothScroll()
    // ensure triggers measure correctly after fonts/images settle
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => {
      window.clearTimeout(t)
      destroySmoothScroll()
    }
  }, [])

  return (
    <>
      <AmbientBackground />
      <SpotlightCursor />
      <GrainOverlay />

      <main className="relative z-20">
        <Hero />
        <TransformationSplit />
        <About />
        <WashSection />
        <StraightenSection />
        <ColorSection />
        <StyleTeamSection />
        <FinalReveal />
        <BookingCTA />
      </main>
    </>
  )
}
