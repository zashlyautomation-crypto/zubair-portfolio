import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import '@/styles/hero.css'
import { NAV_LINKS, NAVBAR_SCROLL_THRESHOLD } from '@/constants/index'

/**
 * Navbar — three states managed entirely here:
 *
 * STATE 1 — Desktop at rest (< 50px scroll):
 *   Full-width: ZASHLY | [home · about · projects pill] | [Get in touch →]
 *   position: fixed, top of viewport
 *
 * STATE 2 — Desktop scrolled (> 50px scroll):
 *   Compact frosted glass pill: ZASHLY  ≡
 *   position: fixed, centered, shrinks into pill
 *
 * STATE 3 — Mobile (< 768px):
 *   Always shows: ZASHLY on left, hamburger on right
 *   Handled via CSS — desktop elements hidden
 *
 * Hamburger always toggles the drawer on both scrolled + mobile.
 */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lenisRef = useRef(null)
  const navigate = useNavigate()

  // ── Scroll detection ──────────────────────────────────────
  useEffect(() => {
    const handleScroll = (scrollVal) => {
      setIsScrolled(scrollVal > NAVBAR_SCROLL_THRESHOLD)
    }

    // Try Lenis first, fall back to window scroll
    const tryLenis = () => {
      if (window.__lenis) {
        const cb = ({ scroll }) => handleScroll(scroll)
        window.__lenis.on('scroll', cb)
        lenisRef.current = { instance: window.__lenis, cb }
      } else {
        const cb = () => handleScroll(window.scrollY)
        window.addEventListener('scroll', cb, { passive: true })
        lenisRef.current = { listener: cb }
      }
    }

    // Lenis may init after this component mounts
    const timer = setTimeout(tryLenis, 100)

    return () => {
      clearTimeout(timer)
      if (lenisRef.current?.instance) {
        lenisRef.current.instance.off('scroll', lenisRef.current.cb)
      } else if (lenisRef.current?.listener) {
        window.removeEventListener('scroll', lenisRef.current.listener)
      }
    }
  }, [])

  // Close drawer on scroll
  useEffect(() => {
    if (isScrolled) setMenuOpen(false)
  }, [isScrolled])

  const toggleMenu = () => setMenuOpen((v) => !v)
  const closeMenu = () => setMenuOpen(false)

  const handleNavClick = (e, href) => {
    e.preventDefault()
    const targetId = href === '/' ? 'hero' : href.replace('/', '').replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      if (window.__lenis) {
        window.__lenis.scrollTo(element, { offset: 0, duration: 1.2 })
      } else {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    // Also close the mobile menu if open
    closeMenu()
  }

  return (
    <>
      <nav
        className={`navbar-expanded ${isScrolled ? 'scrolled' : ''}`}
        aria-label="Main navigation"
      >
        <div className="navbar-brand">ZASHLY</div>

        <div className="navbar-links-container">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`nav-link${link.active ? ' active' : ''}`}
              aria-current={link.active ? 'page' : undefined}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <button 
          className="navbar-cta" 
          aria-label="Get in touch"
          onClick={() => navigate('/contact')}
        >
          <span className="cta-text">Get in touch</span>
          <span className="cta-icon" aria-hidden="true">→</span>
        </button>
      </nav>

      {/* ════════════════════════════════════════════════════
          MOBILE NAV BAR — always visible on ≤ 767px
          CSS hides desktop bars, shows this one
      ════════════════════════════════════════════════════ */}
      <div className="navbar-mobile" aria-label="Mobile navigation">
        <div className="navbar-brand">ZASHLY</div>
        <button
          className="mobile-hamburger-btn"
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <HamburgerBars open={menuOpen} />
        </button>
      </div>

      {/* ════════════════════════════════════════════════════
          SLIDE-DOWN DRAWER — triggered by any hamburger
          Works for both desktop-scrolled + mobile states
      ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="nav-drawer"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation drawer"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`drawer-link${link.active ? ' active' : ''}`}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#/contact"
              className="drawer-cta"
              onClick={(e) => { 
                e.preventDefault()
                closeMenu()
                navigate('/contact')
              }}
            >
              Get in touch
              <span className="cta-icon" aria-hidden="true">→</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/** Pure SVG hamburger bars — animates into X when open */
const HamburgerBars = ({ open }) => (
  <span className="hamburger-wrap" aria-hidden="true">
    <span className={`h-bar h-bar-1${open ? ' open' : ''}`} />
    <span className={`h-bar h-bar-2${open ? ' open' : ''}`} />
    <span className={`h-bar h-bar-3${open ? ' open' : ''}`} />
  </span>
)

export default Navbar
