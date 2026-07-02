import { useRef, useState } from 'react'

type Props = {
  beforeSrc: string
  afterSrc: string
  beforeLabel?: string
  afterLabel?: string
}

/**
 * Draggable before/after comparison. Pointer / touch controls the reveal.
 * Both images are centred busts, so the wipe reads as one head changing.
 */
export default function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)

  const setFromClientX = (clientX: number) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(2, Math.min(98, pct)))
  }

  return (
    <div
      ref={ref}
      className="relative aspect-[283/340] w-full max-w-md select-none overflow-hidden rounded-2xl border border-white/10"
      style={{ touchAction: 'none' }}
      onPointerDown={(e) => {
        dragging.current = true
        ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
        setFromClientX(e.clientX)
      }}
      onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      {/* after (full) */}
      <img
        src={afterSrc}
        alt={afterLabel}
        draggable={false}
        className="drag-none absolute inset-0 h-full w-full object-cover"
      />
      {/* before (clipped to the left of the handle) */}
      <img
        src={beforeSrc}
        alt={beforeLabel}
        draggable={false}
        className="drag-none absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, filter: 'saturate(0.85) brightness(0.92)' }}
      />

      {/* labels */}
      <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 font-sans text-[0.55rem] uppercase tracking-luxe text-ash backdrop-blur">
        {beforeLabel}
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 font-sans text-[0.55rem] uppercase tracking-luxe text-gold/90 backdrop-blur">
        {afterLabel}
      </span>

      {/* handle */}
      <div
        className="absolute top-0 bottom-0 z-10 w-px bg-gold/80"
        style={{ left: `${pos}%`, boxShadow: '0 0 16px rgba(212,175,55,0.7)' }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60 bg-ink/80 backdrop-blur">
          <span className="font-sans text-gold text-xs">↔</span>
        </div>
      </div>
    </div>
  )
}
