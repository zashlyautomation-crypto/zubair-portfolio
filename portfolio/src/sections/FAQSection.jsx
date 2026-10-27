import { useState } from 'react'
import { FAQ_DATA } from '@/constants/faq'
import '@/styles/faq.css'

export const FAQSection = () => {
  const [openId, setOpenId] = useState(null)

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section className="faq-section" id="faq" aria-label="Frequently Asked Questions">
      <div className="faq-container">
        <div className="faq-header">
          <span className="faq-badge">AEO &amp; FAQ</span>
          <h2 className="faq-title">
            <span className="faq-title-main">FREQUENTLY ASKED</span>
            <span className="faq-title-script">Questions</span>
          </h2>
          <p className="faq-subtitle">
            Direct, factual answers about Zubair (ZASHLY), freelance React development, services in Faisalabad &amp; Pakistan, and hiring process.
          </p>
        </div>

        <div className="faq-accordion" role="region" aria-label="Questions list">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openId === item.id
            return (
              <div 
                key={item.id} 
                className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  id={`faq-btn-${item.id}`}
                >
                  <span className="faq-index">0{index + 1}</span>
                  <span className="faq-question-text">{item.question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <div
                  id={`faq-answer-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${item.id}`}
                  className="faq-answer-wrapper"
                  style={{ maxHeight: isOpen ? '240px' : '0' }}
                >
                  <div className="faq-answer-content">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
