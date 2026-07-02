import type { DrawArgs } from '../components/shared/ScrollScrubCanvas'
import { HAIRSTYLES } from './images'

// ---------- helpers ----------

export function loadImg(src: string): HTMLImageElement {
  const im = new Image()
  im.src = src
  return im
}

const ease = (t: number) => t * t * (3 - 2 * t) // smoothstep
const clamp01 = (t: number) => Math.max(0, Math.min(1, t))

/** Draw an image "cover" into w×h, centred, with optional uniform scale. */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  scale = 1,
) {
  if (!img.complete || img.naturalWidth === 0) return
  const ir = img.naturalWidth / img.naturalHeight
  const cr = w / h
  let dw = w
  let dh = h
  if (ir > cr) {
    dh = h
    dw = h * ir
  } else {
    dw = w
    dh = w / ir
  }
  dw *= scale
  dh *= scale
  const dx = (w - dw) / 2
  const dy = (h - dh) / 2
  ctx.drawImage(img, dx, dy, dw, dh)
}

const src = (id: string) => HAIRSTYLES.find((s) => s.id === id)!.src

// ---------- Section 4 · Hair Wash (foam + water) ----------

export function createWashFx() {
  const before = loadImg(src('dry'))
  const after = loadImg(src('healthy'))
  const bubbles = Array.from({ length: 90 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 2 + Math.random() * 9,
    drift: (Math.random() - 0.5) * 0.4,
    phase: Math.random() * Math.PI * 2,
  }))

  return ({ ctx, w, h, progress, time }: DrawArgs) => {
    const p = ease(progress)
    // crossfade dry -> clean as it is washed
    drawCover(ctx, before, w, h)
    ctx.save()
    ctx.globalAlpha = p
    drawCover(ctx, after, w, h)
    ctx.restore()

    // wet sheen sweeping down
    const sheenY = h * (progress * 1.3 - 0.15)
    const grad = ctx.createLinearGradient(0, sheenY - 120, 0, sheenY + 120)
    grad.addColorStop(0, 'rgba(255,255,255,0)')
    grad.addColorStop(0.5, `rgba(210,225,235,${0.12 * (1 - Math.abs(0.5 - progress) * 1.4)})`)
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // foam bubbles peak mid-wash (bell curve on progress)
    const bell = Math.sin(Math.PI * clamp01(progress)) // 0->1->0
    const cx = w * 0.5
    const cy = h * 0.4
    ctx.save()
    for (const b of bubbles) {
      const bx = cx + (b.x - 0.5) * w * 0.5 + Math.sin(time * 0.6 + b.phase) * 6
      const by = cy + (b.y - 0.5) * h * 0.5 - progress * 20 + b.drift * 30
      const a = 0.5 * bell * (0.6 + 0.4 * Math.sin(time + b.phase))
      ctx.beginPath()
      ctx.arc(bx, by, b.r * (0.6 + bell * 0.7), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(245,248,250,${a})`
      ctx.fill()
      ctx.beginPath()
      ctx.arc(bx - b.r * 0.3, by - b.r * 0.3, b.r * 0.25 * (0.6 + bell), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${a * 0.9})`
      ctx.fill()
    }
    ctx.restore()

    // final clean shine
    if (progress > 0.85) {
      ctx.save()
      ctx.globalAlpha = (progress - 0.85) / 0.15
      const g = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.35, w * 0.4)
      g.addColorStop(0, 'rgba(255,255,255,0.14)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      ctx.restore()
    }
  }
}

// ---------- Section 5 · Straightening (heat shimmer + iron pass) ----------

