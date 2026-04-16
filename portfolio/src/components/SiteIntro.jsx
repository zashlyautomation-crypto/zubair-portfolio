// src/components/SiteIntro.jsx
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { INTRO_CONFIG } from '@/constants'
import '@/styles/intro.css'

const LETTERS = INTRO_CONFIG.brandName.split('')

// ── Individual letter — hardware accelerated reveal ───────────────────────
const IntroLetter = ({ char, delay }) => (
  <span className="intro-letter-mask">
    <motion.span
      className="intro-letter"
      initial={{ y: '105%', opacity: 0 }}
      animate={{ y: '0%',   opacity: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.33, 1, 0.68, 1], // snappy quint out
      }}
    >
      {char}
    </motion.span>
  </span>
)

export const SiteIntro = ({ onComplete }) => {
  const [phase, setPhase]     = useState('logo')
  const rootRef   = useRef(null)
  const topRef    = useRef(null)
  const bottomRef = useRef(null)
  const seamRef   = useRef(null)
  const grainRef  = useRef(null)

  const reduced   = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced) {
      setTimeout(() => onComplete?.(), 400)
      return
    }

    const p = INTRO_CONFIG.phases
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // 1. Initial logo entrance animation (replacing Framer for finer control)
      // Done via Framer in JSX but we can add GSAP polish here if needed

      // 2. Seam glow reveal right before split
      tl.to(seamRef.current, {
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.inOut',
        delay: p.splitStart / 1000 - 0.3
      })

      // 3. The Split
      tl.to([topRef.current, bottomRef.current], {
        y: (i) => i === 0 ? '-100%' : '100%',
        duration: 0.9,
        ease: 'expo.inOut',
        onStart: () => setPhase('split')
      }, p.splitStart / 1000)

      // 4. Fade out seam and grain during split
      tl.to([seamRef.current, grainRef.current], {
        opacity: 0,
        duration: 0.3,
        ease: 'none'
      }, p.splitStart / 1000 + 0.1)

      // 5. Cleanup and complete
      tl.call(() => onComplete?.(), null, p.splitComplete / 1000)

    }, rootRef)

    const t1 = setTimeout(() => setPhase('name'),    p.nameReveal)
    const t2 = setTimeout(() => setPhase('tagline'), p.taglineIn)
    const t3 = setTimeout(() => setPhase('hold'),    p.holdDuration)

    return () => {
      ctx.revert()
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onComplete, reduced])

  if (reduced) {
    return (
      <motion.div
        className="intro-root"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        onAnimationComplete={onComplete}
        style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 9999 }}
      />
    )
  }

  return (
    <div ref={rootRef} className="intro-root" aria-hidden="true">
      <div ref={grainRef} className="intro-grain" />
      <div ref={seamRef} className="intro-seam" />

      {/* Top curtain half */}
      <div ref={topRef} className="intro-curtain intro-curtain--top">
        <div className="intro-content">

          {/* Logo mark — diamond with rotation polish */}
          <motion.div
            className="intro-logo-mark"
            initial={{ opacity: 0, scale: 0.3, rotate: -45 }}
            animate={{ opacity: 1, scale: 1,   rotate: 45 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Brand name — polished reveal */}
          <div className="intro-brand-name">
            {LETTERS.map((char, i) => (
              <IntroLetter
                key={i} char={char}
                delay={phase === 'logo' ? 99 : 0.08 + i * 0.06}
              />
            ))}
          </div>

          {/* Tagline + rule */}
          <AnimatePresence>
            {(phase === 'tagline' || phase === 'hold' || phase === 'split') && (
              <motion.div
                className="intro-tagline-wrapper"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <motion.div
                  className="intro-rule"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                  style={{ transformOrigin: 'left' }}
                />
                <p className="intro-tagline">{INTRO_CONFIG.tagline}</p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Bottom curtain half — mirrored */}
      <div ref={bottomRef} className="intro-curtain intro-curtain--bottom">
        <div className="intro-content intro-content--mirror" aria-hidden="true">
          <div className="intro-logo-mark intro-logo-mark--mirror" style={{ transform: 'rotate(45deg)' }} />
          <div className="intro-brand-name">
            {LETTERS.map((char, i) => (
              <span key={i} className="intro-letter-mask">
                <span className="intro-letter intro-letter--mirror">{char}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
