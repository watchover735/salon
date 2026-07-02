import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  gold?: boolean
  /** enable hover lift + gold edge (used on pricing / service cards) */
  interactive?: boolean
  delay?: number
}

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Handcrafted glass-morphism panel. Scroll-reveals from below; optional
 * hover-lift for interactive cards. No template look — thin light edge,
 * deep soft shadow, faint gold on hover.
 */
export default function GlassCard({
  children,
  className = '',
  gold = false,
  interactive = false,
  delay = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.9, ease, delay }}
      whileHover={
        interactive
          ? { y: -10, transition: { duration: 0.4, ease } }
          : undefined
      }
      className={[
        'glass rounded-2xl',
        gold ? 'glass-gold' : '',
        interactive ? 'group relative transition-shadow duration-500 hover:shadow-[0_40px_90px_-30px_rgba(139,0,0,0.5)]' : '',
        className,
      ].join(' ')}
    >
      {interactive && (
        <span className="pointer-events-none absolute inset-0 rounded-2xl border border-gold/0 transition-colors duration-500 group-hover:border-gold/30" />
      )}
      {children}
    </motion.div>
  )
}
