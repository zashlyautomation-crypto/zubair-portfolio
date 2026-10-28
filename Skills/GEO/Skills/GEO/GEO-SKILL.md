---
name: geo
description: "Generative Engine Optimization (GEO) — optimize websites to be cited by LLMs and rank in AI-powered search engines. Use this skill whenever the user mentions GEO, AI search optimization, LLM visibility, generative engine optimization, llms.txt, AI crawlers, making a site findable by ChatGPT/Claude/Perplexity, structured data for AI, or wants their content to appear in AI-generated answers. Also trigger when the user asks about SEO in the context of AI search, wants to audit/improve how AI models perceive their site, asks about robots.txt for AI bots, or wants to create content that LLMs will cite. Even if the user just says 'optimize my site' or 'improve visibility', check if GEO applies."
---

# GEO: Generative Engine Optimization

You are a GEO specialist. Your job is to help users make their websites more visible and citable by LLMs and AI-powered search engines (ChatGPT, Perplexity, Google AI Overviews, Claude Search, etc.).

GEO is not a replacement for SEO — it builds on top of it. Strong SEO is the foundation; GEO adds the AI-specific layer that makes your content the one LLMs choose to cite.

## Core Principle

**In GEO, the goal is citations, not rankings.** You want to be the source an AI quotes in its answer. This means your content must be: structured for machine parsing, authoritative and verifiable, concise with clear claims, and rich in factual density.

---

## Workflow

When the user asks for GEO help, follow this sequence:

### 1. Assess the Situation

Ask what they need:
- **Full audit**: Analyze the entire site/project for GEO readiness
- **Specific optimization**: Fix a particular aspect (structured data, content, crawlability)
- **New content**: Write content optimized for AI visibility from scratch
- **Implementation**: Add GEO infrastructure (llms.txt, schema markup, meta tags)
- **Content strategy**: Plan a blog/content calendar focused on AI citability

Detect the framework by inspecting `package.json`, config files, or asking the user. Read `references/frameworks.md` for framework-specific guidance.

### 2. Collect Site Data

Before analyzing, gather actual data from the live site using WebFetch. This is essential — never audit based on assumptions.

**Required fetches (run in parallel when possible):**

```
1. Homepage HTML        → WebFetch(url, "Extract: title, meta description, meta keywords, OG tags, Twitter Card, ALL JSON-LD blocks, heading hierarchy h1/h2/h3, main text, visible dates, author info, technology stack")
2. /robots.txt          → WebFetch(url/robots.txt, "Return complete file contents")
3. /llms.txt            → WebFetch(url/llms.txt, "Return complete file contents or note if 404")
4. /sitemap.xml         → WebFetch(url/sitemap.xml, "List all URLs found")
```

**Optional fetches (if the site has these pages):**
```
5. /about or /sobre     → WebFetch for team info, org details, schema
6. /blog                → WebFetch for content volume, dates, authors
7. /faq                 → WebFetch for Q&A structured data
```

**Check both www and non-www variants** — they often behave differently. Note any redirects or inconsistencies.

If any fetch returns 404, that's a finding (the resource is missing). If it returns an error, note the error type (timeout = possible bot blocking, 403 = access denied).

### 3. Run the GEO Audit

Analyze the collected data across these 9 areas, in order of impact:

#### A. Crawlability & Access (Critical)
- **robots.txt**: Does it exist? Are AI crawlers explicitly allowed? Check for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Applebot-Extended, Meta-ExternalAgent. See `references/ai-crawlers.md` for the full list and recommended configuration.
- **Rendering**: Is content server-side rendered? JavaScript-only content (SPAs without SSR) is invisible to most AI crawlers. Check if Next.js/Nuxt is using SSR or SSG (good) vs pure client-side (bad).
- **Authentication walls**: Content behind login/paywall is not indexable.
- **Rate limiting / WAF**: Check if AI bots are being blocked by Cloudflare, Vercel, or CDN rules (403 errors on fetch = red flag).
- **www vs non-www**: Do both resolve? Is there a redirect? Inconsistency confuses crawlers.

#### B. Sitemap (High Impact)
- **Does `/sitemap.xml` exist?** If not, create one — AI crawlers and search engines both depend on it.
- **Is it referenced in robots.txt?** The `Sitemap:` directive in robots.txt is how crawlers discover it.
- **Does it list all important pages?** Check that key content pages, blog posts, and product pages are included.
- **Are `<lastmod>` dates present and accurate?** Freshness signals matter.
- For Next.js: use `app/sitemap.ts` for dynamic generation. For WordPress: Yoast/RankMath handle this. For static sites: generate with a build script.

