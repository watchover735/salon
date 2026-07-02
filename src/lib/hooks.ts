import { useEffect, useState } from 'react'

/** Reactive media query. Returns false during SSR / before mount. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = () => setMatches(mq.matches)
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}

/** True on touch / coarse pointer devices — used to disable the cursor spotlight. */
export function useIsTouch(): boolean {
  const coarse = useMediaQuery('(pointer: coarse)')
  const noHover = useMediaQuery('(hover: none)')
  return coarse || noHover
}

/** Respects the user's reduced-motion preference. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/** Preload a list of image URLs; resolves count of loaded images. */
export function useImagePreload(srcs: string[]): { loaded: number; done: boolean } {
  const [loaded, setLoaded] = useState(0)

  useEffect(() => {
    let active = true
    let count = 0
    if (srcs.length === 0) {
      setLoaded(0)
      return
    }
    srcs.forEach((src) => {
      const img = new Image()
      const bump = () => {
        if (!active) return
        count += 1
        setLoaded(count)
      }
      img.onload = bump
      img.onerror = bump
      img.src = src
    })
    return () => {
      active = false
    }
  }, [srcs.join('|')]) // eslint-disable-line react-hooks/exhaustive-deps

  return { loaded, done: loaded >= srcs.length }
}
