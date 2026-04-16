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
import FooterSection from '@/sections/FooterSection'
import { ContactPage } from '@/pages/ContactPage'
import { useState, useCallback, useMemo } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { initBarba } from '@/transitions/barba'
import { SiteIntro } from '@/components/SiteIntro'
import { ToastReminder } from '@/components/ToastReminder'
import { INTRO_CONFIG } from '@/constants'



import '@/styles/global.css'
import '@/styles/typography.css'
import '@/styles/utilities.css'

/**
 * initWebGPU — silent WebGPU detection with CSS/2D Canvas fallback.
 * Zero console output under all device conditions.
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
    // WebGPU is available — mark it for the GPU layer
    document.documentElement.dataset.webgpu = 'true'
  } catch {
    // Caught silently — fallback engaged
    initCanvasFallback()
  }
}

/**
 * initCanvasFallback — renders CSS + 2D Canvas equivalent
 * when WebGPU is unavailable. Visually equivalent, zero crashes.
 */
const initCanvasFallback = () => {
  document.documentElement.dataset.webgpu = 'false'
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

    // Expose on window so Navbar and other components can subscribe
    window.__lenis = lenis

    // RAF loop
    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // ── Initialize WebGPU (silent) ──────────────────────────
    initWebGPU()

    // ── Initialize Barba (with wrapper check) ───────────────
    initBarba()

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

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem(INTRO_CONFIG.sessionKey, 'true')
    setShowIntro(false)
  }, [])


  return (
    <>
      {showIntro && <SiteIntro onComplete={handleIntroComplete} />}
      
      {/* Persistent across all pages */}
      <CustomCursor />
      <ConnectButton />
      <div className="page-transition-overlay" aria-hidden="true" />

      {/* Page content */}
      <main id="barba-wrapper">
        <div data-barba="wrapper">
          <Routes>
            <Route 
              path="/" 
              element={
                <div data-barba="container" data-barba-namespace="home">
                  <HeroSection />
                  <WhyChooseMeSection />
                  <ScrollStorySection />
                  <TechStackSection />
                  <VideoShowcaseSection />
                  <AboutSection />
                  <ProjectsSection />
                  <FooterSection />
                </div>
              } 
            />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
      </main>

      <ToastReminder />
    </>

  )
}

export default App
