import { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStoryFrames } from '@/hooks/useStoryFrames'
import { initTextState, updateTextVisibility, updateFloatVisibility } from '@/animations/storyAnimations'
import { StoryProgressBar } from '@/components/StoryProgressBar'
import {
  TOTAL_FRAMES,
  STORY_SCROLL_MULTIPLIER,
  STORY_SCRUB_SPEED,
  FLOAT_POSITIONS,
} from '@/constants'
import '@/styles/story.css'

gsap.registerPlugin(ScrollTrigger)

export const ScrollStorySection = () => {
  const sectionRef   = useRef(null)
  const canvasRef    = useRef(null)
  const rafPendingRef = useRef(false)
  const currentFrameRef = useRef(0)
  const [storyProgress, setStoryProgress] = useState(0)

  const { images, loaded, loadProgress } = useStoryFrames()

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const floatPos = isMobile ? FLOAT_POSITIONS.mobile : FLOAT_POSITIONS.desktop

  // ─── Cover-fit draw — same visual behaviour as CSS object-fit: cover ───
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const img = images.current[index]
    if (!img || !img.complete) {
      const fallback = images.current[index - 1] || images.current[index + 1]
      if (!fallback) return
      drawImageToCanvas(canvas, fallback)
      return
    }
    drawImageToCanvas(canvas, img)
  }, [images])

  const drawImageToCanvas = (canvas, img) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { width: cw, height: ch } = canvas
    const { naturalWidth: iw, naturalHeight: ih } = img
    const scale = Math.max(cw / iw, ch / ih)
    const x = (cw - iw * scale) / 2
    const y = (ch - ih * scale) / 2
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, x, y, iw * scale, ih * scale)
  }

  // ─── rAF-guarded frame draw — never fires more than once per frame ───
  const safeDrawFrame = useCallback((index) => {
    if (rafPendingRef.current) return
    rafPendingRef.current = true
    requestAnimationFrame(() => {
      drawFrame(index)
      rafPendingRef.current = false
    })
  }, [drawFrame])

  // ─── Canvas resize handler — debounced at 150ms ───
  useEffect(() => {
    if (!loaded) return
    const resize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      safeDrawFrame(currentFrameRef.current)
    }
    resize() // set initial size
    let timer
    const debounced = () => { clearTimeout(timer); timer = setTimeout(resize, 150) }
    window.addEventListener('resize', debounced, { passive: true })
    return () => { window.removeEventListener('resize', debounced); clearTimeout(timer) }
  }, [loaded, safeDrawFrame])

  // ─── Continuous Float Animation ───
  useEffect(() => {
    if (!loaded) return

    const floatEls = document.querySelectorAll('.float-element')
    if (!floatEls.length) return

    floatEls.forEach((el, i) => {
      gsap.to(el, {
        y: `+=${10 + (i % 3) * 4}`,
        duration: 2.2 + (i * 0.3),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.18,
        overwrite: false,
      })
    })

    return () => {
      gsap.killTweensOf('.float-element')
    }
  }, [loaded])

  useLayoutEffect(() => {
    if (!loaded) return
    
    initTextState()

    const ctx = gsap.context(() => {
      // ─── Critical: sync Lenis with ScrollTrigger FIRST ───
      const lenisInstance = window.__lenis
      if (lenisInstance) {
        lenisInstance.on('scroll', ScrollTrigger.update)
        gsap.ticker.lagSmoothing(0)
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: STORY_SCRUB_SPEED,
        onUpdate: (self) => {
          const rawIndex = self.progress * (TOTAL_FRAMES - 1)
          const frameIndex = Math.round(rawIndex)

          setStoryProgress(self.progress)
          
          updateTextVisibility(self.progress)
          updateFloatVisibility(self.progress)

          // Only redraw if frame actually changed
          if (frameIndex === currentFrameRef.current) return
          currentFrameRef.current = frameIndex

          safeDrawFrame(frameIndex)
        },
        onEnter: () => {
          if (canvasRef.current) gsap.to(canvasRef.current, { autoAlpha: 1, duration: 0.4 })
          const progressBar = document.querySelector('.story-progress-bar')
          if (progressBar) gsap.to(progressBar, { autoAlpha: 1, duration: 0.4 })
          const hero = document.querySelector('.hero-root')
          if (hero) gsap.set(hero, { opacity: 0, pointerEvents: 'none' })
        },
        onLeave: () => {
          if (canvasRef.current) gsap.to(canvasRef.current, { autoAlpha: 0, duration: 0.4 })
          const progressBar = document.querySelector('.story-progress-bar')
          if (progressBar) gsap.to(progressBar, { autoAlpha: 0, duration: 0.4 })
        },
        onEnterBack: () => {
          if (canvasRef.current) gsap.to(canvasRef.current, { autoAlpha: 1, duration: 0.4 })
          const progressBar = document.querySelector('.story-progress-bar')
          if (progressBar) gsap.to(progressBar, { autoAlpha: 1, duration: 0.4 })
          const hero = document.querySelector('.hero-root')
          if (hero) gsap.set(hero, { opacity: 0, pointerEvents: 'none' })
        },
        onLeaveBack: () => {
          if (canvasRef.current) gsap.to(canvasRef.current, { autoAlpha: 0, duration: 0.4 })
          const progressBar = document.querySelector('.story-progress-bar')
          if (progressBar) gsap.to(progressBar, { autoAlpha: 0, duration: 0.4 })
          const hero = document.querySelector('.hero-root')
          if (hero) gsap.set(hero, { opacity: 1, pointerEvents: 'auto' })
        },
      })
    }, sectionRef)
    return () => {
      ctx.revert()
      if (window.__lenis) {
        window.__lenis.off('scroll', ScrollTrigger.update)
      }
    }
  }, [loaded, safeDrawFrame])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          display: loaded ? 'block' : 'none',
          opacity: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      />
      <section
        ref={sectionRef}
        style={{
          position: 'relative',
          height: `${TOTAL_FRAMES * STORY_SCROLL_MULTIPLIER}px`,
          zIndex: 1,
          background: 'transparent',
        }}
      >
        {/* Beat 1 — left text */}
        <div className="story-text beat-1-left" data-beat="beat-1" style={{ position:'fixed', left:'10vw', top:'50%', transform:'translateY(-50%)', zIndex:10, opacity:0, pointerEvents:'none' }}>
          <span className="st-line st-sans st-xl">A CURIOSITY</span>
          <span className="st-line st-sans st-xl">BORN AT 14</span>
        </div>

        {/* Beat 1 — right text */}
        <div className="story-text beat-1-right" data-beat="beat-1" style={{ position:'fixed', right:'10vw', bottom:'15%', zIndex:10, opacity:0, pointerEvents:'none', textAlign:'right' }}>
          <span className="st-line st-sans st-lg">TURNING COMPLEX</span>
          <span className="st-line st-sans st-lg">CODE INTO</span>
          <span className="st-line st-script st-lg-script">SeamLEss</span>
          <span className="st-line st-sans st-lg">EXPERIENCES.</span>
        </div>

        {/* Beat 2 — top center text */}
        <div className="story-text beat-2-top" data-beat="beat-2" style={{ position:'fixed', top:'18%', left:'50%', transform:'translateX(-50%)', zIndex:10, opacity:0, pointerEvents:'none', textAlign:'center', whiteSpace:'nowrap' }}>
          <span className="st-line st-sans st-xxl">MASTERING</span>
          <span className="st-line st-sans st-xxl">THE STACK</span>
        </div>

        {/* Beat 2 — bottom center text */}
        <div className="story-text beat-2-bottom" data-beat="beat-2" style={{ position:'fixed', bottom:'6%', left:'50%', transform:'translateX(-50%)', zIndex:10, opacity:0, pointerEvents:'none', textAlign:'center' }}>
          <span className="st-line st-sans st-lg">TRANSFORMING</span>
          <span className="st-line st-sans st-lg">PIXELS INTO</span>
          <span className="st-line st-script st-xxl-script">Purposeful</span>
          <span className="st-line st-sans st-lg">PRODUCTS</span>
        </div>

        {/* Floating code cards */}
        <div className="float-card float-element" style={{ ...floatPos.cardA }}>
          <span className="code-keyword">const</span> <span className="code-fn">App</span> = () {'=>'} {'{\n'}
          {'  '}<span className="code-fn">useEffect</span>(() {'=>'} {'{\n'}
          {'  '}{'}'}, []);{'\n'}
          {'  '}...{'\n'}
          {'}'};
        </div>
        <div className="float-card float-element" style={{ ...floatPos.cardB }}>
          <span className="code-keyword">const</span> <span className="code-fn">App</span>=() {'=>'} {'{\n'}
          {'  '}<span className="code-keyword">const</span> <span className="code-fn">antifn</span>() {'=>'} {'{\n'}
          {'  '}{'  '}...value=log.<span className="code-fn">Minus</span>();{'\n'}
          {'  '}{'}'}{'\n'}
          {'}'}
        </div>
        <div className="float-card float-element" style={{ ...floatPos.cardC }}>
          <span className="code-keyword">const</span> <span className="code-fn">App</span> = () {'=>'} {'{\n'}
          {'  '}<span className="code-fn">useEffect</span>(() {'=>'} () {'=>'} {'{\n'}
          {'  '}{'  '}system.cout.<span className="code-fn">logIn</span>(){'\n'}
          {'  '}...{'\n'}
          {'  '}{'}'});{'\n'}
          {'}'}
        </div>

        {/* Tech icon badges — doubled to match reference image density */}
        <div className="tech-badge float-element" style={{ ...floatPos.badgeJS1, background:'#F7DF1E', color:'#000', fontSize:'18px', letterSpacing:'0.02em', zIndex: 12 }}>JS</div>
        <div className="tech-badge float-element" style={{ ...floatPos.badgeJS2, background:'#F7DF1E', color:'#000', fontSize:'18px', letterSpacing:'0.02em', zIndex: 12 }}>JS</div>
        
        <div className="tech-badge float-element" style={{ ...floatPos.badgeReact, background:'#20232A', zIndex: 12 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <ellipse cx="12" cy="12" rx="2" ry="2" fill="#61DAFB"/>
            <ellipse cx="12" cy="12" rx="10" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none"/>
            <ellipse cx="12" cy="12" rx="10" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)"/>
            <ellipse cx="12" cy="12" rx="10" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)"/>
          </svg>
        </div>
        
        <div className="tech-badge float-element" style={{ ...floatPos.badgeS, background:'#6B21A8', color:'#fff', fontSize:'20px', zIndex: 12 }}>S</div>
        
        <div className="tech-badge float-element" style={{ ...floatPos.badgeTW, background:'#0f172a', zIndex: 12 }}>
          <svg width="26" height="18" viewBox="0 0 54 33" fill="none">
            <path d="M27 0C19.8 0 15.3 3.6 13.5 10.8C16.2 7.2 19.35 5.85 22.95 6.75C25.004 7.263 26.472 8.754 28.097 10.406C30.744 13.09 33.808 16.2 40.5 16.2C47.7 16.2 52.2 12.6 54 5.4C51.3 9 48.15 10.35 44.55 9.45C42.496 8.937 41.028 7.446 39.403 5.794C36.756 3.11 33.692 0 27 0ZM13.5 16.2C6.3 16.2 1.8 19.8 0 27C2.7 23.4 5.85 22.05 9.45 22.95C11.504 23.463 12.972 24.954 14.597 26.606C17.244 29.29 20.308 32.4 27 32.4C34.2 32.4 38.7 28.8 40.5 21.6C37.8 25.2 34.65 26.55 31.05 25.65C28.996 25.137 27.528 23.646 25.903 21.994C23.256 19.31 20.192 16.2 13.5 16.2Z" fill="#38BDF8"/>
          </svg>
        </div>

        {/* Progress sidebar */}
        <StoryProgressBar progress={storyProgress} />

      </section>
    </>
  )
}

export default ScrollStorySection
