// src/sections/ProjectsSection.jsx
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROJECTS_DATA } from '@/constants'
import card01Thumbnail from '@/assets/images/projects/zash-robot.png'
import card01Old from '@/assets/images/projects/ac2a4b3b-1203-49b2-a6d8-2252fbbdd5ec.png'
import card02 from '@/assets/images/projects/862e2e33-b4f9-40ad-98fb-79c3ddf76c0d.png'
import card03 from '@/assets/images/projects/09097360-cfaa-4397-a8a4-7b02960ccf91.png'
import '@/styles/projects.css'

gsap.registerPlugin(ScrollTrigger)

// ─── Map slot numbers to imported images ────────────────────────────────────
const IMAGES = {
  1: card01Old,   // keeping old reference just in case
  2: card02,
  3: card03,
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const ProjectsSection = () => {
  const sectionRef = useRef(null)
  const gridRef    = useRef(null)

  // ─── Scroll entrance animations ─────────────────────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      if (prefersReducedMotion()) {
        gsap.set(['.ps-card--full', '.ps-card--half'], {
          opacity: 1, y: 0, scale: 1,
        })
        return
      }

      // Card 1 — slides down from above, fades in, scales from slightly small
      gsap.fromTo('.ps-card--full',
        { opacity: 0, y: -40, scale: 0.97 },
        {
          opacity:  1,
          y:        0,
          scale:    1,
          duration: 0.90,
          ease:     'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start:   'top 80%',
            once:    true,
          },
        }
      )

      // Cards 2 and 3 — stagger up from below
      gsap.fromTo('.ps-card--half',
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity:  1,
          y:        0,
          scale:    1,
          duration: 0.80,
          ease:     'power3.out',
          stagger:  0.15,
          scrollTrigger: {
            trigger: gridRef.current,
            start:   'top 88%',
            once:    true,
          },
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="ps-section"
      id="projects"
      aria-label="Projects showcase"
    >
      <div className="ps-grid" ref={gridRef}>

        {/* ── Card 1 — Manual Layout ─────────────────────────────────────── */}
        <div className="ps-card ps-card--full">
          {/* Background Number */}
          <div className="ps-card__num-bg" aria-hidden="true">01</div>

          {/* Left: Thumbnail Screenshot */}
          <a
            href={PROJECTS_DATA[0].link}
            target="_blank"
            rel="noopener noreferrer"
            className="ps-card__thumb-wrap"
          >
            <img
              className="ps-card__img"
              src={card01Thumbnail}
              alt={PROJECTS_DATA[0].alt}
              loading="lazy"
              decoding="async"
              draggable="false"
            />
          </a>

          {/* Right: Project Details */}
          <div className="ps-card__details">
            <div className="ps-card__header">
              <h2 className="ps-card__title">ZASH</h2>
              <p className="ps-card__subtitle">Futuristic & Interactive Design</p>
            </div>

            <div className="ps-card__logos">
              {/* Logo 1 */}
              <svg viewBox="0 0 24 24" fill="none" stroke="white" className="ps-card__logo-icon">
                <circle cx="12" cy="12" r="10" strokeWidth="1.5" opacity="0.5"/>
                <path d="M9 16V8L15 16V8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {/* Logo 2 */}
              <svg viewBox="0 0 24 24" fill="none" stroke="white" className="ps-card__logo-icon">
                <path d="M12 4L4 20H20L12 4Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {/* Logo 3 */}
              <svg viewBox="0 0 24 24" fill="none" stroke="white" className="ps-card__logo-icon">
                <path d="M4 12C6.5 9 8.5 15 11 12C13.5 9 15.5 15 18 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <a
              href={PROJECTS_DATA[0].link}
              target="_blank"
              rel="noopener noreferrer"
              className="ps-card__cta"
            >
              View Case Study
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ marginLeft: '8px' }}>
                <path d="M4 9H14M14 9L10 5M14 9L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        {/* ── Card 2 — Half width, left ───────────────────────────────── */}
        <a
          href={PROJECTS_DATA[1].link}
          target="_blank"
          rel="noopener noreferrer"
          className="ps-card ps-card--half"
        >
          <img
            className="ps-card__img"
            src={IMAGES[2]}
            alt={PROJECTS_DATA[1].alt}
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        </a>

        {/* ── Card 3 — Half width, right ──────────────────────────────── */}
        <a
          href={PROJECTS_DATA[2].link}
          target="_blank"
          rel="noopener noreferrer"
          className="ps-card ps-card--half"
        >
          <img
            className="ps-card__img"
            src={IMAGES[3]}
            alt={PROJECTS_DATA[2].alt}
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        </a>

      </div>
    </section>
  )
}
