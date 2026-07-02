import { motion, useTransform, type MotionValue } from 'framer-motion'

type Props = {
  progress: MotionValue<number>
  eyebrow: string
  title: string
  accent?: string
}

/**
 * Elegant overlay for the scroll-scrubbed sequences: a pinned title that fades
 * in at the start, a live scrub progress bar, and a "keep scrolling" cue that
 * fades out as the sequence completes. Purely reflects scroll — no autoplay.
 */
export default function ScrubOverlay({ progress, eyebrow, title, accent }: Props) {
  const titleOpacity = useTransform(progress, [0, 0.12, 0.8, 1], [0, 1, 1, 0.85])
  const titleY = useTransform(progress, [0, 0.15], [24, 0])
  const barScale = progress
  const cueOpacity = useTransform(progress, [0, 0.1, 0.85, 1], [0, 0.9, 0.9, 0])

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col">
      {/* readability scrim */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 60% at 50% 45%, transparent 40%, rgba(5,5,5,0.55) 100%), linear-gradient(180deg, rgba(5,5,5,0.6) 0%, transparent 30%, transparent 65%, rgba(5,5,5,0.85) 100%)',
        }}
      />

      <motion.div
        style={{ opacity: titleOpacity, y: titleY }}
        className="relative mt-[12vh] px-6 text-center"
      >
        <div className="mb-4 font-sans text-[0.7rem] uppercase tracking-luxe text-gold/80">
          {eyebrow}
        </div>
        <h2 className="mx-auto max-w-3xl font-serif text-4xl font-light leading-[1.05] text-pearl sm:text-5xl md:text-6xl">
          {title}
          {accent && <span className="text-gold-gradient italic"> {accent}</span>}
        </h2>
      </motion.div>

      {/* scrub progress bar */}
      <div className="relative mt-auto mb-16 flex flex-col items-center gap-4">
        <motion.span style={{ opacity: cueOpacity }} className="font-sans text-[0.6rem] uppercase tracking-luxe text-ash">
          Keep scrolling
        </motion.span>
        <div className="h-px w-40 overflow-hidden bg-white/10">
          <motion.div
            style={{ scaleX: barScale, transformOrigin: 'left' }}
            className="h-full w-full bg-gradient-to-r from-gold/60 to-gold"
          />
        </div>
      </div>
    </div>
  )
}
