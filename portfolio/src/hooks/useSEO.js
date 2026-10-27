/**
 * useSEO — lightweight hook to set page-level <title> and
 * <meta name="description"> dynamically for each route.
 *
 * Because this portfolio is a client-side rendered SPA (React + Vite),
 * search engines that execute JavaScript will pick up these updates.
 * For crawlers that don't run JS, the <head> defaults in index.html
 * cover the homepage. The contact page is secondary and crawlers
 * arrive via sitemap or links.
 *
 * @param {Object} opts
 * @param {string} opts.title         — full <title> string
 * @param {string} opts.description   — meta description (max ~160 chars)
 * @param {string} [opts.canonical]   — absolute canonical URL for this route
 */
import { useEffect } from 'react'

const BASE_URL = 'https://zubairkaportfolio.netlify.app'

export const useSEO = ({ title, description, canonical }) => {
  useEffect(() => {
    // ── Title ─────────────────────────────────────────────
    if (title) {
      document.title = title
    }

    // ── Meta description ───────────────────────────────────
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.setAttribute('name', 'description')
        document.head.appendChild(metaDesc)
      }
      metaDesc.setAttribute('content', description)
    }

    // ── Canonical ──────────────────────────────────────────
    if (canonical) {
      let canonicalEl = document.querySelector('link[rel="canonical"]')
      if (!canonicalEl) {
        canonicalEl = document.createElement('link')
        canonicalEl.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalEl)
      }
      canonicalEl.setAttribute('href', canonical)

      // Also update og:url
      let ogUrl = document.querySelector('meta[property="og:url"]')
      if (ogUrl) ogUrl.setAttribute('content', canonical)
    }

    // ── OG title ───────────────────────────────────────────
    if (title) {
      let ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) ogTitle.setAttribute('content', title)
    }

    // ── OG description ─────────────────────────────────────
    if (description) {
      let ogDesc = document.querySelector('meta[property="og:description"]')
      if (ogDesc) ogDesc.setAttribute('content', description)
    }
  }, [title, description, canonical])
}

export { BASE_URL }
