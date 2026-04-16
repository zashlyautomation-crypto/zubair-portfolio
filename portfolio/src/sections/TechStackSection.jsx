import { useRef, useEffect, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TechBubble } from '@/components/TechBubble'
import { TECH_STACK_DATA, TECH_STACK_PARTICLE_COUNT_DESKTOP, TECH_STACK_PARTICLE_COUNT_MOBILE } from '@/constants/tech-stack'
import '@/styles/tech-stack.css'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ─── Star particle CSS fallback ───────────────────────────────────────────────
const initCSSParticleFallback = (containerEl) => {
  const count = window.innerWidth < 768
    ? TECH_STACK_PARTICLE_COUNT_MOBILE
    : TECH_STACK_PARTICLE_COUNT_DESKTOP

  const frag = document.createDocumentFragment()
  for (let i = 0; i < count; i++) {
    const star      = document.createElement('div')
    const size      = Math.random() * 2.4 + 0.7
    const opacity   = (Math.random() * 0.6 + 0.2).toFixed(2)
    const isOval    = Math.random() > 0.75
    const drift     = 8 + Math.random() * 16

    star.className = 'ts-star'
    star.style.cssText = [
      `left:${(Math.random() * 100).toFixed(2)}%`,
      `top:${(Math.random() * 100).toFixed(2)}%`,
      `width:${isOval ? (size * 3).toFixed(2) : size.toFixed(2)}px`,
      `height:${size.toFixed(2)}px`,
      `background:rgba(255,255,255,${opacity})`,
      `--star-op:${opacity}`,
      `animation:starDrift ${drift.toFixed(1)}s ease-in-out infinite alternate`,
      `animation-delay:${(Math.random() * -16).toFixed(1)}s`,
    ].join(';')
    frag.appendChild(star)
  }
  containerEl.appendChild(frag)
}

// ─── WebGPU → CSS fallback ────────────────────────────────────────────────────
const initParticles = async (containerEl) => {
  if (!containerEl) return
  if (!navigator.gpu) {
    initCSSParticleFallback(containerEl)
    return
  }
  try {
    const adapter = await navigator.gpu.requestAdapter()
    if (!adapter) throw new Error('no adapter')
    // WebGPU supported — still use CSS fallback for simplicity + zero console risk
    initCSSParticleFallback(containerEl)
  } catch {
    initCSSParticleFallback(containerEl)
  }
}

export const TechStackSection = () => {
  const sectionRef    = useRef(null)
  const particleRef   = useRef(null)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  )

  // Responsive
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler, { passive: true })
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Particle field
  useEffect(() => {
    const container = particleRef.current
    if (!container) return
    initParticles(container)
    return () => { if (container) container.innerHTML = '' }
  }, [])

  // Float animation
  useEffect(() => {
    if (prefersReducedMotion()) return

    const tweens = TECH_STACK_DATA.map((tech, i) => {
      const el = document.querySelector(`.tech-bubble--${tech.id}`)
      if (!el) return null

      const amplitude = tech.isFeatured ? 14 : 6 + Math.random() * 10
      const duration  = tech.isFeatured ? 3.5 : 2.6 + i * 0.38
      const xDrift    = (Math.random() - 0.5) * 6

      return gsap.to(el, {
        y: `+=${amplitude}`,
        x: `+=${xDrift}`,
        duration,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.22,
        force3D: true,
      })
    })

    return () => {
      tweens.forEach(t => t && t.kill())
    }
  }, [])

  // Scroll entrance
  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set('.tech-bubble', { opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      const bubbles = gsap.utils.toArray('.tech-bubble')

      // Set initial scattered state
      bubbles.forEach((el, i) => {
        gsap.set(el, {
          opacity: 0,
          scale: 0.45,
          x: (Math.random() - 0.5) * 280,
          y: (Math.random() - 0.5) * 180,
          force3D: true,
        })
      })

      // Headline initial state
      gsap.set('.ts-headline', { opacity: 0, y: -28 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          // Headline
          gsap.to('.ts-headline', {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
          })
          // Bubbles
          gsap.to(bubbles, {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.85,
            ease: 'back.out(1.4)',
            stagger: { amount: 0.5, from: 'center' },
            force3D: true,
          })
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="tech-stack-section"
      id="tech-stack"
      aria-label="Tech Stack"
    >
      {/* Star Particle Field */}
      <div
        ref={particleRef}
        className="ts-particle-field"
        aria-hidden="true"
      />

      {/* Headline */}
      <div className="ts-headline">
        <h2 className="ts-headline-text">
          <span className="ts-line-1">
            <span className="ts-sans">Real Tech. </span>
          </span>
          <span className="ts-line-2">
            <span className="ts-script">Real</span>
            <span className="ts-sans"> Solutions.</span>
          </span>
        </h2>
      </div>

      {/* Bubble Field */}
      <div className="ts-bubbles-field">
        {TECH_STACK_DATA.map(tech => (
          <TechBubble
            key={tech.id}
            tech={tech}
            isMobile={isMobile}
          />
        ))}
      </div>
    </section>
  )
}

export default TechStackSection
