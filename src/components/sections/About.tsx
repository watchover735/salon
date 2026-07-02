import { motion } from 'framer-motion'
import SectionHeading from '../shared/SectionHeading'
import GlassCard from '../shared/GlassCard'
import CountUp from '../shared/CountUp'

type Stat = { value?: number; suffix?: string; static?: string; label: string; caption: string }

const STATS: Stat[] = [
  { value: 10, suffix: '+', label: 'Years of Craft', caption: 'A decade shaping hair as an art form.' },
  { value: 5000, suffix: '+', label: 'Clients Transformed', caption: 'Trusted by thousands across the city.' },
  { static: 'Certified', label: 'Master Stylists', caption: 'L’Oréal & Wella certified artisans.' },
  { static: 'Luxury', label: 'Products Only', caption: 'Kérastase, Olaplex & Davines exclusively.' },
]

const ease = [0.22, 1, 0.36, 1] as const

/**
 * SECTION 3 — ABOUT (Information beat). Glass-morphism stat cards with a
 * staggered scroll reveal. Cursor spotlight remains active over this section.
 */
export default function About() {
  return (
    <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-32">
      <SectionHeading eyebrow="The Atelier">
        Where damage becomes <span className="text-gold-gradient italic">design.</span>
      </SectionHeading>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease, delay: 0.1 }}
        className="mx-auto mt-8 max-w-xl text-center font-sans text-sm font-light leading-relaxed text-ash"
      >
        Maison Noir is not a salon. It is a studio for restoration — a place where
        every strand is read, understood, and rebuilt into something quietly luxurious.
      </motion.p>

      <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.12} className="p-8 text-center">
            <div className="font-serif text-5xl font-light text-pearl md:text-6xl">
              {s.value != null ? (
                <CountUp to={s.value} suffix={s.suffix} />
              ) : (
                <span className="text-gold-gradient">{s.static}</span>
              )}
            </div>
            <div className="mt-4 font-sans text-[0.7rem] uppercase tracking-luxe text-gold/80">
              {s.label}
            </div>
            <p className="mt-3 font-sans text-xs font-light leading-relaxed text-ash">
              {s.caption}
            </p>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
