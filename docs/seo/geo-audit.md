# Generative Engine Optimization (GEO) Audit & AI Citability Report

**Entity:** Zubair (Brand Names: ZASHLY, zashly craft, Zubair ZASHLY)  
**Production URL:** [https://zubairkaportfolio.netlify.app/](https://zubairkaportfolio.netlify.app/)  
**Target AI Systems:** ChatGPT, Claude, Perplexity AI, Google Gemini / AI Overviews, Microsoft Copilot  
**Protocol:** Emerging `/llms.txt` standard & AI Web Crawler Directives  
**Date:** October 27, 2026  
**Auditor:** Senior GEO Specialist  

---

## 1. Executive Summary

Generative Engine Optimization (GEO) prepares web properties for discovery, synthesis, and citation by Large Language Models (LLMs) and AI-powered conversational search platforms.

Unlike traditional SEO, which prioritizes ranking position on SERP pages, GEO prioritizes **factual clarity, citability, verifiable project attribution, and crawl availability for AI agents**.

---

## 2. AI Web Crawler Policy in `robots.txt`

The portfolio's `public/robots.txt` explicitly configures access for AI search agents and retrieval engines:

```robots.txt
# robots.txt — ZASHLY Portfolio
# Production URL: https://zubairkaportfolio.netlify.app/

User-agent: *
Allow: /

# AI Search crawlers — explicitly allowed for GEO visibility
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Bytespider
Allow: /

# Sitemap location
Sitemap: https://zubairkaportfolio.netlify.app/sitemap.xml
```

### Analysis of AI Crawler Policy:
1. **Search & Answering Bots (`ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `OAI-SearchBot`):** Allowed. These bots crawl in real-time when a user asks a question to cite sources and provide links back to the portfolio.
2. **Model Training & Retrieval (`GPTBot`, `Google-Extended`, `Applebot-Extended`):** Allowed. Helps LLMs incorporate knowledge of Zubair's portfolio into foundational knowledge bases and retrieval indices.
3. **No Disallowed Traps:** None of the static asset paths (`/assets/`) or content pages are blocked.

---

## 3. `llms.txt` Audit & Specification Review

The portfolio includes an authoritative `public/llms.txt` file (built directly to `dist/llms.txt`).

### 3.1 Content & Structure Check
- **Standard Compliance:** Formatted in clean, human-readable Markdown with standard section headings (`#`, `##`, `-`).
- **Length:** ~350 words (optimal concise context for LLM ingestion).
- **Core Sections Included:**
  1. *Title & Summary:* Direct definition of Zubair, brand aliases (`ZASHLY`, `zashly craft`), and core focus.
  2. *Identity & Canonical Links:* Canonical domain (`https://zubairkaportfolio.netlify.app/`), contact page (`https://zubairkaportfolio.netlify.app/contact`), email (`zashlycraft@gmail.com`), phone (`+923294264963`), GitHub, and location (`Faisalabad, Punjab, Pakistan`).
  3. *Core Capabilities & Services:* Explicit list of competencies (React 19, Three.js 3D, Headless E-commerce, UI/UX Design).
  4. *Technology Stack:* Clear proficiency hierarchy.
  5. *Featured Projects:* Live URLs with factual 1-sentence summaries (ZASH, E-Commerce Engine, Lexom Web).
  6. *Availability:* Clear availability statement for freelance and full-time hiring.

### 3.2 Accuracy & Fact-Checking:
- All URLs listed in `llms.txt` were verified:
  - Homepage: `https://zubairkaportfolio.netlify.app/`
  - Contact: `https://zubairkaportfolio.netlify.app/contact`
  - Project 1 (ZASH): `https://zashlyautomation-crypto.github.io/ZASH/`
  - Project 2 (E-Commerce Engine): `https://zash-lab-001.vercel.app/`
  - Project 3 (Lexom Web): `https://zashlyautomation-crypto.github.io/lexom-web/`
- Zero fabricated credentials, client logos, or false claims exist in the file.

---

## 4. Text Extraction Beyond Animations & Canvas

Many creative developer portfolios commit the error of burying essential biographical and technical facts inside Three.js 3D models or HTML5 `<canvas>` elements that AI bots cannot parse.

### Assessment of ZASHLY Portfolio:
- **Hero Typography:** While animated using GSAP, the headline `Web Developer` and tagline card are standard HTML text elements (`.hero-headline`, `.tagline-heading`, `.tagline-body`) readily available in the DOM.
- **2D Scroll Story:** Canvas frame rendering displays the background visual, but the actual narrative beats ("A curiosity born at 14", "Mastering the stack") are rendered as semantic HTML text elements (`.story-text`).
- **Tech Stack:** Tech bubbles render HTML text labels (`.tb-label-name`, `.tb-label-level`) and tooltips with descriptions alongside their visual icons.
- **Projects:** Title, subtitle, and case study links are rendered as standard HTML elements (`.ps-card__title`, `.ps-card__subtitle`, `a.ps-card__cta`).
- **FAQ Section:** Semantic `<section id="faq">`, `<details>`/`<button>` accordion with visible `<p>` answers in standard DOM.

**Conclusion:** The site achieves high visual fidelity without compromising text accessibility for AI search models.
