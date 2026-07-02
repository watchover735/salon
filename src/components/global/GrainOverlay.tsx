/**
 * Fixed, ultra-subtle film-grain overlay for a handcrafted, non-digital feel.
 * Pure inline SVG (no asset request). Very low opacity, screen blend.
 */
export default function GrainOverlay() {
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>
        <feColorMatrix type='saturate' values='0'/>
      </filter>
      <rect width='100%' height='100%' filter='url(#n)'/>
    </svg>`,
  )
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.05] mix-blend-screen"
      style={{ backgroundImage: `url("data:image/svg+xml,${svg}")` }}
    />
  )
}
