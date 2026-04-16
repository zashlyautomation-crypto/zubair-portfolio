import { useMemo } from 'react'
import { STORY_PROGRESS_DOTS } from '@/constants'

const RING_RADIUS = 15
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

export const StoryProgressBar = ({ progress }) => {
  const percent = Math.round(progress * 100)
  const offset = RING_CIRCUMFERENCE - (progress * RING_CIRCUMFERENCE)
  const activeDot = Math.min(
    Math.floor(progress * STORY_PROGRESS_DOTS),
    STORY_PROGRESS_DOTS - 1
  )

  return (
    <div className="story-progress-bar">
      {/* Circular percent ring — matches reference exactly */}
      <div className="spb-ring-wrapper">
        <svg
          width="40" height="40"
          viewBox="0 0 40 40"
          style={{ position:'absolute', top:0, left:0 }}
        >
          {/* Background ring */}
          <circle
            cx="20" cy="20" r={RING_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
          />
          {/* Orange fill arc — animates with scroll */}
          <circle
            cx="20" cy="20" r={RING_RADIUS}
            fill="none"
            stroke="#f7931e"
            strokeWidth="2"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 20 20)"
            style={{ transition: 'stroke-dashoffset 0.08s linear' }}
          />
        </svg>
        {/* Percent label centered inside ring */}
        <span className="spb-percent">{percent}%</span>
      </div>

      {/* Progress dots */}
      <div className="spb-dots">
        {Array.from({ length: STORY_PROGRESS_DOTS }, (_, i) => (
          <div
            key={i}
            className="spb-dot"
            style={{
              background: i === activeDot ? '#f7931e' : 'rgba(255,255,255,0.28)',
              transform: i === activeDot ? 'scale(1.5)' : 'scale(1)',
              transition: 'background 0.25s ease, transform 0.25s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}