export function createStraightenFx() {
  const before = loadImg(src('frizzy'))
  const after = loadImg(src('healthy'))

  return ({ ctx, w, h, progress, time }: DrawArgs) => {
    const p = ease(progress)
    drawCover(ctx, before, w, h)
    ctx.save()
    ctx.globalAlpha = p
    drawCover(ctx, after, w, h)
    ctx.restore()

    // travelling flat-iron glow bar top -> bottom
    const barY = h * (progress * 1.2 - 0.1)
    const bar = ctx.createLinearGradient(0, barY - 60, 0, barY + 60)
    bar.addColorStop(0, 'rgba(212,175,55,0)')
    bar.addColorStop(0.5, 'rgba(255,220,150,0.28)')
    bar.addColorStop(1, 'rgba(139,0,0,0)')
    ctx.fillStyle = bar
    ctx.fillRect(0, barY - 60, w, 120)

    // heat shimmer just above the bar — fades as hair is smoothed
    const shimmerA = 0.10 * (1 - progress)
    ctx.save()
    ctx.globalAlpha = shimmerA
    for (let i = 0; i < 26; i++) {
      const y = barY - 60 - i * 5
      const off = Math.sin(time * 2 + i * 0.6) * 6
      ctx.beginPath()
      ctx.moveTo(w * 0.32 + off, y)
      ctx.bezierCurveTo(w * 0.42, y - 8, w * 0.58, y + 8, w * 0.68 + off, y)
      ctx.strokeStyle = 'rgba(255,210,170,1)'
      ctx.lineWidth = 1
      ctx.stroke()
    }
    ctx.restore()

    // sleek vertical sheen once smoothed
    if (progress > 0.6) {
      ctx.save()
      ctx.globalAlpha = (progress - 0.6) / 0.4
      const g = ctx.createLinearGradient(w * 0.42, 0, w * 0.58, 0)
      g.addColorStop(0, 'rgba(255,255,255,0)')
      g.addColorStop(0.5, 'rgba(255,255,255,0.16)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      ctx.restore()
    }
  }
}

// ---------- Section 6 · Colouring (colour-fill wipe) ----------

export function createColorFx() {
  const before = loadImg(src('healthy'))
  const after = loadImg(src('luxury'))

  return ({ ctx, w, h, progress }: DrawArgs) => {
    drawCover(ctx, before, w, h)

    // colour dissolves in from the roots downward via a soft wipe mask
    const wipe = ease(progress)
    ctx.save()
    ctx.beginPath()
    const edge = h * (wipe * 1.25)
    ctx.rect(0, 0, w, edge)
    ctx.clip()
    drawCover(ctx, after, w, h)
    // warm colour tint along the active edge
    const tint = ctx.createLinearGradient(0, edge - 140, 0, edge)
    tint.addColorStop(0, 'rgba(139,0,0,0)')
    tint.addColorStop(1, `rgba(139,0,0,${0.22 * Math.sin(Math.PI * clamp01(progress))})`)
    ctx.fillStyle = tint
    ctx.fillRect(0, 0, w, edge)
    ctx.restore()

    // glowing wipe line
    ctx.save()
    ctx.globalAlpha = Math.sin(Math.PI * clamp01(progress))
    const line = ctx.createLinearGradient(0, edge - 3, 0, edge + 3)
    line.addColorStop(0, 'rgba(212,175,55,0)')
    line.addColorStop(0.5, 'rgba(212,175,55,0.7)')
    line.addColorStop(1, 'rgba(212,175,55,0)')
    ctx.fillStyle = line
    ctx.fillRect(0, edge - 3, w, 6)
    ctx.restore()
  }
}

// ---------- Section 7 · Styling (gold light sweep) ----------

export function createStyleFx() {
  const base = loadImg(src('luxury'))

  return ({ ctx, w, h, progress, time }: DrawArgs) => {
    drawCover(ctx, base, w, h, 1 + progress * 0.03)

    // diagonal gold light sweep travelling with scroll
    const sweep = progress * 1.4 - 0.2
    const cx = w * sweep
    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    const g = ctx.createLinearGradient(cx - w * 0.25, 0, cx + w * 0.25, h)
    g.addColorStop(0, 'rgba(212,175,55,0)')
    g.addColorStop(0.5, `rgba(255,225,150,${0.22 + 0.12 * Math.sin(time)})`)
    g.addColorStop(1, 'rgba(212,175,55,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    ctx.restore()

    // rising shine intensifies toward the end
    ctx.save()
    ctx.globalAlpha = ease(progress)
    const r = ctx.createRadialGradient(w * 0.5, h * 0.34, 0, w * 0.5, h * 0.34, w * 0.45)
    r.addColorStop(0, 'rgba(255,240,200,0.16)')
    r.addColorStop(1, 'rgba(255,240,200,0)')
    ctx.fillStyle = r
    ctx.fillRect(0, 0, w, h)
    ctx.restore()
  }
}