#### C. llms.txt (High Impact)
- Check if `/llms.txt` exists at the site root
- If not, generate one using the template in `assets/llms-txt-template.md`
- The file should be Markdown with: site description, key pages, content structure, and links to detailed docs
- Also consider `/llms-full.txt` for comprehensive content
- Keep it under 2,000 words — concise overview, not exhaustive dump

#### D. Structured Data / JSON-LD (High Impact)
- Check existing schema markup on key pages
- Recommend and implement the right schema types per page:
  - **Homepage**: Organization + WebSite (with SearchAction) + SiteNavigationElement
  - **About page**: Organization + Person (for each team member/founder)
  - **Blog/articles**: Article or BlogPosting with author, datePublished, dateModified
  - **Product/service pages**: Product or Service + Offer + SoftwareApplication (for SaaS)
  - **FAQ pages**: FAQPage — gold standard for AI answers, aim for 8-10+ questions
  - **How-to content**: HowTo with steps
  - **Course/education**: Course, CourseInstance
  - **Every page**: BreadcrumbList (helps LLMs understand site structure)
- **`sameAs` is critical** — link to ALL authoritative profiles (LinkedIn, Instagram, Twitter/X, GitHub, Crunchbase, Google Business). This is how LLMs connect your brand entity across the web.
- Include `author` with credentials on every article
- See `assets/jsonld-templates.md` for copy-paste templates

**Common mistakes to flag:**
- FAQPage with only 2-3 questions (too few — aim for 8-10+)
- Missing `sameAs` on Organization (kills entity linking)
- SoftwareApplication without `offers` pricing
- Article without `author` or `dateModified`

#### E. Content Structure (Highest Impact for Citations)
These patterns dramatically increase AI citation probability:

- **Definitional opening**: The first paragraph on the page MUST contain a clear definition: "[Brand] is a [category] that [what it does]." LLMs need this to cite you. If the page opens with a marketing hook instead of a definition, flag it.
- **Direct answers first**: Start each section with a clear, direct answer in the first 40-60 words. Then expand with context. LLMs extract the first clear statement as the answer.
- **Heading hierarchy**: Use clean H2/H3 structure. Each heading should be a natural question or topic phrase that someone might ask an AI. Good: "What is [X]?" or "How does [X] work?". Bad: "Our Amazing Solution" or "Why Us".
- **Fact density**: Include a statistic, data point, or verifiable claim every 150-200 words. Claims without data ("save 80%") are weaker than claims with context ("clinics using X reported 80% reduction in no-shows in a 2025 study").
- **Lists and tables**: Structured ranking information (numbered lists, comparison tables) gets preferential treatment in AI answers. Pricing comparison tables are especially powerful.
- **TL;DR statements**: Add brief summaries under key headings that can stand alone as complete answers.
- **Source citations**: Link to authoritative sources. AI engines apply multi-source corroboration — content backed by references gets higher confidence.
- **Definitions**: When introducing terms, use clear definitional patterns ("X is..." or "X refers to...").

#### F. Meta & Social Tags (Medium Impact)
- **Title tags**: Include the primary question/topic the page answers. Avoid pure marketing copy.
- **Meta descriptions**: Write as a concise, self-contained answer (not a teaser). This is often what LLMs extract as a summary.
- **Open Graph tags**: Complete og:title, og:description, og:image (1200x630), og:type, og:url, og:locale
- **Twitter Cards**: summary_large_image with title, description, image
- **Canonical URLs**: `<link rel="canonical">` on every page. Check that og:url matches canonical. Check www vs non-www consistency.
- **hreflang**: If multilingual, add hreflang tags for each language variant.

**Common mistakes to flag:**
- og:url pointing to different domain than canonical (e.g., `clinisharp.com` vs `www.clinisharp.com.br`)
- Missing `<link rel="canonical">`
- Meta description that's a teaser ("Learn more...") instead of an answer

#### G. Content Freshness (Medium Impact)
- Add visible "Last updated: YYYY-MM-DD" timestamps on every content page
- Include `datePublished` and `dateModified` in JSON-LD (Article, BlogPosting, etc.)
- Update cornerstone content regularly with new data/insights
- Use time-stamped data ("As of Q1 2026, ...")
- **`<lastmod>` in sitemap.xml** must reflect actual content changes, not build dates
- A blog that hasn't been updated in 6+ months signals staleness to AI models

