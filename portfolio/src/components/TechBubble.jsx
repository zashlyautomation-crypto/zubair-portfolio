import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Glow Ring (Node.js, Python) ─────────────────────────────────────────────
const GlowRing = ({ color, isHovered }) => (
  <motion.div
    className="glow-ring"
    animate={{
      opacity: isHovered ? 1 : 0.75,
      scale:   isHovered ? 1.07 : 1,
    }}
    transition={{ duration: 0.28 }}
    style={{
      position: 'absolute',
      inset: -7,
      borderRadius: '50%',
      border: `2.5px solid ${color}`,
      boxShadow: `0 0 20px 6px ${color}55, inset 0 0 14px 3px ${color}11`,
      pointerEvents: 'none',
      zIndex: 1,
      willChange: 'transform, opacity',
    }}
  />
)

// ─── Tooltip Card ─────────────────────────────────────────────────────────────
const TooltipCard = ({ tech, side }) => {
  const variants = {
    hidden: {
      opacity: 0,
      y:  side === 'bottom' ? -10 : side === 'top' ? 10 : 0,
      x:  side === 'left'  ?  10 : side === 'right' ? -10 : 0,
      scale: 0.92,
    },
    visible: {
      opacity: 1, y: 0, x: 0, scale: 1,
      transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
      opacity: 0, scale: 0.92,
      transition: { duration: 0.16, ease: 'easeIn' },
    },
  }

  const positionStyle = {
    top:    { bottom: 'calc(100% + 14px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top:    'calc(100% + 14px)', left: '50%', transform: 'translateX(-50%)' },
    left:   { right:  'calc(100% + 14px)', top:  '50%', transform: 'translateY(-50%)' },
    right:  { left:   'calc(100% + 14px)', top:  '50%', transform: 'translateY(-50%)' },
  }[side]

  return (
    <motion.div
      className="tb-tooltip"
      style={{ position: 'absolute', zIndex: 50, ...positionStyle }}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="tb-tooltip-header">
        <span className="tb-tooltip-name">{tech.name}</span>
        <span className="tb-tooltip-level">{tech.level}</span>
      </div>
      <p className="tb-tooltip-desc">{tech.description}</p>
    </motion.div>
  )
}

// ─── Position helper ─────────────────────────────────────────────────────────
const getPositionStyles = (tech, isMobile) => {
  const isTablet = !isMobile && typeof window !== 'undefined' && window.innerWidth < 1024
  const pos = isMobile
    ? tech.position.mobile
    : isTablet
    ? tech.position.tablet
    : tech.position.desktop

  const styles = {}
  if (pos.left      !== undefined) styles.left      = pos.left
  if (pos.right     !== undefined) styles.right     = pos.right
  if (pos.top       !== undefined) styles.top       = pos.top
  if (pos.bottom    !== undefined) styles.bottom    = pos.bottom
  if (pos.transform !== undefined) styles.transform = pos.transform
  return styles
}

// ─── TechBubble ─────────────────────────────────────────────────────────────
export const TechBubble = ({ tech, isMobile }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [tooltipSide, setTooltipSide] = useState('top')
  const bubbleRef = useRef(null)
  const size = isMobile ? tech.size.mobile : tech.size.desktop

  const onMouseEnter = useCallback(() => {
    if (bubbleRef.current) {
      const rect = bubbleRef.current.getBoundingClientRect()
      const cx   = window.innerWidth  / 2
      const cy   = window.innerHeight / 2
      if      (rect.left > cx)  setTooltipSide('left')
      else if (rect.top  > cy)  setTooltipSide('top')
      else                      setTooltipSide('bottom')
    }
    setIsHovered(true)
  }, [])

  const onMouseLeave = useCallback(() => setIsHovered(false), [])

  const onTouchEnd = useCallback((e) => {
    e.preventDefault()
    setIsHovered(prev => !prev)
  }, [])

  const baseGlow = tech.glowIntensity !== 'none'
    ? `0 0 22px 5px ${tech.glowColor}33`
    : 'none'
  const hoverGlow = `0 0 44px 14px ${tech.glowColor}55, 0 0 90px 30px ${tech.glowColor}22`

  // TypeScript uses a rounded-square style
  const isSquare = !!tech.isSquare

  return (
    <div
      ref={bubbleRef}
      className={`tech-bubble tech-bubble--${tech.id}${tech.isFeatured ? ' tech-bubble--featured' : ''}`}
      style={{
        width: size,
        height: size,
        ...getPositionStyles(tech, isMobile),
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchEnd={onTouchEnd}
      role="button"
      tabIndex={0}
      aria-label={`${tech.name} — ${tech.level}`}
    >
      {/* Glow ring — Node.js, Python */}
      {tech.ringStyle === 'glow-ring' && (
        <GlowRing color={tech.glowColor} isHovered={isHovered} />
      )}

      {/* Sonar Bars — featured only, matches reference image */}
      {tech.isFeatured && tech.ringStyle === 'sonar' && (
        <div className="sonar-bars">
          <div className="sonar-bars-left">
            {[1, 2, 3, 4].map(i => <div key={i} className="s-bar" />)}
          </div>
          <div className="sonar-bars-right">
            {[1, 2, 3, 4].map(i => <div key={i} className="s-bar" />)}
          </div>
        </div>
      )}

      {/* Main circle / square */}
      <motion.div
        className={`tb-circle${isSquare ? ' tb-circle--square' : ''}`}
        animate={
          isHovered
            ? { scale: 1.12, boxShadow: hoverGlow }
            : { scale: 1,    boxShadow: baseGlow   }
        }
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileTap={{ scale: 0.96 }}
      >
        <img
          src={tech.logoSrc}
          alt={tech.name}
          loading="lazy"
          decoding="async"
          className={`tb-logo${tech.logoBrightness ? ' tb-logo--invert' : ''}`}
        />
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && <TooltipCard key="tt" tech={tech} side={tooltipSide} />}
      </AnimatePresence>

      {/* Featured label */}
      {tech.isFeatured && (
        <div className="tb-featured-label">
          <span className="tb-label-name">{tech.name}</span>
          <span className="tb-label-separator"> - </span>
          <span className="tb-label-level">{tech.level}</span>
        </div>
      )}
    </div>
  )
}

export default TechBubble
