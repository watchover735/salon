import { motion } from 'framer-motion'

/**
 * Fixed, full-viewport matte-black base with a very subtle deep-red radial
 * glow that slowly breathes. Sits at the very back (z-0). Near-invisible by
 * design — it should register as atmosphere, not colour.
 */
export default function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-ink">
      {/* Primary breathing ember, centred slightly low like a stage floor glow */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-[55%] h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(139,0,0,0.16) 0%, rgba(58,10,10,0.10) 28%, rgba(5,5,5,0) 62%)',
          filter: 'blur(30px)',
        }}
        animate={{ opacity: [0.35, 0.62, 0.35], scale: [1, 1.06, 1] }}
        transition={{ duration: 11, ease: 'easeInOut', repeat: Infinity }}
      />
      {/* Faint top vignette so text always sits on true black */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, rgba(5,5,5,0) 55%, rgba(5,5,5,0.85) 100%)',
        }}
      />
    </div>
  )
}
