import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { LUXURY } from '../../lib/images'
import SectionHeading from '../shared/SectionHeading'
import GlassCard from '../shared/GlassCard'
import ParticleField from '../shared/ParticleField'

const ease = [0.22, 1, 0.36, 1] as const

const REVIEWS = [
  { name: 'Priya Sharma', text: 'I walked in with damaged, lifeless hair and left feeling like the best version of myself. Pure artistry.', stars: 5, source: 'Google' },
  { name: 'Rohan Iyer', text: 'The most premium salon experience in the city. Every detail is considered. Worth every rupee.', stars: 5, source: 'Google' },
  { name: 'Ananya Rao', text: 'My keratin treatment lasted months. The team truly understands hair as a craft, not a service.', stars: 5, source: 'Instagram' },
  { name: 'Kabir Nair', text: 'Cinematic space, master stylists, and results that speak for themselves. I never go anywhere else.', stars: 5, source: 'Google' },
]

/**
 * SECTION 8 — FINAL REVEAL (Animation) followed by testimonials (Information).
 * Echoes the hero's closing moment: gold particles + a light sweep across the
 * luxury frame, scrubbed by scroll.
 */
export default function FinalReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1.02])
  const sweepX = useTransform(scrollYProgress, [0.15, 0.6], ['-30%', '130%'])
  const sweepOpacity = useTransform(scrollYProgress, [0.15, 0.35, 0.6], [0, 0.9, 0])
  const glow = useTransform(scrollYProgress, [0.1, 0.5], [0.2, 0.7])

  return (
    <section className="relative">
      {/* Animation: the reveal */}
      <div ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden py-24">
        <motion.div style={{ opacity: glow }} className="pointer-events-none absolute inset-0">
          <ParticleField variant="gold" intensity={0.8} count={80} />
        </motion.div>

        <motion.div style={{ scale }} className="relative" >
          <div className="relative" style={{ width: 'min(80vw, 50vh)', aspectRatio: '283 / 340' }}>
            <motion.div
              aria-hidden
              className="absolute -inset-10 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(212,175,55,0.18), rgba(139,0,0,0.08) 45%, transparent 70%)',
                filter: 'blur(30px)',
                opacity: glow,
              }}
            />
            <img
              src={LUXURY.src}
              alt="The finished luxury result"
              draggable={false}
              className="drag-none relative h-full w-full object-contain"
              style={{ filter: 'drop-shadow(0 30px 70px rgba(0,0,0,0.8))' }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                x: sweepX,
                opacity: sweepOpacity,
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,235,190,0.6) 50%, transparent 60%)',
                mixBlendMode: 'screen',
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease }}
          className="pointer-events-none absolute bottom-[10%] left-0 right-0 text-center"
        >
          <div className="font-sans text-[0.7rem] uppercase tracking-luxe text-gold/80">The Result</div>
          <h2 className="mt-4 font-serif text-4xl font-light text-pearl sm:text-5xl md:text-6xl">
            This is <span className="text-gold-gradient italic">Maison Noir.</span>
          </h2>
        </motion.div>
      </div>

      {/* Information: testimonials */}
      <div className="mx-auto max-w-6xl px-6 py-32">
        <SectionHeading eyebrow="In Their Words">Loved, and remembered</SectionHeading>
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
          {REVIEWS.map((r, i) => (
            <GlassCard key={r.name} delay={i * 0.1} className="flex flex-col p-8">
              <div className="mb-4 flex items-center gap-1 text-gold">
                {Array.from({ length: r.stars }).map((_, s) => (
                  <span key={s}>★</span>
                ))}
              </div>
              <p className="font-serif text-xl font-light italic leading-relaxed text-pearl/90">“{r.text}”</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-sans text-sm font-light text-pearl">{r.name}</span>
                <span className="font-sans text-[0.6rem] uppercase tracking-luxe text-ash">via {r.source}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
