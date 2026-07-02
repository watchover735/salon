// Single source of truth for the mannequin stills.
// Filenames are the cleaned copies of the 8 originals in /public/mannequin.
// Order matches the intended hero auto-cycle (healthy -> damaged states -> luxury).

export type HairStyle = {
  id: string
  label: string
  src: string
  /** short descriptor shown during transitions / diagnostics */
  note: string
  /** true for the visibly damaged states used in the split reveal */
  damaged: boolean
}

const base = `${import.meta.env.BASE_URL}mannequin`

export const HAIRSTYLES: HairStyle[] = [
  { id: 'healthy',    label: 'Healthy',        src: `${base}/01-healthy.png`,     note: 'Balanced. Nourished. Alive.',            damaged: false },
  { id: 'messy',      label: 'Messy',          src: `${base}/02-messy.png`,       note: 'Unruly. Directionless.',                 damaged: true },
  { id: 'frizzy',     label: 'Frizzy',         src: `${base}/03-frizzy.png`,      note: 'Moisture lost to the air.',              damaged: true },
  { id: 'dry',        label: 'Dry',            src: `${base}/04-dry.png`,         note: 'Thirsty. Dull. Brittle.',                damaged: true },
  { id: 'split-ends', label: 'Split Ends',     src: `${base}/05-split-ends.png`,  note: 'Fractured at the tips.',                 damaged: true },
  { id: 'thinning',   label: 'Thinning',       src: `${base}/06-thinning.png`,    note: 'Density fading, root by root.',          damaged: true },
  { id: 'curly',      label: 'Curly',          src: `${base}/07-curly.png`,       note: 'Character, waiting to be shaped.',       damaged: false },
  { id: 'luxury',     label: 'Luxury Salon',   src: `${base}/08-luxury.png`,      note: 'The finished art.',                      damaged: false },
]

export const byId = (id: string) => HAIRSTYLES.find((h) => h.id === id)!

// Convenience anchors used across sections
export const HEALTHY = byId('healthy')
export const LUXURY = byId('luxury')
export const FRIZZY = byId('frizzy')
export const DRY = byId('dry')
export const THINNING = byId('thinning')

export const ALL_SRC = HAIRSTYLES.map((h) => h.src)
