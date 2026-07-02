import { useMemo } from 'react'
import { motion } from 'framer-motion'
import ScrollScrubCanvas from '../shared/ScrollScrubCanvas'
import ScrubOverlay from '../shared/ScrubOverlay'
import SectionHeading from '../shared/SectionHeading'
import BeforeAfter from '../shared/BeforeAfter'
import { createColorFx } from '../../lib/canvasFx'
import { byId } from '../../lib/images'

const ease = [0.22, 1, 0.36, 1] as const

const PAIRS = [
  { before: byId('dry').src, after: byId('luxury').src, title: 'Restored' },
  { before: byId('frizzy').src, after: byId('healthy').src, title: 'Tamed' },
  { before: byId('thinning').src, after: byId('curly').src, title: 'Revived' },
]

/**
 * SECTION 6 — COLOURING (Animation) followed by a Before/After gallery (Information).
 */
export default function ColorSection() {
  const draw = useMemo(() => createColorFx(), [])

  return (
    <>
      <ScrollScrubCanvas
        id="color"
        draw={draw}
        lengthVh={240}
        overlay={(p) => (
          <ScrubOverlay progress={p} eyebrow="Chapter III · Colour" title="Depth, poured from" accent="root to tip." />
        )}
      />

      <div className="mx-auto max-w-6xl px-6 py-32">
        <SectionHeading eyebrow="The Evidence">Drag to witness the change</SectionHeading>
        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
          {PAIRS.map((pair, i) => (
            <motion.div
              key={pair.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease, delay: i * 0.12 }}
              className="flex flex-col items-center"
            >
              <BeforeAfter beforeSrc={pair.before} afterSrc={pair.after} />
              <div className="mt-6 font-serif text-2xl font-light text-pearl">{pair.title}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}
