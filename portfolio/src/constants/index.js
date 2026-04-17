import printEditionsVideo from '@/assets/videos/video-showcase/0331.mp4'
import apparelVideo from '@/assets/videos/video-showcase/1db07f65-fcf2-4a3c-9173-28eae83bd48d.mp4'

// ─── Hero Gradient ───────────────────────────────────────────
export const HERO_GRADIENT = `
  radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.8) 100%),
  radial-gradient(circle at 75% 50%, #ff8c42 0%, #f7931e 30%, #c1272d 60%, #000000 100%)
`

// ─── Navbar ──────────────────────────────────────────────────
export const NAVBAR_SCROLL_THRESHOLD = 50
export const NAVBAR_BLUR = 'blur(20px)'
export const NAVBAR_BG = 'rgba(255,255,255,0.08)'
export const NAVBAR_BORDER = '1px solid rgba(255,255,255,0.12)'

// ─── Cursor ──────────────────────────────────────────────────
export const CURSOR_DOT_SIZE = 8
export const CURSOR_RING_SIZE = 40
export const CURSOR_RING_HOVER_SIZE = 60
export const CURSOR_DOT_COLOR = '#f7931e'
export const CURSOR_RING_COLOR = 'rgba(255,255,255,0.6)'
export const CURSOR_RING_HOVER_COLOR = '#f7931e'

// ─── Connect Button ──────────────────────────────────────────
export const CONNECT_BUTTON_SIZE = 90

// ─── Tagline Card ────────────────────────────────────────────
export const TAGLINE_CARD_WIDTH_DESKTOP = '380px'

// ─── Brand ───────────────────────────────────────────────────
export const ORANGE_ACCENT = '#f7931e'
export const ANIMATION_EASE = 'power3.out'

// ─── Breakpoints ─────────────────────────────────────────────
export const BREAKPOINTS = {
  mobile: '767px',
  tablet: '1023px',
  desktop: '1024px',
}

// ─── Service Items ───────────────────────────────────────────
export const SERVICE_ITEMS = [
  { id: 'web-apps', label: 'Web Apps', icon: 'browser' },
  { id: 'frontend', label: 'Frontend', icon: 'tshirt' },
  { id: 'backend', label: 'Backend', icon: 'network' },
  { id: 'ecommerce', label: 'E-commerce', icon: 'cart' },
]

// ─── Navigation Links ────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'home', href: '/', active: true },
  { label: 'about', href: '/about', active: false },
  { label: 'projects', href: '/projects', active: false },
]

// ─── Animation Durations (ms) ────────────────────────────────
export const ANIM = {
  fast: 0.2,
  base: 0.4,
  slow: 0.8,
  entrance: 0.9,
}

// ─── 2D SCROLL STORY CONSTANTS ───────────────────────────────────────────────

export const TOTAL_FRAMES = 32 // actual count after reading folder

export const STORY_SCROLL_MULTIPLIER = 60
// Total scroll height = TOTAL_FRAMES × STORY_SCROLL_MULTIPLIER (in px)
// This gives smooth per-frame stepping at normal human scroll speed

export const STORY_SCRUB_SPEED = 2
// GSAP ScrollTrigger scrub value — higher value = smoother follow lag
// Do not change this value unless absolutely necessary for smoothness.

export const STORY_PROGRESS_DOTS = 5
// Number of dots in the right sidebar progress indicator — matches reference

export const LENIS_SCROLL_SYNC = true
// Reminder flag — Lenis must be synced with ScrollTrigger

// Beat scroll progress windows — each beat occupies a portion of 0.0 → 1.0 total progress
// Adjust frameStart/frameEnd after TOTAL_FRAMES is known
export const STORY_BEATS = [
  {
    id: 'beat-1',
    progressStart: 0.00,
    progressEnd: 0.46,
    frameStart: 0,
    frameEnd: 14,
  },
  {
    id: 'beat-2',
    progressStart: 0.48,
    progressEnd: 1.00,
    frameStart: 15,
    frameEnd: 31,
  },
]

