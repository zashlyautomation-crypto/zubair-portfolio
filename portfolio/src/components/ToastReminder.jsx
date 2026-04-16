import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { TOAST_CONFIG } from '@/constants'
import '@/styles/toast.css'

export const ToastReminder = () => {
  const [visible, setVisible]     = useState(false)
  const firstTimerRef = useRef(null)
  const repeatTimerRef = useRef(null)
  const dismissedAt   = useRef(null)
  
  const location = useLocation()
  const navigate = useNavigate()

  // Check if currently on contact page
  const isContactPage = location.pathname === '/contact'

  // Show the toast — only if not on contact page
  const showToast = useCallback(() => {
    if (isContactPage) return
    // If manually dismissed, respect cooldown
    if (dismissedAt.current) {
      const elapsed = Date.now() - dismissedAt.current
      if (elapsed < TOAST_CONFIG.dismissCooldown) return
    }
    setVisible(true)
  }, [isContactPage])

  // Hide the toast
  const hideToast = useCallback(() => {
    setVisible(false)
  }, [])

  // Manual dismiss — sets cooldown timer
  const handleDismiss = useCallback((e) => {
    e.stopPropagation()
    dismissedAt.current = Date.now()
    hideToast()
  }, [hideToast])

  // CTA click — navigate to contact
  const handleCTA = useCallback(() => {
    hideToast()
    navigate('/contact')
  }, [hideToast, navigate])

  useEffect(() => {
    // First appearance after delay
    firstTimerRef.current = setTimeout(() => {
      showToast()
    }, TOAST_CONFIG.firstAppearDelay)

    // Repeat interval — recheck every interval
    repeatTimerRef.current = setInterval(() => {
      showToast()
    }, TOAST_CONFIG.repeatInterval)

    return () => {
      clearTimeout(firstTimerRef.current)
      clearInterval(repeatTimerRef.current)
    }
  }, [showToast])

  // Hide toast when navigating to contact page
  useEffect(() => {
    if (isContactPage) {
      hideToast()
    }
  }, [isContactPage, hideToast])

  // Auto-hide after 10s
  useEffect(() => {
    let timer
    if (visible) {
      timer = setTimeout(() => {
        hideToast()
      }, TOAST_CONFIG.autoHideDuration)
    }
    return () => clearTimeout(timer)
  }, [visible, hideToast])


  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="toast-root"
          role="status"
          aria-live="polite"
          aria-label="Contact reminder"
          initial={{ opacity: 0, y: 120, scale: 0.94 }}
          animate={{ opacity: 1, y: 0,   scale: 1    }}
          exit={{    opacity: 0, y: 80,  scale: 0.96 }}
          transition={{
            type:      'spring',
            stiffness: 380,
            damping:   32,
            mass:      0.8,
          }}
        >
          {/* Left accent bar */}
          <div className="toast-accent" aria-hidden="true" />

          {/* Content */}
          <div className="toast-body">
            <p className="toast-heading">{TOAST_CONFIG.heading}</p>
            <p className="toast-sub">{TOAST_CONFIG.body}</p>
            <button className="toast-cta" onClick={handleCTA}>
              {TOAST_CONFIG.ctaLabel}
            </button>
          </div>

          {/* Dismiss button */}
          <button
            className="toast-dismiss"
            onClick={handleDismiss}
            aria-label="Dismiss notification"
          >
            ✕
          </button>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
