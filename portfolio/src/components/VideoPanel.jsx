import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export const VideoPanel = ({ video, onClick }) => {
  const videoRef    = useRef(null)
  const panelRef    = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
 
  // ─── Intersection Observer — play/pause based on visibility ───────────
  useEffect(() => {
    const el = panelRef.current
    const v = videoRef.current
    if (!el || !v) return
 
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {})
        } else {
          v.pause()
        }
      })
    }, { threshold: 0.1, rootMargin: '100px' })
 
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
 
  return (
    <div
      ref={panelRef}
      className={`vs-panel vs-panel--${video.slot}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video element — Always has src, preloads metadata for "thumbnail" view */}
      <video
        ref={videoRef}
        className="vs-video"
        src={video.videoSrc}
        muted
        loop
        playsInline
        preload="metadata"
        style={{
          position:   'absolute',
          inset:       0,
          width:       '100%',
          height:      '100%',
          objectFit:   'cover',
          objectPosition: 'center center',
          display:     'block',
        }}
      />

      {/* Hover brightness overlay */}
      <motion.div
        className="vs-hover-overlay"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          position:   'absolute',
          inset:       0,
          background:  'rgba(255,255,255,0.06)',
          pointerEvents: 'none',
          zIndex:      1,
        }}
      />

      {/* Orange dot — right panel only — top right corner */}
      {video.hasDot && (
        <div className="vs-dot" aria-hidden="true" />
      )}

      {/* Label — bottom left of each panel */}
      <div className="vs-label">{video.label}</div>

    </div>
  )
}

export default VideoPanel