// Text animation windows — progress values from 0.0 to 1.0
export const TEXT_WINDOWS = {
  'beat-1-left': {
    fadeInStart: 0.00, fadeInEnd: 0.10,
    holdEnd: 0.90,
    fadeOutStart: 0.90, fadeOutEnd: 0.98,
  },
  'beat-1-right': {
    fadeInStart: 0.06, fadeInEnd: 0.16,
    holdEnd: 0.90,
    fadeOutStart: 0.90, fadeOutEnd: 0.98,
  },
  'float-cards': {
    fadeInStart: 0.02, fadeInEnd: 0.12,
    holdEnd: 0.90,
    fadeOutStart: 0.90, fadeOutEnd: 0.98,
  },
}

// Floating element positions — desktop (all position:fixed values)
export const FLOAT_POSITIONS = {
  desktop: {
    cardA: { top: '35%', left: '55%', rotate: '4deg' },
    cardB: { top: '65%', left: '46%', rotate: '-4deg' },
    cardC: { top: '56%', left: '33%', rotate: '-8deg' },
    badgeJS1: { top: '38%', right: '30%' },
    badgeJS2: { bottom: '12%', left: '35%' },
    badgeReact: { bottom: '30%', left: '30%' },
    badgeS: { top: '51%', right: '32%' },
    badgeTW: { bottom: '26%', right: '40%' },
  },
  mobile: {
    cardA: { top: '32%', right: '8%', rotate: '4deg' },
    cardB: { top: '70%', right: '10%', rotate: '-4deg' },
    cardC: { top: '54%', left: '8%', rotate: '-8deg' },
    badgeJS1: { top: '36%', right: '12%' },
    badgeJS2: { bottom: '15%', left: '15%' },
    badgeReact: { bottom: '28%', left: '10%' },
    badgeS: { top: '48%', right: '15%' },
    badgeTW: { bottom: '22%', right: '20%' },
  },
}

// ─── VIDEO SHOWCASE SECTION CONSTANTS ──────────────────────────────────────

export const VIDEO_SHOWCASE_DATA = [
  {
    id: 'print-editions',
    label: 'PRINT EDITIONS',
    videoSrc: printEditionsVideo,
    slot: 'left',
  },
  {
    id: 'apparel',
    label: 'APPAREL',
    videoSrc: apparelVideo,
    slot: 'right',
    hasDot: true,
  },
]

// ─── ABOUT SECTION ──────────────────────────────────────────────────────────

export const ABOUT_CYAN = '#00e5ff'

export const ABOUT_LEFT_BLOCKS = [
  {
    id: 'education',
    heading: 'EDUCATION',
    items: [
      'Still in School',
      'OOTECH IT Constality',
      'Shiblee Grammer School — Schooling',
    ],
  },
  {
    id: 'experience',
    heading: 'EXPERIENCE',
    items: [
      'Independent projects for myself and\nclose collaborators',
    ],
  },
  {
    id: 'achievements',
    heading: 'ACHIEVEMENTS',
    items: ['Projects of Dreams'],
  },
]

export const ABOUT_RIGHT_BLOCKS = [
  {
    id: 'languages',
    heading: 'Computer LANGUAGES',
    items: ['HTMl', 'CSS', 'JavaScript', 'React', '100s of Libraries'],
  },
  {
    id: 'software',
    heading: 'SOFTWARE',
    items: ['Antigravity', 'Trae', 'Vs-code'],
  },
  {
    id: 'contact',
    heading: 'CONTACT',
    items: ['Please visit the Connect page'],
  },
  {
    id: 'interests',
    heading: 'INTERESTS',
    items: ['Entrepreneurship'],
  },
]

export const ABOUT_TAGLINE = 'leveraging the creative Economy'
export const ABOUT_CONNECT_LABEL = 'CONNECT'
export const ABOUT_WATERMARK = 'ABOUT'
export const ABOUT_MASK_CIRCLE_SIZE = 180   // px — diameter of reveal circle on desktop
export const ABOUT_MASK_EASE = 'power2.out'
export const ABOUT_MASK_DURATION = 0.45    // seconds — circle expand/contract speed

// ─── PROJECTS SECTION ────────────────────────────────────────────────────────

export const PROJECTS_DATA = [
  {
    id: 'card-01',
    slot: 1,
    layout: 'full',    // spans full width — top card
    alt: 'Project 01 — ZASH Futuristic & Interactive Design',
    link: 'https://zashlyautomation-crypto.github.io/ZASH/',
  },
  {
    id: 'card-02',
    slot: 2,
    layout: 'half',    // left half of bottom row
    alt: 'Project 02 — E-commerce Engine, Seamless Shopping',
    link: 'https://zash-lab-001.vercel.app/',
  },
  {
    id: 'card-03',
    slot: 3,
    layout: 'half',    // right half of bottom row
    alt: 'Project 03 — AI Portfolio, Intelligent Design',
    link: 'https://zashlyautomation-crypto.github.io/lexom-web/#/lexom-web/',
  },
]

// Layout constants — do not change these values
export const PROJ_GAP_DESKTOP = 16    // px — gap between all cards on desktop
export const PROJ_GAP_MOBILE = 12    // px — gap between all cards on mobile
export const PROJ_RADIUS_DESK = 24    // px — border radius on desktop
export const PROJ_RADIUS_MOB = 18    // px — border radius on mobile
export const PROJ_PAD_DESKTOP = '0 clamp(16px, 2vw, 24px)'
export const PROJ_PAD_MOBILE = '0 12px'

// ─── CONTACT PAGE ────────────────────────────────────────────────────────────

export const CONTACT_DATA = {
  name: 'Zabair',
  email: 'zashlycraft@gmail.com',
  emailNote: 'For professional correspondence, kindly reach out via email.',
  phone: '+923294264963',
  phoneNote: 'Call availability is minimal; email remains the primary channel.',
  location: 'Faisalabad, Punjab, Pakistan',
  socials: {
    date: 'JANUARY 2026',
    github: 'https://github.com/zashlyautomation-crypto/',
  },
  recentlyAdded: {
    label: 'RECENTLY ADDED',
    subLabel: 'PORTFOLIO:',
    url: 'https://zashlyautomation-crypto.github.io/zubair-portfolio/',
  },
  credits: {
    date: '27 02 2024',
    left: 'DESIGNED BY\nZUBAIR',
    right: 'PRECISION PROMPTING',
  },
  tagline: {
    line1: 'leveraging the',
    line2: 'Attention Economy',
  },
}

export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mwvapzjy'
export const CONTACT_STORAGE_KEY = 'zashly_contact_draft'

// ─── SITE INTRO ───────────────────────────────────────────────────────────

export const INTRO_CONFIG = {
  brandName: 'ZASHLY',
  tagline: 'Built with design, not templates.',
  sessionKey: 'zashly_intro_seen',
  totalDuration: 2900,    // ms — total intro duration before homepage revealed
  // Phase timings (ms from start) — Shortened for snappiness
  phases: {
    logoAppear: 100,     // logo mark fades in
    nameReveal: 400,     // brand name letters reveal
    taglineIn: 1000,    // tagline slides in
    holdDuration: 1800,    // moment of stillness at peak
    splitStart: 2100,    // curtain split begins
    splitComplete: 2800,    // split fully open
    unmount: 3000,    // component removed from DOM
  },
}

// ─── TOAST REMINDER ───────────────────────────────────────────────────────

export const TOAST_CONFIG = {
  storageKey: 'zashly_toast_state',
  firstAppearDelay: 8000,    // ms — first toast appears 8s after page load
  repeatInterval: 20000,   // ms — reappears every 20s if not visited contact
  autoHideDuration: 10000,   // ms — toast disappears after 10s
  dismissCooldown: 300000,  // ms — 5 minutes after manual dismiss
  heading: 'Let\'s work together',

  body: 'Open to freelance & full-time opportunities.',
  ctaLabel: 'Get in touch →',
}


