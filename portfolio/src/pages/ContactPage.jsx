import { useState, useEffect } from 'react'
import { CONTACT_DATA, FORMSPREE_ENDPOINT, CONTACT_STORAGE_KEY } from '@/constants'
import '@/styles/contact.css'

// ─── Helper: localStorage with try/catch ─────────────────────────────────
const getDraft = () => {
  try {
    const raw = localStorage.getItem(CONTACT_STORAGE_KEY)
    return raw ? JSON.parse(raw) : { senderName: '', senderEmail: '', message: '' }
  } catch { return { senderName: '', senderEmail: '', message: '' } }
}

const saveDraft = (data) => {
  try { localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(data)) } catch { }
}

const clearDraft = () => {
  try { localStorage.removeItem(CONTACT_STORAGE_KEY) } catch { }
}

// ─── ContactForm component ────────────────────────────────────────────────
const ContactForm = ({ isOpen, onClose }) => {
  const [fields, setFields] = useState(getDraft)
  const [status, setStatus] = useState('idle')
  // status: 'idle' | 'submitting' | 'success' | 'error'
  const [errMsg, setErrMsg] = useState('')

  // Persist draft on every keystroke
  const handleChange = (e) => {
    const updated = { ...fields, [e.target.name]: e.target.value }
    setFields(updated)
    saveDraft(updated)
  }

  // Client-side validation
  const validate = () => {
    if (!fields.senderName.trim())
      return 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.senderEmail.trim()))
      return 'Please enter a valid email address.'
    if (fields.message.trim().length < 10)
      return 'Message must be at least 10 characters.'
    return null
  }

  // Submit handler — fetch POST to Formspree
  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validate()
    if (validationError) {
      setStatus('error')
      setErrMsg(validationError)
      return
    }

    setStatus('submitting')
    setErrMsg('')

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: fields.senderName.trim(),
          email: fields.senderEmail.trim(),
          message: fields.message.trim(),
        }),
      })

      // Always parse JSON — Formspree returns JSON for all responses
      let result = {}
      try { result = await res.json() } catch { }

      if (res.ok) {
        // Formspree returns { ok: true } on success
        setStatus('success')
        clearDraft()
        setFields({ senderName: '', senderEmail: '', message: '' })
      } else {
        // Formspree returns { errors: [...] } on failure
        const msg = Array.isArray(result.errors) && result.errors.length > 0
          ? result.errors.map(err => err.message || err.field).join('. ')
          : `Submission failed (${res.status}). Please try again.`
        setStatus('error')
        setErrMsg(msg)
      }
    } catch (networkErr) {
      setStatus('error')
      setErrMsg('Network error. Check your connection and try again.')
    }
  }

  // ESC key closes form
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Lock body scroll while form is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="cf-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Contact form">
      <div className="cf-drawer" onClick={e => e.stopPropagation()}>

        <button className="cf-close" onClick={onClose} aria-label="Close">✕</button>
        <h2 className="cf-title">Send a Message</h2>

        {status === 'success' ? (
          <div className="cf-success">
            <div className="cf-success-icon">✓</div>
            <p className="cf-success-msg">Message sent successfully.</p>
            <p className="cf-success-sub">We will get back to you shortly.</p>
            <button className="cf-submit-btn" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>

            <div className="cf-field">
              <label className="cf-label" htmlFor="cf-name">Your Name</label>
              <input
                id="cf-name"
                className="cf-input"
                type="text"
                name="senderName"
                value={fields.senderName}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={status === 'submitting'}
              />
            </div>

            <div className="cf-field">
              <label className="cf-label" htmlFor="cf-email">Your Email</label>
              <input
                id="cf-email"
                className="cf-input"
                type="email"
                name="senderEmail"
                value={fields.senderEmail}
                onChange={handleChange}
                placeholder="your@email.com"
                autoComplete="email"
                disabled={status === 'submitting'}
              />
            </div>

            <div className="cf-field">
              <label className="cf-label" htmlFor="cf-message">Message</label>
              <textarea
                id="cf-message"
                className="cf-input cf-textarea"
                name="message"
                value={fields.message}
                onChange={handleChange}
                placeholder="Tell me about your project or idea..."
                rows={5}
                disabled={status === 'submitting'}
              />
            </div>

            {status === 'error' && (
              <div className="cf-error" role="alert">{errMsg}</div>
            )}

            <button
              type="submit"
              className="cf-submit-btn"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending…' : 'Send Message →'}
            </button>

          </form>
        )}

      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'

