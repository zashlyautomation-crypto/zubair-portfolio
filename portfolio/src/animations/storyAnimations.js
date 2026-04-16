import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TEXT_WINDOWS } from '@/constants'

gsap.registerPlugin(ScrollTrigger)

// ─── Detect reduced motion preference ───────────────────────────────────────
const prefersReducedMotion = () => {
  if (typeof window !== 'undefined') return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return false
}

// ─── Set initial hidden state on all story text elements ────────────────────
export const initTextState = () => {
  gsap.set('.story-text', {
    opacity: 0,
    y: 20,
    force3D: true,
    willChange: 'opacity, transform',
  })
  gsap.set('.float-element', {
    opacity: 0,
    force3D: true,
    willChange: 'opacity, transform',
  })
}

// ─── Core visibility updater — called on every ScrollTrigger onUpdate ───────
export const updateTextVisibility = (progress) => {
  const reduced = prefersReducedMotion()

  Object.entries(TEXT_WINDOWS).forEach(([className, w]) => {
    // Only animate if the element exists and it's not a float-card rule
    if (className === 'float-cards') return
    const el = document.querySelector(`.${className}`)
    if (!el) return

    let opacity = 0
    let y = 0

    if (progress <= w.fadeInStart) {
      opacity = 0
      y = reduced ? 0 : 20
    } else if (progress <= w.fadeInEnd) {
      const t = (progress - w.fadeInStart) / (w.fadeInEnd - w.fadeInStart)
      opacity = t
      y = reduced ? 0 : 20 * (1 - t)
    } else if (progress <= w.holdEnd) {
      opacity = 1
      y = 0
    } else if (progress <= w.fadeOutEnd) {
      const t = (progress - w.fadeOutStart) / (w.fadeOutEnd - w.fadeOutStart)
      opacity = Math.max(0, 1 - t)
      y = reduced ? 0 : -15 * t
    } else {
      opacity = 0
      y = reduced ? 0 : -15
    }

    // Using duration: 0.2 for snapier but smooth follow
    gsap.to(el, { opacity, y, duration: 0.2, force3D: true, overwrite: 'auto' })
  })
}

// ─── Float element visibility — same fade system, same windows ──────────────
export const updateFloatVisibility = (progress) => {
  const w = TEXT_WINDOWS['float-cards']
  if (!w) return

  let opacity = 0

  if (progress <= w.fadeInStart) {
    opacity = 0
  } else if (progress <= w.fadeInEnd) {
    opacity = (progress - w.fadeInStart) / (w.fadeInEnd - w.fadeInStart)
  } else if (progress <= w.holdEnd) {
    opacity = 1
  } else if (progress <= w.fadeOutEnd) {
    opacity = Math.max(0, 1 - (progress - w.fadeOutStart) / (w.fadeOutEnd - w.fadeOutStart))
  } else {
    opacity = 0
  }

  // Set all float elements at once for batch performance
  const els = document.querySelectorAll('.float-element')
  if (els.length > 0) {
    gsap.to(els, { opacity, duration: 0.3, force3D: true, overwrite: 'auto' })
  }
}
