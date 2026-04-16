import { useRef, useLayoutEffect } from 'react'
import Navbar from '@/components/Navbar'
import ServiceCard from '@/components/ServiceCard'
import { runHeroEntrance } from '@/animations/heroAnimations'
import { SERVICE_ITEMS } from '@/constants/index'
import heroCharacter from '@/assets/images/hero/hero-character.png'
import '@/styles/hero.css'

/**
 * HeroSection — full-viewport cinematic hero.
 * Contains: Navbar, character image placeholder, headline,
 * tagline card, service pills, and mobile CTA.
 *
 * ConnectButton and CustomCursor are mounted at App root —
 * not here — so they persist across all pages.
 */
const HeroSection = () => {
  const heroRef = useRef(null)

  // Fire entrance animations on mount with GSAP context cleanup
  useLayoutEffect(() => {
    const cleanup = runHeroEntrance(heroRef.current)
    return cleanup
  }, [])

  return (
    <section className="hero-root" ref={heroRef} id="hero" aria-label="Hero section">

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <Navbar />

      {/* ── CHARACTER IMAGE ─────────────────────────────── */}
      <div className="hero-image-placeholder" aria-hidden="true">
        <img src={heroCharacter} alt="Zubair portrait" />
      </div>

      {/* ── HEADLINE TYPOGRAPHY ────────────────────────────── */}
      <div className="hero-headline" aria-label="Web Developer">
        <span className="headline-web">Web</span>
        <span className="headline-developer">Developer</span>
      </div>

      {/* ── TAGLINE GLASS CARD ─────────────────────────────── */}
      <div className="hero-tagline-card" role="complementary" aria-label="Tagline">
        <h2 className="tagline-heading">
          Code that speaks louder than words.
        </h2>
        <p className="tagline-body">
          Crafting scalable, high-performance web applications with modern
          technologies and a focus on user experience.
        </p>
      </div>

      {/* ── SERVICE CATEGORY PILLS ─────────────────────────── */}
      <div className="hero-service-grid" aria-label="Service categories">
        {SERVICE_ITEMS.map((item) => (
          <ServiceCard
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </div>

      {/* ── MOBILE CTA (hidden on desktop via CSS) ─────────── */}
      <button className="mobile-cta" aria-label="Get in touch">
        Get in touch
        <span className="mobile-cta-icon" aria-hidden="true">→</span>
      </button>

    </section>
  )
}

export default HeroSection