export const ContactPage = () => {
  const [formOpen, setFormOpen] = useState(false)
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="cp-page">
      <div className="cp-inner">

        {/* Back arrow */}
        <button className="cp-back" onClick={handleBack} aria-label="Back to home">←</button>

        {/* Hero */}
        <div className="cp-hero">
          <h1 className="cp-hero-text">
            <span className="cp-hero-line">LET'S</span>
            <span className="cp-hero-line">CONNECT</span>
          </h1>
        </div>

        {/* Info grid */}
        <div className="cp-info-grid">
          {/* NAME — clicking → opens form */}
          <div className="cp-cell">
            <div
              className="cp-cell-label-row"
              style={{ cursor: 'pointer' }}
              onClick={() => setFormOpen(true)}
              title="Send a message"
            >
              <span className="cp-cell-label">NAME</span>
              <span className="cp-cell-arrow" style={{ color: 'rgba(255,255,255,0.65)' }}>→</span>
            </div>
            <div className="cp-cell-icon" style={{ fontSize: '22px' }}>★</div>
            <p className="cp-cell-primary">{CONTACT_DATA.name}</p>
          </div>

          {/* EMAIL */}
          <div className="cp-cell">
            <div className="cp-cell-label-row">
              <span className="cp-cell-label">EMAIL</span>
              <span className="cp-cell-arrow">→</span>
            </div>
            <div className="cp-cell-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <a href={`mailto:${CONTACT_DATA.email}`} className="cp-cell-primary" style={{ textDecoration: 'none', color: 'inherit' }}>
              {CONTACT_DATA.email}
            </a>
            <p className="cp-cell-note">{CONTACT_DATA.emailNote}</p>
          </div>

          {/* PHONE */}
          <div className="cp-cell">
            <div className="cp-cell-label-row">
              <span className="cp-cell-label">PHONE</span>
              <span className="cp-cell-arrow">→</span>
            </div>
            <div className="cp-cell-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="4" height="4" rx="0.8" /><rect x="10" y="3" width="4" height="4" rx="0.8" />
                <rect x="17" y="3" width="4" height="4" rx="0.8" /><rect x="3" y="10" width="4" height="4" rx="0.8" />
                <rect x="10" y="10" width="4" height="4" rx="0.8" /><rect x="17" y="10" width="4" height="4" rx="0.8" />
                <rect x="3" y="17" width="4" height="4" rx="0.8" /><rect x="10" y="17" width="4" height="4" rx="0.8" />
                <rect x="17" y="17" width="4" height="4" rx="0.8" />
              </svg>
            </div>
            <p className="cp-cell-primary">{CONTACT_DATA.phone}</p>
            <p className="cp-cell-note">{CONTACT_DATA.phoneNote}</p>
          </div>

          {/* LOCATION */}
          <div className="cp-cell">
            <div className="cp-cell-label-row">
              <span className="cp-cell-label">LOCATION</span>
              <span className="cp-cell-arrow">→</span>
            </div>
            <div className="cp-cell-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <p className="cp-cell-primary">{CONTACT_DATA.location}</p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="cp-bottom">
          <div className="cp-socials">
            <span className="cp-socials-label">SOCIALS</span>
            <div className="cp-socials-bottom">
              <span className="cp-social-date">{CONTACT_DATA.socials.date}</span>
              {[
                ['LINKEDIN:', CONTACT_DATA.socials.linkedin],
                ['INSTAGRAM:', CONTACT_DATA.socials.instagram],
                ['BEHANCE:', CONTACT_DATA.socials.behance],
                ['GITHUB:', CONTACT_DATA.socials.github],
              ].map(([label, value]) => (
                <div key={label} className="cp-social-link">
                  <span className="cp-social-link-label">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cp-right">
            <span className="cp-credits-date">{CONTACT_DATA.credits.date}</span>
            <div className="cp-right-top">
              <span className="cp-recently-label">{CONTACT_DATA.recentlyAdded.label}</span>
              <span className="cp-portfolio-sublabel">{CONTACT_DATA.recentlyAdded.subLabel}</span>
              <a href={`https://${CONTACT_DATA.recentlyAdded.url}`} className="cp-portfolio-url" target="_blank" rel="noopener noreferrer">
                {CONTACT_DATA.recentlyAdded.url}
              </a>
            </div>
            <p className="cp-tagline">{CONTACT_DATA.tagline.line1}<br />{CONTACT_DATA.tagline.line2}</p>
            <div className="cp-credits-row">
              <span className="cp-credits-text">{CONTACT_DATA.credits.left}</span>
              <span className="cp-credits-text">{CONTACT_DATA.credits.right}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Contact form drawer */}
      <ContactForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}
