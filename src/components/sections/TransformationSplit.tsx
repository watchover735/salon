import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { LUXURY, FRIZZY } from '../../lib/images'
import { useMediaQuery } from '../../lib/hooks'
import ParticleField from '../shared/ParticleField'

/**
 * SECTION 2 — TRANSFORMATION SPLIT. Scroll-scrubbed. The frozen luxury frame
 * is bisected by a glowing red line that opens into a before/after split:
 * damaged (left / top) vs luxury (right / bottom). Hero dust gives way to gold
 * particles as the split completes, then the heading resolves.
 */
export default function TransformationSplit() {
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 767px)')

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // red line: dot -> full extent (0 .. 0.32)
  const lineExtent = useTransform(scrollYProgress, [0.02, 0.32], ['0%', '100%'])
  const lineGlow = useTransform(scrollYProgress, [0.02, 0.3, 0.85, 1], [0, 1, 1, 0.3])

  // damaged overlay reveal from centre outward (0.3 .. 0.7)
  const reveal = useTransform(scrollYProgress, [0.3, 0.7], [50, 0]) // % from centre

  // clip-path per axis: desktop shows left half, mobile shows top half
  const horizClip = useMotionTemplate`inset(0% 50% 0% ${reveal}%)`
  const vertClip = useMotionTemplate`inset(${reveal}% 0% 50% 0%)`

  const goldOpacity = useTransform(scrollYProgress, [0.55, 0.85], [0, 1])
  const dustOpacity = useTransform(scrollYProgress, [0.4, 0.6], [1, 0])
  const headingOpacity = useTransform(scrollYProgress, [0.72, 0.92], [0, 1])
  const headingY = useTransform(scrollYProgress, [0.72, 0.92], [30, 0])
  const labelOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1])

  return (
    <section ref={ref} className="relative h-[260vh] w-full">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* fading hero dust */}
        <motion.div style={{ opacity: dustOpacity }} className="pointer-events-none absolute inset-0">
          <ParticleField variant="dust" intensity={0.4} count={50} />
        </motion.div>
        {/* incoming gold particles */}
        <motion.div style={{ opacity: goldOpacity }} className="pointer-events-none absolute inset-0">
          <ParticleField variant="gold" intensity={0.7} count={70} />
        </motion.div>

        {/* stage */}
        <div
          className="relative"
          style={{ width: 'min(80vw, 46vh)', aspectRatio: '283 / 340' }}
        >
          {/* base: luxury (the "after") */}
          <img
            src={LUXURY.src}
            alt="Luxury salon hairstyle"
            className="drag-none absolute inset-0 h-full w-full object-contain"
            draggable={false}
            style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.7))' }}
          />

          {/* overlay: damaged (the "before"), revealed from the centre line */}
          <motion.img
            src={FRIZZY.src}
            alt="Damaged frizzy hairstyle"
            className="drag-none absolute inset-0 h-full w-full object-contain"
            draggable={false}
            style={{
              clipPath: isMobile ? vertClip : horizClip,
              filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.7)) saturate(0.85) brightness(0.92)',
            }}
          />

          {/* glowing red split line */}
          {isMobile ? (
            <motion.div
              aria-hidden
              className="absolute left-0 top-1/2 -translate-y-1/2"
              style={{
                width: lineExtent,
                height: 2,
                left: 0,
                opacity: lineGlow,
                background: 'linear-gradient(90deg, transparent, #8B0000, #ff3b3b, #8B0000, transparent)',
                boxShadow: '0 0 18px rgba(139,0,0,0.9), 0 0 40px rgba(139,0,0,0.5)',
              }}
            />
          ) : (
            <motion.div
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                height: lineExtent,
                width: 2,
                opacity: lineGlow,
                background: 'linear-gradient(180deg, transparent, #8B0000, #ff3b3b, #8B0000, transparent)',
                boxShadow: '0 0 18px rgba(139,0,0,0.9), 0 0 40px rgba(139,0,0,0.5)',
              }}
            />
          )}
        </div>

        {/* before / after labels */}
        <motion.div
          style={{ opacity: labelOpacity }}
          className={`pointer-events-none absolute ${isMobile ? 'top-[16%] left-1/2 -translate-x-1/2' : 'left-[8%] top-1/2 -translate-y-1/2'}`}
        >
          <span className="font-sans text-[0.6rem] uppercase tracking-luxe text-ash">Before</span>
        </motion.div>
        <motion.div
          style={{ opacity: labelOpacity }}
          className={`pointer-events-none absolute ${isMobile ? 'bottom-[16%] left-1/2 -translate-x-1/2' : 'right-[8%] top-1/2 -translate-y-1/2'}`}
        >
          <span className="font-sans text-[0.6rem] uppercase tracking-luxe text-gold/80">After</span>
        </motion.div>

        {/* resolving heading */}
        <motion.div
          style={{ opacity: headingOpacity, y: headingY }}
          className="pointer-events-none absolute bottom-[12%] left-0 right-0 px-6 text-center"
        >
          <h2 className="mx-auto max-w-3xl font-serif text-3xl font-light leading-tight text-pearl sm:text-4xl md:text-5xl">
            Every transformation starts with{' '}
            <span className="text-gold-gradient italic">understanding.</span>
          </h2>
        </motion.div>
      </div>
    </section>
  )
}
