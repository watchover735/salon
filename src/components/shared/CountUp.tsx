import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

type Props = { to: number; suffix?: string; duration?: number; className?: string }

/** Counts from 0 to `to` once, when scrolled into view. */
export default function CountUp({ to, suffix = '', duration = 1.6, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000))
      const eased = 1 - Math.pow(1 - t, 3)
      setVal(Math.round(eased * to))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])

  return (
    <span ref={ref} className={className}>
      {val.toLocaleString()}
      {suffix}
    </span>
  )
}
