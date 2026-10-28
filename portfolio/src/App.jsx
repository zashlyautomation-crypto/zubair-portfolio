import { useEffect } from 'react'
import Lenis from 'lenis'
import CustomCursor from '@/components/CustomCursor'
import ConnectButton from '@/components/ConnectButton'
import HeroSection from '@/sections/HeroSection'
import WhyChooseMeSection from '@/sections/WhyChooseMeSection'
import ScrollStorySection from '@/sections/ScrollStorySection'
import TechStackSection from '@/sections/TechStackSection'
import VideoShowcaseSection from '@/sections/VideoShowcaseSection'
import { AboutSection } from '@/sections/AboutSection'
import { ProjectsSection } from '@/sections/ProjectsSection'
import FAQSection from '@/sections/FAQSection'
import FooterSection from '@/sections/FooterSection'
import { ContactPage } from '@/pages/ContactPage'
import { React19ServerActionsGuide } from '@/pages/React19ServerActionsGuide'
import { NextJsDeveloperFaisalabadPage } from '@/pages/NextJsDeveloperFaisalabadPage'
import { ComparisonGuidePage } from '@/pages/ComparisonGuidePage'
import { useState, useCallback } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { SiteIntro } from '@/components/SiteIntro'
import { ToastReminder } from '@/components/ToastReminder'
import { INTRO_CONFIG } from '@/constants'
import { motion, AnimatePresence } from 'framer-motion'
import { useSEO } from '@/hooks/useSEO'

import '@/styles/global.css'
import '@/styles/typography.css'
import '@/styles/utilities.css'

/**
 * initWebGPU — silent WebGPU detection with CSS/2D Canvas fallback.
 */
const initWebGPU = async () => {
  if (!navigator.gpu) {
    initCanvasFallback()
    return
  }
  try {
    const adapter = await navigator.gpu.requestAdapter()
    if (!adapter) {
      initCanvasFallback()
      return
    }
    document.documentElement.dataset.webgpu = 'true'
  } catch {
    initCanvasFallback()
  }
}

const initCanvasFallback = () => {
  document.documentElement.dataset.webgpu = 'false'
}

/**
 * HomePage — the "/" route.
 * Applies homepage-specific SEO metadata and renders all home sections.
 * The visually-hidden h1 provides a proper heading hierarchy for
 * screen readers and search crawlers without affecting the visual design.
 */
const HomePage = () => {
  useSEO({
    title: 'Zubair (ZASHLY) — React JS Developer | Faisalabad, PK',
    description: 'Zubair (ZASHLY / zashly craft) is a freelance React JS developer and UI/UX designer based in Faisalabad, Pakistan. Specialist in React 19, Next.js, Three.js, and GSAP.',
    canonical: 'https://zubairkaportfolio.netlify.app/',
  })
  return (
    <div className="home-container">
      {/* Visually-hidden h1 for SEO heading hierarchy — visible to crawlers and screen readers */}
      <h1 className="sr-only">
        Zubair (ZASHLY) — Freelance React JS Developer &amp; UI/UX Designer based in Faisalabad, Pakistan
      </h1>
      <HeroSection />
      <WhyChooseMeSection />
      <ScrollStorySection />
      <TechStackSection />
      <VideoShowcaseSection />
      <AboutSection />
      <ProjectsSection />
      <FAQSection />
      <FooterSection />
    </div>
  )
}

const App = () => {
  useEffect(() => {
    // ── Initialize Lenis smooth scroll ──────────────────────
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    window.__lenis = lenis

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    initWebGPU()

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  const location = useLocation()
  const path = location.pathname

  // ── Site Intro logic ──────────────────────────────────────
  const isHomePage = path === '/' || path === ''
  const alreadySeen = typeof window !== 'undefined' && sessionStorage.getItem(INTRO_CONFIG.sessionKey) === 'true'
  const [showIntro, setShowIntro] = useState(isHomePage && !alreadySeen)

  const [canRenderMain, setCanRenderMain] = useState(!showIntro)

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem(INTRO_CONFIG.sessionKey, 'true')
    setShowIntro(false)
    setCanRenderMain(true)
  }, [])

  return (
    <>
      {showIntro && <SiteIntro onComplete={handleIntroComplete} />}
      
      <CustomCursor />
      <ConnectButton />
      <div className="page-transition-overlay" aria-hidden="true" />

      <main className="app-main">
        <AnimatePresence>
          {canRenderMain && (
            <motion.div
              key="main-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <Routes>
                <Route 
                  path="/" 
                  element={<HomePage />} 
                />
                <Route path="/contact" element={<ContactPage />} />
                <Route 
                  path="/guides/react-19-server-actions-performance" 
                  element={<React19ServerActionsGuide />} 
                />
                <Route 
                  path="/hire-next-js-developer-faisalabad" 
                  element={<NextJsDeveloperFaisalabadPage />} 
                />
                <Route 
                  path="/comparisons/threejs-vs-spline-performance" 
                  element={<ComparisonGuidePage />} 
                />
              </Routes>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ToastReminder />
    </>
  )
}

export default App
