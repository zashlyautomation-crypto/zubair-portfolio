import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '@/styles/why-choose-me.css'

gsap.registerPlugin(ScrollTrigger)

const WhyChooseMeSection = () => {
  const containerRef = useRef(null)
  const textRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the text while the section is sticky
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        animation: gsap.fromTo(
          textRef.current,
          { scale: 0.8, opacity: 0, y: 50 },
          { scale: 1, opacity: 1, y: 0, ease: 'power2.out' }
        ),
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="why-choose-me-container" ref={containerRef}>
      <div className="why-choose-me-sticky">
        <div className="wcm-content" ref={textRef}>
          <h2 className="wcm-heading">
            <span className="wcm-text">WHY Choosing ME</span>
            <span className="wcm-script">Is Better?</span>
          </h2>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseMeSection
