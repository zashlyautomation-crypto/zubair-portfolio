import '@/styles/hero.css'

// ─── SVG Icon Map ─────────────────────────────────────────────
// All icons: 20×20, stroke #f7931e, stroke-width 1.8, fill none
const ICONS = {
  browser: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="#f7931e"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="16" height="14" rx="2" />
      <line x1="2" y1="7" x2="18" y2="7" />
      <circle cx="5" cy="5" r="0.8" fill="#f7931e" />
      <circle cx="8" cy="5" r="0.8" fill="#f7931e" />
    </svg>
  ),
  tshirt: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="#f7931e"
      strokeWidth="1.8"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M2 6l4-3h2.5c0 1.5 3 1.5 3 0H14l4 3-2.5 2.5L14 7v10H6V7L4.5 8.5z" />
    </svg>
  ),
  network: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="#f7931e"
      strokeWidth="1.8"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <rect x="8" y="2" width="4" height="3" rx="0.5" />
      <rect x="3" y="9" width="4" height="3" rx="0.5" />
      <rect x="13" y="9" width="4" height="3" rx="0.5" />
      <rect x="8" y="15" width="4" height="3" rx="0.5" />
      <line x1="10" y1="5" x2="10" y2="9" />
      <line x1="10" y1="7" x2="5" y2="9" />
      <line x1="10" y1="7" x2="15" y2="9" />
      <line x1="10" y1="12" x2="10" y2="15" />
    </svg>
  ),
  cart: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="#f7931e"
      strokeWidth="1.8"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M2 2h2l2.5 9h8l2-6H6" />
      <circle cx="9" cy="17" r="1" fill="#f7931e" stroke="none" />
      <circle cx="15" cy="17" r="1" fill="#f7931e" stroke="none" />
    </svg>
  ),
}

/**
 * ServiceCard — individual service category pill component.
 * @param {{ id: string, label: string, icon: string }} props
 */
const ServiceCard = ({ id, label, icon }) => {
  return (
    <div className="service-card" role="button" tabIndex={0} aria-label={label}>
      <span className="service-card-icon">{ICONS[icon]}</span>
      <span className="service-card-label">{label}</span>
    </div>
  )
}

export default ServiceCard
