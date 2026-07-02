import { useMemo } from 'react'
import { motion } from 'framer-motion'
import ScrollScrubCanvas from '../shared/ScrollScrubCanvas'
import ScrubOverlay from '../shared/ScrubOverlay'
import SectionHeading from '../shared/SectionHeading'
import { createStyleFx } from '../../lib/canvasFx'
import { byId } from '../../lib/images'

const ease = [0.22, 1, 0.36, 1] as const

const TEAM = [
  { name: 'Aria Vance', role: 'Creative Director', years: '14 yrs', award: 'Vogue Stylist of the Year ’24', img: byId('luxury').src },
  { name: 'Milan Roy', role: 'Master Colourist', years: '11 yrs', award: 'L’Oréal Colour Trophy Finalist', img: byId('healthy').src },
  { name: 'Sana Kapoor', role: 'Texture Specialist', years: '9 yrs', award: 'Wella Craft Award ’23', img: byId('curly').src },
  { name: 'Dev Mehra', role: 'Barbering Lead', years: '12 yrs', award: 'GQ Grooming Guild', img: byId('messy').src },
]

/**
 * SECTION 7 — STYLING (Animation) followed by the Team (Information).
 * Cursor spotlight remains active over the portraits.
 */
export default function StyleTeamSection() {
  const draw = useMemo(() => createStyleFx(), [])

  return (
    <>
      <ScrollScrubCanvas
        id="styling"
        draw={draw}
        lengthVh={240}
        overlay={(p) => (
          <ScrubOverlay progress={p} eyebrow="Chapter IV · Style" title="The final, luminous" accent="flourish." />
        )}
      />

      <div className="mx-auto max-w-6xl px-6 py-32">
        <SectionHeading eyebrow="The Hands Behind It">Artisans, not employees</SectionHeading>
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-ink">
                <img
                  src={m.img}
                  alt={m.name}
                  draggable={false}
                  className="drag-none absolute inset-0 h-full w-full scale-105 object-cover object-top opacity-90 transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ filter: 'grayscale(0.35) contrast(1.05)' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(5,5,5,0.92) 100%)' }} />
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: 'radial-gradient(60% 50% at 50% 30%, rgba(139,0,0,0.25), transparent 70%)' }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="font-serif text-2xl font-light text-pearl">{m.name}</div>
                <div className="mt-1 font-sans text-[0.6rem] uppercase tracking-luxe text-gold/80">
                  {m.role} · {m.years}
                </div>
                <div className="mt-3 flex items-center gap-2 font-sans text-[0.7rem] font-light text-ash">
                  <span className="text-gold">✦</span>
                  {m.award}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}
