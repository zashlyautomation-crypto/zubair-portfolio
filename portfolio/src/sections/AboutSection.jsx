// src/sections/AboutSection.jsx
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import aboutImage from '@/assets/images/about/about-image.png'
import {
  ABOUT_LEFT_BLOCKS,
  ABOUT_RIGHT_BLOCKS,
  ABOUT_TAGLINE,
  ABOUT_WATERMARK,
} from '@/constants'
import '@/styles/about.css'

gsap.registerPlugin(ScrollTrigger)

const AboutBioBlock = ({ block, align }) => (
  <div className={`abb abb--${align}`}>
    <span className="abb-heading">{block.heading}</span>
    {block.items.map((item, i) => (
      <p key={i} className="abb-item">{item}</p>
    ))}
  </div>
)

export const AboutSection = () => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduced) {
        gsap.set([
          '.about-watermark',
          '.about-col-left .abb',
          '.about-col-right .abb',
          '.about-tagline',
        ], { opacity: 1, y: 0 })
        return
      }

      // Watermark
      gsap.fromTo('.about-watermark',
        { opacity: 0 },
        {
          opacity: 1, duration: 1.4, ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start:   'top 85%',
            once:    true,
          },
        }
      )

      // Left column blocks — stagger up from below
      gsap.fromTo('.about-col-left .abb',
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          duration: 0.65,
          stagger:  0.14,
          ease:     'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start:   'top 75%',
            once:    true,
          },
        }
      )

      // Right column blocks — stagger up from below, slight delay
      gsap.fromTo('.about-col-right .abb',
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          duration: 0.65,
          stagger:  0.14,
          ease:     'power3.out',
          delay:    0.08,
          scrollTrigger: {
            trigger: sectionRef.current,
            start:   'top 75%',
            once:    true,
          },
        }
      )


    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="about-section" id="about" aria-label="About">
      {/* Watermark — z-index 0, behind everything */}
      <div className="about-watermark" aria-hidden="true">
        {ABOUT_WATERMARK}
      </div>

      {/* Left column */}
      <div className="about-col-left">
        {ABOUT_LEFT_BLOCKS.map(block => (
          <AboutBioBlock key={block.id} block={block} align="left" />
        ))}
      </div>

      {/* Center column */}
      <div className="about-col-center">
        {/* Central portrait image instead of mask reveal */}
        <img
          src={aboutImage}
          alt="Zubair Portrait"
          className="about-center-image"
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            userSelect: 'none',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />


        {/* Tagline */}
        <div className="about-tagline">{ABOUT_TAGLINE}</div>
      </div>

      {/* Right column */}
      <div className="about-col-right">
        {ABOUT_RIGHT_BLOCKS.map(block => (
          <AboutBioBlock key={block.id} block={block} align="right" />
        ))}
      </div>
    </section>
  )
}
