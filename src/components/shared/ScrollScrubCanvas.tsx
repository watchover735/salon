import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useMotionValue, type MotionValue } from 'framer-motion'
import { gsap, ScrollTrigger } from '../../lib/smoothScroll'

export type DrawArgs = {
  ctx: CanvasRenderingContext2D
  w: number
  h: number
  /** 0..1 mapped directly from scroll position through this section */
  progress: number
  /** seconds since mount — only for subtle shimmer, never for autoplay motion */
  time: number
  img: HTMLImageElement | null
}

type Props = {
  /** background still drawn "cover" behind the effect (optional) */
  image?: string
  draw: (args: DrawArgs) => void
  /** total scroll length of the section, in viewport heights (more = slower scrub) */
  lengthVh?: number
  /** overlay content rendered above the canvas; receives a live progress MotionValue */
  overlay?: (progress: MotionValue<number>) => ReactNode
  className?: string
  id?: string
}

// keep gsap import referenced (ScrollTrigger registered as a side effect)
void gsap

/**
 * A sticky, scroll-scrubbed canvas. The section is `lengthVh` tall to create
 * scroll distance; the canvas is pinned via position:sticky and its `progress`
 * is mapped 1:1 from the user's scroll position through the section.
 * There is NO autoplay — nothing advances unless the user scrolls.
 */
export default function ScrollScrubCanvas({
  image,
  draw,
  lengthVh = 220,
  overlay,
  className = '',
  id,
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const drawRef = useRef(draw)
  drawRef.current = draw

  const progressMV = useMotionValue(0)

  useEffect(() => {
    if (!image) {
      imgRef.current = null
      return
    }
    const im = new Image()
    im.onload = () => (imgRef.current = im)
    im.src = image
  }, [image])

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return
    const ctx = canvas.getContext('2d')!
    let w = 0
    let h = 0
    const start = performance.now()
    let raf = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress
        progressMV.set(self.progress)
      },
    })

    const loop = () => {
      const time = (performance.now() - start) / 1000
      ctx.clearRect(0, 0, w, h)
      drawRef.current({ ctx, w, h, progress: progressRef.current, time, img: imgRef.current })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      st.kill()
    }
  }, [lengthVh, progressMV])

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative ${className}`}
      style={{ height: `${lengthVh}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        {overlay && <div className="pointer-events-none absolute inset-0">{overlay(progressMV)}</div>}
      </div>
    </section>
  )
}