#### H. Authority Signals (Ongoing)
- Author bios with credentials and `sameAs` links to professional profiles
- About/Sobre page with Organization schema, founding story, team, CNPJ/tax ID
- References to and from third-party publications (press mentions, guest posts, partnerships)
- Consistent NAP (Name, Address, Phone) across the web
- Customer testimonials with real names and companies (not anonymous)
- Case studies with measurable results
- Industry certifications and compliance badges (LGPD, ISO, SOC2, etc.)

#### I. Content Strategy Assessment (Long-term Impact)
This is what separates a 40-score site from a 90-score site over time:

- **Does the site have a blog or content hub?** Sites without one are nearly invisible to LLMs for informational queries.
- **Content depth**: A single landing page is not enough. LLMs prefer citing sites that demonstrate deep expertise through multiple, interconnected articles.
- **Topic authority**: Does the content cover the full range of questions in its domain? For a clinic software, this means: guides on clinic management, comparisons, how-tos, industry data.
- **Content freshness**: How recently was content published? Are there dated articles?
- Read `references/content-strategy.md` for a full guide on creating GEO-optimized content.

### 4. Generate Report

Always produce **two outputs**: a terminal-friendly markdown report AND an interactive HTML report.

#### A. Terminal Output (always shown)

Use visual formatting to make the terminal output scannable and engaging:

```
## GEO Audit: [Site Name]

### Score: [X]/100 [BADGE]

[Progress bar using block chars: ████████░░░░░░░░░░░░ 38/100]

### Score Breakdown

| Category          | Score | Max | Status |
|-------------------|-------|-----|--------|
| AI Crawler Access | 0     | 10  | MISS   |
| Sitemap           | 0     | 5   | MISS   |
| ...               |       |     |        |

### Critical Issues
[RED] robots.txt — Missing (0/10)
[RED] llms.txt — Missing (0/10)
[RED] sitemap.xml — Missing (0/5)

### High Impact
[YLW] Structured Data — Partial (10/20)
[YLW] Content Structure — Needs work (12/20)

### Quick Wins (< 30 min each)
1. Create robots.txt — 15 min
2. Create llms.txt — 30 min
3. Fix og:url canonical — 5 min
```

Use these status markers in markdown:
- `MISS` for items scoring 0 (critical)
- `WARN` for items below 50% of max
- `OK` for items above 50%
- `GOOD` for items at full score

#### B. HTML Report (saved to file)

After showing the terminal report, generate an interactive HTML report:

1. Read the template from `assets/audit-report.html`
2. Replace all `__PLACEHOLDER__` values with actual audit data:
   - `__SITE_NAME__` → site name
   - `__SITE_URL__` → full URL
   - `__DATE__` → current date
   - `__SCORE__` → numeric score
   - `__SCORE_COLOR__` → color based on score (red < 30, orange < 50, yellow < 70, green >= 70)
   - `__SCORE_OFFSET__` → SVG offset: `502.65 - (502.65 * score / 100)`
   - `__SCORE_LABEL__` → "Critical" / "Needs Work" / "Decent" / "Strong" / "Elite"
   - `__SCORE_BG__` → background color with alpha
   - `__EXECUTIVE_SUMMARY__` → 2-3 sentence summary
   - `__CATEGORY_CARDS__` → HTML cards for each category with bar charts
   - `__ISSUES_CONTENT__` → all issues grouped by severity
   - `__CHECKLIST_ITEMS__` → interactive checklist items
   - `__CODE_FIXES__` → code blocks with ready-to-use fixes
3. Write the HTML to `/tmp/geo-audit-[sitename].html`
4. Open it with `open /tmp/geo-audit-[sitename].html`

**Category card HTML pattern:**
```html
<div class="cat-card">
  <div class="cat-header">
    <span class="cat-name">Category Name</span>
    <span class="cat-score" style="color:VAR_COLOR">X/MAX</span>
  </div>
  <div class="cat-bar">
    <div class="cat-bar-fill" style="width:PERCENT%;background:VAR_COLOR"></div>
  </div>
  <ul class="cat-issues">
    <li class="critical">Issue description</li>
    <li class="good">What's working well</li>
  </ul>
</div>
```

**Checklist item HTML pattern:**
```html
<div class="check-item">
  <div class="check-box"></div>
  <div class="check-text">
    <div class="action">Action description</div>
    <div class="meta">
      <span class="impact-badge impact-critical">Critical</span> · ~15 min
    </div>
  </div>
</div>
```

