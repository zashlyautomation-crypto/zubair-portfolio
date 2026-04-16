import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import '@/styles/hero.css'
import {
  CURSOR_RING_SIZE,
  CURSOR_RING_HOVER_SIZE,
  CURSOR_RING_HOVER_COLOR,
  CURSOR_RING_COLOR,
} from '@/constants/index'

/**
 * CustomCursor — dual cursor (orange dot + white ring with lag).
 * Mount at App root to persist across all pages.
 * Disables entirely on touch devices.
 */
const CustomCursor = () => {
  // Disable on touch devices — no render at all
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null
  }

  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    // Also check at effect time
    if ('ontouchstart' in window) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Direct DOM updates for dot — zero lag
    const onMouseMove = (e) => {
      const { clientX, clientY } = e

      // Dot follows instantly via direct style mutation
      dot.style.left = `${clientX}px`
      dot.style.top = `${clientY}px`

      // Ring follows with GSAP lag
      gsap.to(ring, {
        left: clientX,
        top: clientY,
        duration: 0.15,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    // Hover state — expand ring and change color
    const onMouseOver = (e) => {
      const target = e.target.closest('a, button, .service-card')
      if (target) {
        gsap.to(ring, {
          width: CURSOR_RING_HOVER_SIZE,
          height: CURSOR_RING_HOVER_SIZE,
          borderColor: CURSOR_RING_HOVER_COLOR,
          duration: 0.2,
          overwrite: 'auto',
        })
      }
    }

    const onMouseOut = (e) => {
      const target = e.target.closest('a, button, .service-card')
      if (target) {
        gsap.to(ring, {
          width: CURSOR_RING_SIZE,
          height: CURSOR_RING_SIZE,
          borderColor: CURSOR_RING_COLOR,
          duration: 0.2,
          overwrite: 'auto',
        })
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseover', onMouseOver, { passive: true })
    document.addEventListener('mouseout', onMouseOut, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}

export default CustomCursor
