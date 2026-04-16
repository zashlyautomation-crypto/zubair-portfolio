import barba from '@barba/core'
import gsap from 'gsap'

/**
 * Barba.js Initialization with GSAP transitions.
 */
export const initBarba = () => {
  if (window.__barba_initialized) return

  barba.init({
    sync: true,
    transitions: [{
      name: 'premium-transition',
      async leave(data) {
        const done = this.async()
        
        // 1. Fade out current container
        gsap.to(data.current.container, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: 'power2.inOut'
        })

        // 2. Animate the transition overlay (from bottom to top)
        const overlay = document.querySelector('.page-transition-overlay')
        if (overlay) {
          await gsap.to(overlay, {
            scaleY: 1,
            duration: 0.7,
            ease: 'expo.inOut',
            transformOrigin: 'bottom'
          })
        }
        
        done()
      },

      async enter(data) {
        const done = this.async()
        
        // Ensure new container is at the top
        window.scrollTo(0, 0)
        
        // 1. Prepare next container
        gsap.set(data.next.container, { opacity: 0, y: 20 })

        // 2. Animate the transition overlay (shrink to top)
        const overlay = document.querySelector('.page-transition-overlay')
        if (overlay) {
          gsap.to(overlay, {
            scaleY: 0,
            duration: 0.7,
            ease: 'expo.inOut',
            transformOrigin: 'top',
            delay: 0.1
          })
        }

        // 3. Fade in next container
        gsap.to(data.next.container, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.3
        })

        done()
      }
    }]
  })

  window.barba = barba
  window.__barba_initialized = true
}

export default barba