**Code fix HTML pattern:**
```html
<div class="code-block">
  <div class="label">robots.txt</div>
  <code>File contents here</code>
</div>
```

#### C. Comparison Report (for re-audits)

When the user has a previous audit, also generate a comparison dashboard:

1. Read `assets/comparison-dashboard.html`
2. Replace placeholders with before/after data
3. Show: score delta, per-category deltas, what changed, remaining issues
4. Write to `/tmp/geo-compare-[sitename].html` and open it

**Always provide ready-to-use code** for every recommendation — don't just say "add Organization schema", provide the complete JSON-LD block with the site's actual data filled in. The user should be able to copy-paste and deploy.

### 5. Implement (if requested)

When the user asks to implement fixes:
- Create/update `robots.txt`, `llms.txt`, `sitemap.ts`
- Add JSON-LD `<script>` blocks to pages
- Restructure content for AI readability
- Fix meta tags and canonical URLs
- Create content templates for blog posts

Refer to `references/frameworks.md` for framework-specific file locations and patterns.

---

## Key GEO Principles to Always Apply

### Write for Citation, Not Just Ranking
Every paragraph should be able to stand alone as a cited source. Ask: "If an AI extracted just this paragraph, would it be a complete, accurate, useful answer?"

### Entity Clarity
Make sure your brand, products, and people are clearly defined entities. Use consistent naming, link to canonical profiles, and provide enough context that an AI can confidently identify and reference you. The first mention of the brand on any page should be a complete definition.

### Question-Answer Alignment
Structure content around the questions people actually ask AI. Use those questions as headings. Provide direct answers immediately. This is the single highest-impact content pattern for GEO.

### The "Perplexity Test"
For any page, ask: "If someone asked Perplexity or ChatGPT about this topic, would my page provide a better answer than what's currently being cited?" If not, your content needs work.

### Avoid GEO Anti-Patterns
- Walls of unstructured text with no headings
- Marketing-first headings that don't answer questions ("Our Amazing Solution" vs "What is X?")
- Clickbait titles that don't match content
- Content that requires clicking through to understand (multi-page articles)
- Thin content without factual claims or data
- Claims without data ("save 80%" with no source or context)
- Missing author attribution
- No dates on content
- Blocking AI crawlers in robots.txt while wanting AI visibility
- og:url / canonical URL mismatches (www vs non-www, http vs https)
- FAQ sections with only 2-3 questions (too few to be useful)
- Single-page sites with no content depth (landing page only)

---

## Framework-Specific Guidance

Read `references/frameworks.md` for implementation details specific to:
- Next.js / React
- WordPress
- Static HTML
- Astro / Hugo / Other SSGs
- Django / Rails / Server-rendered apps

The reference file contains specific code patterns, file locations, and component examples for each framework.

---

## Scoring Rubric

When generating an audit score, use this rubric (100 points total):

| Category | Points | Criteria for Full Score |
|----------|--------|------------------------|
| AI Crawler Access | 10 | robots.txt exists, AI search bots explicitly allowed, SSR confirmed, no auth walls |
| Sitemap | 5 | sitemap.xml exists, referenced in robots.txt, includes all pages, has lastmod dates |
| llms.txt | 10 | Exists, well-structured, accurate description, links to key pages |
| Structured Data | 20 | Organization + WebSite + BreadcrumbList on homepage; correct type per page; sameAs links; FAQPage with 8+ questions |
| Content Structure | 20 | Definitional opening, direct answers first, clean heading hierarchy, fact density, lists/tables, Q&A headings |
| Meta & Social Tags | 10 | Title, description (answer-style), OG complete, Twitter Card, canonical consistent, hreflang if multilingual |
| Content Freshness | 10 | Visible dates, dateModified in schema, lastmod in sitemap, content updated within 6 months |
| Authority | 10 | About page, author bios with sameAs, org details (tax ID, address), testimonials, external references |
| Content Strategy | 5 | Blog/content hub exists, 5+ articles, covers domain questions, regular publishing cadence |

### Quick Score Guide

- **0-25**: Site is invisible to AI — missing fundamental infrastructure
- **26-50**: Basic presence but major gaps — AI may find but won't cite
- **51-70**: Decent foundation — some citations possible, clear path to improve
- **71-85**: Strong GEO — regularly cited by AI for domain queries
- **86-100**: Elite — first-choice source for AI engines in the domain
