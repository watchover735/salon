import { useMemo } from 'react'
import { motion } from 'framer-motion'
import ScrollScrubCanvas from '../shared/ScrollScrubCanvas'
import ScrubOverlay from '../shared/ScrubOverlay'
import SectionHeading from '../shared/SectionHeading'
import GlassCard from '../shared/GlassCard'
import { createWashFx } from '../../lib/canvasFx'

const SERVICES = [
  { name: 'Signature Hair Spa', desc: 'Deep-conditioning ritual with scalp therapy.', time: '60 min' },
  { name: 'Luxury Hair Wash', desc: 'Kérastase cleanse, tone & blow-dry finish.', time: '30 min' },
  { name: 'Keratin Treatment', desc: 'Frizz sealed, shine restored, strand by strand.', time: '120 min' },
  { name: 'Smoothening', desc: 'Sleek, manageable hair for up to six months.', time: '150 min' },
  { name: 'Beard Styling', desc: 'Precision sculpt, hot towel & nourishing oil.', time: '40 min' },
]

/**
 * SECTION 4 — HAIR WASH (Animation) followed by service cards (Information).
 */
export default function WashSection() {
  const draw = useMemo(() => createWashFx(), [])

  return (
    <>
      <ScrollScrubCanvas
        id="wash"
        draw={draw}
        lengthVh={240}
        overlay={(p) => (
          <ScrubOverlay progress={p} eyebrow="Chapter I · Cleanse" title="It begins with" accent="water." />
        )}
      />

      {/* Information beat: services */}
      <div className="mx-auto max-w-6xl px-6 py-32">
        <SectionHeading eyebrow="Care Menu">The rituals of renewal</SectionHeading>
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <GlassCard key={s.name} interactive delay={i * 0.08} className="flex flex-col p-8">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-serif text-2xl font-light text-pearl">{s.name}</h3>
                <span className="mt-1 shrink-0 font-sans text-[0.6rem] uppercase tracking-[0.2em] text-gold/70">
                  {s.time}
                </span>
              </div>
              <p className="mt-4 font-sans text-sm font-light leading-relaxed text-ash">{s.desc}</p>
              <motion.span className="hairline mt-6 w-full" />
            </GlassCard>
          ))}
        </div>
      </div>
    </>
  )
}
