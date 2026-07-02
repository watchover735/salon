import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import { useIsTouch } from '../../lib/hooks'

/**
 * Soft gold radial glow that follows the cursor with spring smoothing.
 * Sits above the ambient background but below content (z-10).
 * Fully disabled on touch / coarse-pointer devices.
 */
export default function SpotlightCursor() {
  const isTouch = useIsTouch()

  const x = useMotionValue(-1000)
  const y = useMotionValue(-1000)
  const sx = useSpring(x, { stiffness: 140, damping: 22, mass: 0.4, bounce: 0 })
  const sy = useSpring(y, { stiffness: 140, damping: 22, mass: 0.4, bounce: 0 })

  const background = useMotionTemplate`radial-gradient(300px circle at ${sx}px ${sy}px, rgba(212,175,55,0.15), transparent 70%)`

  useEffect(() => {
    if (isTouch) return
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [isTouch, x, y])

  if (isTouch) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-10 hidden md:block"
      style={{ background }}
    />
  )
}
