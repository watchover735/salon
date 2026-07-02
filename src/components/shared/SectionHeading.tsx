import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  eyebrow?: string
  children: ReactNode
  align?: 'left' | 'center'
  className?: string
}

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Elegant serif heading with a staggered scroll-reveal. An optional gold
 * eyebrow (small tracked caps) sits above a large Cormorant display line.
 */
export default function SectionHeading({
  eyebrow,
  children,
  align = 'center',
  className = '',
}: Props) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  return (
    <div className={`flex flex-col ${alignCls} ${className}`}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease }}
          className="mb-5 text-[0.7rem] font-sans font-light uppercase tracking-luxe text-gold/80"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease }}
        className="max-w-4xl font-serif text-4xl font-light leading-[1.05] text-pearl sm:text-5xl md:text-6xl lg:text-7xl"
      >
        {children}
      </motion.h2>
      {align === 'center' && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease, delay: 0.15 }}
          className="hairline mt-8 w-40 origin-center"
        />
      )}
    </div>
  )
}
