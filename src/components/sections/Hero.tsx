import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { HAIRSTYLES, ALL_SRC } from '../../lib/images'
import { useImagePreload, usePrefersReducedMotion } from '../../lib/hooks'
import ParticleField from '../shared/ParticleField'

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
const ease = [0.4, 0, 0.2, 1] as const

type Stage = 'black' | 'glow' | 'reveal' | 'cycling' | 'done'

/**
 * SECTION 1 — HERO. Fully autoplay, scroll-independent. Runs its opening
 * sequence and 8-style cycle on mount; only after the final Luxury frame
 * settles does it reveal the "scroll to begin" cue. The mannequin bust never
 * changes — only the hairstyle image crossfades while the head is turned.
 */
export default function Hero() {
  const [stage, setStage] = useState<Stage>('black')
  const [index, setIndex] = useState(0)
  const [intensity, setIntensity] = useState(0.4)
  const [showCue, setShowCue] = useState(false)

  const head = useAnimationControls() // rotateY of the mannequin
  const push = useAnimationControls() // slow continuous push-in (scale)
  const sweep = useAnimationControls() // travelling lighting sweep
  const reduce = usePrefersReducedMotion()

  const { done: imagesReady } = useImagePreload(ALL_SRC)
  const cancelled = useRef(false)

  // ref mirror of imagesReady so the async opening loop can poll it
  const imagesReadyRef = useRef(false)
  useEffect(() => {
    imagesReadyRef.current = imagesReady
  }, [imagesReady])

  const runSweep = () =>
    sweep.start({
      x: ['-40%', '130%'],
      opacity: [0, 0.9, 0],
      transition: { duration: 1.1, ease },
    })

  useEffect(() => {
    cancelled.current = false
    const guard = () => cancelled.current

    async function run() {
      // 1. Pure black hold (~1s), also covers image preload
      await sleep(1000)
      // wait for images if slow, up to a small ceiling
      let waited = 0
      while (!imagesReadyRef.current && waited < 2000 && !guard()) {
        await sleep(100)
        waited += 100
      }
      if (guard()) return

      // 2. Red ambient glow fades in behind the mannequin
      setStage('glow')
      await sleep(900)
      if (guard()) return

      // 3. Mannequin fades in from darkness (+ subtle push-in begins)
      setStage('reveal')
      push.start({ scale: reduce ? 1 : 1.05, transition: { duration: 26, ease: 'linear' } })
      await sleep(1300)
      if (guard()) return

      // 4. Auto-cycle the styles (index 0 already shown)
      setStage('cycling')
      for (let i = 1; i < HAIRSTYLES.length; i++) {
        await transitionTo(i)
        if (guard()) return
      }

      // 5. Final flourish on Luxury: one more sweep, particles settle, calm
      runSweep()
      setIntensity(0.85)
      await sleep(500)
      if (guard()) return
      setIntensity(0.35)
      await sleep(900)
      if (guard()) return

      setStage('done')
      setShowCue(true)
    }

    async function transitionTo(i: number) {
      if (reduce) {
        // reduced motion: quiet crossfade only
        setIndex(i)
        await sleep(900)
        return
      }
      // a. rotate the head ~12°, particles briefly increase, lighting sweep
      setIntensity(1)
      head.start({ rotateY: 13, transition: { duration: 0.55, ease } })
      runSweep()
      await sleep(430)
      if (cancelled.current) return
      // b. morph the hairstyle while the head is turned
      setIndex(i)
      await sleep(320)
      if (cancelled.current) return
      // c. rotate smoothly back to front, particles settle
      head.start({ rotateY: 0, transition: { duration: 0.65, ease } })
      setIntensity(0.4)
      await sleep(650)
    }

    run()
    return () => {
      cancelled.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const current = HAIRSTYLES[index]
  const revealed = stage !== 'black' && stage !== 'glow'

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      {/* Red ambient glow behind the mannequin */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(139,0,0,0.35) 0%, rgba(139,0,0,0.12) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'black' ? 0 : [0.5, 0.75, 0.5] }}
        transition={{ opacity: { duration: 8, ease: 'easeInOut', repeat: Infinity } }}
      />

      {/* Particle field (hair motes) */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1.4, ease }}
        >
          <ParticleField variant="dust" intensity={intensity} count={80} />
        </motion.div>
      </div>

      {/* Mannequin with 3D turn + slow push-in */}
      <div className="relative z-10 flex h-full w-full items-center justify-center" style={{ perspective: 1400 }}>
        <motion.div
          animate={push}
          initial={{ scale: 1 }}
          className="relative"
          style={{ width: 'min(78vw, 46vh)', aspectRatio: '283 / 340' }}
        >
          <motion.div
            animate={head}
            initial={{ rotateY: 0 }}
            className="relative h-full w-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: revealed ? 1 : 0 }}
              transition={{ duration: 1.6, ease }}
              className="relative h-full w-full"
            >
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={current.id}
                  src={current.src}
                  alt={`${current.label} hairstyle on mannequin`}
                  className="drag-none absolute inset-0 h-full w-full object-contain"
                  draggable={false}
                  initial={{ opacity: 0, filter: 'blur(14px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(14px)' }}
                  transition={{ duration: 0.55, ease }}
                  style={{
                    filter:
                      'drop-shadow(0 30px 60px rgba(0,0,0,0.7)) drop-shadow(0 0 40px rgba(139,0,0,0.15))',
                  }}
                />
              </AnimatePresence>

              {/* travelling lighting sweep across the hair */}
              <motion.div
                aria-hidden
                animate={sweep}
                initial={{ opacity: 0, x: '-40%' }}
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 35%, rgba(255,235,190,0.55) 50%, transparent 65%)',
                  mixBlendMode: 'screen',
                }}
              />
            </motion.div>
          </motion.div>

          {/* soft key + red rim light that slowly breathes */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            animate={{ opacity: revealed ? [0.6, 0.85, 0.6] : 0 }}
            transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
            style={{
              background:
                'radial-gradient(60% 45% at 50% 30%, rgba(255,255,255,0.10), transparent 70%)',
              mixBlendMode: 'screen',
            }}
          />
        </motion.div>
      </div>

      {/* Style label (quiet, lower third) */}
      <AnimatePresence mode="wait">
        {stage === 'cycling' && (
          <motion.div
            key={current.id + '-label'}
            className="pointer-events-none absolute bottom-28 left-1/2 -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease }}
          >
            <span className="font-sans text-[0.65rem] uppercase tracking-luxe text-ash">
              {current.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand mark, top */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 1.8, ease, delay: 0.4 }}
      >
        <div className="font-serif text-lg tracking-[0.3em] text-pearl">MAISON&nbsp;NOIR</div>
        <div className="mt-1 font-sans text-[0.55rem] uppercase tracking-luxe text-gold/70">
          Hair Atelier
        </div>
      </motion.div>

      {/* Scroll cue — only after the whole hero settles */}
      <AnimatePresence>
        {showCue && (
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease }}
          >
            <span className="font-sans text-[0.62rem] uppercase tracking-luxe text-ash">
              Scroll to begin your transformation
            </span>
            <motion.span
              className="block h-10 w-px bg-gradient-to-b from-gold/70 to-transparent"
              animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity }}
              style={{ transformOrigin: 'top' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
