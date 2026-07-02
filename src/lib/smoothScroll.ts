import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/**
 * Initialise Lenis smooth scroll and drive GSAP ScrollTrigger from it.
 * Idempotent — calling twice returns the same instance.
 */
export function initSmoothScroll(): Lenis {
  if (lenis) return lenis

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.4,
  })

  // Keep ScrollTrigger in sync with Lenis' virtual scroll position.
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function getLenis(): Lenis | null {
  return lenis
}

export function destroySmoothScroll() {
  lenis?.destroy()
  lenis = null
}

export { gsap, ScrollTrigger }
