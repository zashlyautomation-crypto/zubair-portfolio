import gsap from 'gsap'
import { ANIMATION_EASE } from '@/constants/index'

/**
 * runHeroEntrance — fires all entrance animations for the hero section.
 * Called from HeroSection.jsx inside a useLayoutEffect.
 * Returns a cleanup function that reverts the GSAP context.
 *
 * @param {HTMLElement} container — the hero section DOM node (scoped context)
 */
export const runHeroEntrance = (container) => {
  if (!container) return () => {}

  const ctx = gsap.context(() => {
    // Respect prefers-reduced-motion
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (reducedMotion) {
      gsap.set(
        [
          '.navbar-expanded',
          '.headline-web',
          '.headline-developer',
          '.hero-tagline-card',
          '.service-card',
        ],
        { opacity: 1, x: 0, y: 0 }
      )
      return
    }

    // Initial state — hide everything before timeline runs
    gsap.set('.navbar-expanded', { y: -30, opacity: 0 })
    gsap.set('.headline-web', { x: -60, opacity: 0 })
    gsap.set('.headline-developer', { x: -60, opacity: 0 })
    gsap.set('.hero-tagline-card', { x: 40, opacity: 0 })
    gsap.set('.service-card', { y: 30, opacity: 0 })

    const tl = gsap.timeline({ defaults: { ease: ANIMATION_EASE } })

    tl.to('.navbar-expanded', {
      y: 0,
      opacity: 1,
      duration: 0.8,
    })
      .to(
        '.headline-web',
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
        },
        '-=0.4'
      )
      .to(
        '.headline-developer',
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
        },
        '-=0.7'
      )
      .to(
        '.hero-tagline-card',
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
        },
        '-=0.6'
      )
      .to(
        '.service-card',
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
        },
        '-=0.5'
      )
  }, container)

  return () => ctx.revert()
}
