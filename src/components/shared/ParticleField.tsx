import { useEffect, useRef } from 'react'

type Variant = 'dust' | 'gold'

type Props = {
  variant?: Variant
  /** target density/energy 0..1 — smoothed internally. Can change over time. */
  intensity?: number
  className?: string
  /** particle count ceiling */
  count?: number
}

type P = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number // base alpha
  tw: number // twinkle phase
}

/**
 * Lightweight floating-particle canvas. `dust` = tiny near-white hair motes
 * drifting upward (hero). `gold` = warmer, brighter luxury flecks.
 * `intensity` is eased toward, so callers can briefly "increase" particles
 * during transitions and let them settle back.
 */
export default function ParticleField({
  variant = 'dust',
  intensity = 0.5,
  className = '',
  count = 70,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetRef = useRef(intensity)
  const rafRef = useRef(0)

  useEffect(() => {
    targetRef.current = intensity
  }, [intensity])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let w = 0
    let h = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let particles: P[] = []
    let smooth = targetRef.current

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawn = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -0.08 - Math.random() * 0.22, // drift up
      r: variant === 'gold' ? 0.6 + Math.random() * 1.8 : 0.4 + Math.random() * 1.2,
      a: 0.15 + Math.random() * 0.5,
      tw: Math.random() * Math.PI * 2,
    })

    const build = () => {
      particles = Array.from({ length: count }, spawn)
    }

    resize()
    build()

    const color = variant === 'gold' ? [212, 175, 55] : [235, 232, 226]

    const frame = () => {
      smooth += (targetRef.current - smooth) * 0.05
      ctx.clearRect(0, 0, w, h)
      const visible = Math.floor(count * (0.25 + smooth * 0.75))

      for (let i = 0; i < visible; i++) {
        const p = particles[i]
        if (!reduce) {
          p.x += p.vx * (0.6 + smooth)
          p.y += p.vy * (0.6 + smooth)
          p.tw += 0.02
        }
        if (p.y < -5) {
          p.y = h + 5
          p.x = Math.random() * w
        }
        if (p.x < -5) p.x = w + 5
        if (p.x > w + 5) p.x = -5

        const twinkle = 0.55 + 0.45 * Math.sin(p.tw)
        const alpha = p.a * twinkle * (0.4 + smooth * 0.9)
        const [r, g, b] = color

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        if (variant === 'gold') {
          ctx.shadowColor = `rgba(212,175,55,${alpha})`
          ctx.shadowBlur = 6
        }
        ctx.fill()
        ctx.shadowBlur = 0
      }
      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [variant, count])

  return <canvas ref={canvasRef} className={`h-full w-full ${className}`} />
}
