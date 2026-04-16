import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const VideoModal = ({ video, isOpen, onClose }) => {
  const modalVideoRef = useRef(null)

  // Escape key closes modal
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Auto-play modal video when opened, pause on close
  useEffect(() => {
    if (!modalVideoRef.current) return
    if (isOpen) {
      modalVideoRef.current.currentTime = 0
      modalVideoRef.current.play().catch(() => {})
    } else {
      modalVideoRef.current.pause()
    }
  }, [isOpen])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="vm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          onClick={onClose}                    /* click outside video → close */
          style={{
            position:        'fixed',
            inset:            0,
            background:       'rgba(0,0,0,0.94)',
            zIndex:           1000,
            display:          'flex',
            alignItems:       'center',
            justifyContent:   'center',
          }}
        >
          {/* Video container — click does NOT bubble to overlay */}
          <motion.div
            className="vm-video-container"
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1,    opacity: 1 }}
            exit={{    scale: 0.88, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position:   'relative',
              maxWidth:   '90vw',
              maxHeight:  '85vh',
              width:      '100%',
            }}
          >
            <video
              ref={modalVideoRef}
              src={video?.videoSrc}
              controls
              playsInline
              style={{
                width:       '100%',
                maxHeight:   '85vh',
                objectFit:   'contain',
                display:     'block',
                borderRadius: '8px',
              }}
            />

            {/* Close button — top right of video container */}
            <button
              className="vm-close-btn"
              onClick={onClose}
              aria-label="Close video"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default VideoModal
