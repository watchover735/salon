import { useMemo } from 'react'
import ScrollScrubCanvas from '../shared/ScrollScrubCanvas'
import ScrubOverlay from '../shared/ScrubOverlay'
import SectionHeading from '../shared/SectionHeading'
import GlassCard from '../shared/GlassCard'
import { createStraightenFx } from '../../lib/canvasFx'

type Plan = { name: string; price: string; note: string; features: string[]; featured?: boolean }

const PLANS: Plan[] = [
  {
    name: 'Essential',
    price: '₹1,499',
    note: 'Wash · Cut · Style',
    features: ['Consultation', 'Precision cut', 'Blow-dry finish', 'Style guidance'],
  },
  {
    name: 'Signature',
    price: '₹4,999',
    note: 'Straightening · Keratin',
    features: ['Everything in Essential', 'Keratin smoothening', 'Frizz-free 6 months', 'Home-care kit'],
    featured: true,
  },
  {
    name: 'Maison',
    price: '₹9,999',
    note: 'Full Transformation',
    features: ['Everything in Signature', 'Colour & global styling', 'Scalp & spa therapy', 'Dedicated stylist'],
  },
]

/**
 * SECTION 5 — STRAIGHTENING (Animation) followed by pricing cards (Information).
 */
export default function StraightenSection() {
  const draw = useMemo(() => createStraightenFx(), [])

  return (
    <>
      <ScrollScrubCanvas
        id="straighten"
        draw={draw}
        lengthVh={240}
        overlay={(p) => (
          <ScrubOverlay progress={p} eyebrow="Chapter II · Smooth" title="Chaos, pressed into" accent="silk." />
        )}
      />

      <div className="mx-auto max-w-6xl px-6 py-32">
        <SectionHeading eyebrow="Investment">Choose your transformation</SectionHeading>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <GlassCard
              key={plan.name}
              interactive
              gold={plan.featured}
              delay={i * 0.1}
              className={`relative flex flex-col p-8 ${plan.featured ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-gold/40 bg-ink px-4 py-1 font-sans text-[0.55rem] uppercase tracking-luxe text-gold">
                  Most Loved
                </span>
              )}
              <div className="font-sans text-[0.7rem] uppercase tracking-luxe text-gold/80">{plan.name}</div>
              <div className="mt-4 font-serif text-5xl font-light text-pearl">{plan.price}</div>
              <div className="mt-2 font-sans text-xs font-light text-ash">{plan.note}</div>
              <span className="hairline my-7 w-full" />
              <ul className="flex flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 font-sans text-sm font-light text-pearl/85">
                    <span className="h-1 w-1 rounded-full bg-gold" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="mt-8 rounded-full border border-white/15 py-3 font-sans text-[0.65rem] uppercase tracking-luxe text-pearl transition-colors duration-300 hover:border-gold/60 hover:text-gold">
                Reserve
              </button>
            </GlassCard>
          ))}
        </div>
      </div>
    </>
  )
}
