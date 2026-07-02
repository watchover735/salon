import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import ParticleField from '../shared/ParticleField'

const ease = [0.22, 1, 0.36, 1] as const

// Placeholder contact details — swap for the real salon's channels.
const PHONE = '+919876543210'
const WHATSAPP = 'https://wa.me/919876543210?text=I%27d%20like%20to%20book%20at%20Maison%20Noir'
const INSTAGRAM = 'https://instagram.com/maisonnoir.hair'
const MAPS = 'https://maps.google.com/?q=Maison+Noir+Hair+Atelier'

type Channel = { label: string; sub: string; href: string; icon: ReactNode }

const channels: Channel[] = [
  {
    label: 'WhatsApp',
    sub: 'Chat & book instantly',
    href: WHATSAPP,
    icon: (
      <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-1-.3-1.6-.6-2.9-1.3-4.8-4.2-4.9-4.4-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.6 1.6.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.3.1.7-.1 1.3Z" />
    ),
  },
  {
    label: 'Call Us',
    sub: PHONE,
    href: `tel:${PHONE}`,
    icon: (
      <path d="M6.6 10.8a15.9 15.9 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.6a1 1 0 0 1-.25 1l-2.22 2.2Z" />
    ),
  },
  {
    label: 'Instagram',
    sub: '@maisonnoir.hair',
    href: INSTAGRAM,
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.2" cy="6.8" r="1.1" />
      </>
    ),
  },
  {
    label: 'Find Us',
    sub: 'Google Maps',
    href: MAPS,
    icon: (
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    ),
  },
]

/**
 * SECTION 9 — BOOKING CTA. The closing beat. Deep red + gold ambient glow
 * echoing the hero, with the four booking channels.
 */
export default function BookingCTA() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-32">
      {/* ambient glow echo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 animate-breathe rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,0,0,0.22) 0%, rgba(212,175,55,0.06) 40%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <ParticleField variant="gold" intensity={0.5} count={50} />
      </div>

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease }}
          className="font-sans text-[0.7rem] uppercase tracking-luxe text-gold/80"
        >
          Your Transformation Awaits
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease, delay: 0.1 }}
          className="mt-6 font-serif text-5xl font-light leading-[1.05] text-pearl sm:text-6xl md:text-7xl"
        >
          Begin your <span className="text-gold-gradient italic">chapter.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
          className="mt-8 max-w-md font-sans text-sm font-light leading-relaxed text-ash"
        >
          Reserve a consultation with our master stylists. Every appointment begins
          with understanding — and ends in quiet luxury.
        </motion.p>

        <div className="mt-14 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass group flex flex-col items-center gap-3 rounded-2xl p-7 transition-colors duration-300 hover:border-gold/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors duration-300 group-hover:bg-gold/10">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                  {c.icon}
                </svg>
              </span>
              <span className="font-sans text-sm font-light text-pearl">{c.label}</span>
              <span className="font-sans text-[0.65rem] font-light text-ash">{c.sub}</span>
            </motion.a>
          ))}
        </div>

        <div className="mt-24 flex flex-col items-center gap-2">
          <div className="font-serif text-lg tracking-[0.3em] text-pearl">MAISON&nbsp;NOIR</div>
          <div className="font-sans text-[0.55rem] uppercase tracking-luxe text-ash">
            Hair Atelier · Open Tue–Sun · 10am–8pm
          </div>
          <div className="hairline mt-6 w-32" />
          <div className="mt-4 font-sans text-[0.6rem] font-light text-ash/70">
            © {new Date().getFullYear()} Maison Noir. Crafted, not templated.
          </div>
        </div>
      </div>
    </section>
  )
}
