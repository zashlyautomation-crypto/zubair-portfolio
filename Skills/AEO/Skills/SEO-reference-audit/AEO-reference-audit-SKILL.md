---
name: seo
description: 'Era-checked implementation reference and audit workflow for technical SEO and answer-engine
  (AEO) visibility, current to 2026: copy-paste JSON-LD, robots, canonical and hreflang blocks, vendored
  Lighthouse, PageSpeed and Search Console scripts, plus a load-bearing llms.txt caution. Reach for it
  when building or reviewing a site''s markup, crawlability, or AI-citation posture; it will not recommend
  retired rich-result types.'
license: MIT
treatment: derivative
derived_from:
- id: addyosmani/web-quality-skills/seo
  role: base
  license_at_derivation: MIT
  content_hash_at_derivation: f78092144a400aceafb8ba3a3a0757ea636df0ca6f99f7c67f47a8db94997d6b
- id: warpdotdev/oz-skills/seo-aeo-audit
  role: graft
  license_at_derivation: MIT
  content_hash_at_derivation: 1601f009764ab61f66a2a68a2b154679f3500da657edd4543a4feb6397554bdd
- id: tech-leads-club/agent-skills/seo
  role: sibling
  license_at_derivation: NOASSERTION
  content_hash_at_derivation: d52227fcbdcec94c549723f0248a843e7d99eba31685555f92efa83234cd79ac
- id: manojbajaj95/claude-gtm-plugin/seo-and-aeo-strategy
  role: sibling
  license_at_derivation: MIT
  content_hash_at_derivation: 50e6dc790d305a52c0e35c1d5abbb73d302ba4ef6e8473b699da5520d48c3b90
targeted_version: Google Search / answer-engine guidance as of 2026-08
last_verified_at: 2026-08-10
---

# SEO implementation reference and audit workflow

SEO implementation reference per Lighthouse audits and Google Search guidelines, with a scripted audit loop and an AEO half.

## Conditions

### When to use
- Implementing or reviewing markup you control: JSON-LD, robots, canonicals, sitemaps, hreflang, mobile meta.
- Running the audit loop via the vendored Lighthouse/PageSpeed/Search Console scripts.
- Making pages extractable and citable by answer engines without over-claiming.

### When NOT to use
- Keyword research, content strategy, backlink campaigns — this reference plans nothing.
- Requests for FAQ or HowTo markup "to win rich results" — see Era; that lever is retired.
- Scored audits of arbitrary domains or repo-level static validation — other skills do that.

### Prerequisites
- `bash` + `curl`; Node 18+ (`search-console-export.mjs`); Lighthouse CLI (`npm i -g lighthouse`); `python3` (`pagespeed.sh` URL-encoding).
- `PAGESPEED_API_KEY`; `GSC_ACCESS_TOKEN` OAuth token, `webmasters.readonly` scope.
- Deploy access to the site's HTML and headers.

### What breaks first
- Schema-type status: templates keep validating after the result type retires (FAQ 2026-05-07, HowTo September 2023).
- AI-crawler user-agent names churn; re-check before editing robots.txt.
- API surfaces: PageSpeed v5, Search Console v1 (25,000-row cap), Lighthouse CLI flags.
- Adoption stats (llms.txt ~0.015%) age fastest.

## Era

Reviewed 2026-08-10 (batch 940); targets Google Search and answer-engine behavior, August 2026.

- Google retired FAQ rich results for every site on 2026-05-07 (templates stay — see Structured data).
- HowTo rich results have been deprecated since September 2023; do not add HowTo markup.
- As of mid-2026, `llms.txt` remains a proposed convention at roughly 0.015% adoption with no vendor confirmation. The caution below is load-bearing.

## SEO fundamentals

Search ranking factors (approximate influence):

| Factor | Influence | This Skill |
|--------|-----------|------------|
| Content quality & relevance | ~40% | Partial (structure) |
| Backlinks & authority | ~25% | ✗ |
| Technical SEO | ~15% | ✓ |
| Page experience (Core Web Vitals) | ~10% | ✗ (measure via `scripts/pagespeed.sh`) |
| On-page SEO | ~10% | ✓ |

---

## Technical SEO

### Crawlability

**robots.txt:**
```text
# /robots.txt
User-agent: *
Allow: /

# Block admin/private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/

# Don't block resources needed for rendering
# ❌ Disallow: /static/

Sitemap: https://example.com/sitemap.xml
```

**Meta robots:**
```html
<!-- Default: indexable, followable -->
<meta name="robots" content="index, follow">

<!-- Noindex specific pages -->
<meta name="robots" content="noindex, nofollow">

<!-- Indexable but don't follow links -->
<meta name="robots" content="index, nofollow">

<!-- Control snippets -->
<meta name="robots" content="max-snippet:150, max-image-preview:large">
```

**Canonical URLs:**
```html
<!-- Prevent duplicate content issues -->
<link rel="canonical" href="https://example.com/page">

<!-- Self-referencing canonical (recommended) -->
<link rel="canonical" href="https://example.com/current-page">

<!-- For paginated content -->
<link rel="canonical" href="https://example.com/products">
<!-- Or use rel="prev" / rel="next" for explicit pagination (Bing-only since 2019) -->
```

### XML sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/products</loc>
    <lastmod>2024-01-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Sitemap best practices:**
- Maximum 50,000 URLs or 50MB per sitemap
- Use sitemap index for larger sites
- Include only canonical, indexable URLs
- Update `lastmod` when content changes
- Submit to Google Search Console

### URL structure

```
✅ Good URLs:
https://example.com/products/blue-widget
https://example.com/blog/how-to-use-widgets

❌ Poor URLs:
https://example.com/p?id=12345
https://example.com/products/item/category/subcategory/blue-widget-2024-sale-discount
```

**URL guidelines:**
- Use hyphens, not underscores
- Lowercase only
- Keep short (< 75 characters)
- Include target keywords naturally
- Avoid parameters when possible
- Use HTTPS always

### HTTPS & security

```html
<!-- Ensure all resources use HTTPS -->
<img src="https://example.com/image.jpg">

<!-- Not: -->
<img src="http://example.com/image.jpg">
```

**Security headers for SEO trust signals:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

### Verify

```bash
curl -s https://example.com/robots.txt
curl -s -o /dev/null -w "%{http_code}\n" https://example.com/sitemap.xml   # 200
curl -sI https://example.com/ | grep -i strict-transport-security
```

---

## On-page SEO

### Title tags

```html
<!-- ❌ Missing or generic -->
<title>Page</title>
<title>Home</title>

<!-- ✅ Descriptive with primary keyword -->
<title>Blue Widgets for Sale | Premium Quality | Example Store</title>
```

**Title tag guidelines:**
- 50-60 characters (Google truncates ~60)
- Primary keyword near the beginning
- Unique for every page
- Brand name at end (unless homepage)
- Action-oriented when appropriate

### Meta descriptions

```html
<!-- ❌ Missing or duplicate -->
<meta name="description" content="">

<!-- ✅ Compelling and unique -->
<meta name="description" content="Shop premium blue widgets with free shipping. 30-day returns. Rated 4.9/5 by 10,000+ customers. Order today and save 20%.">
```

**Meta description guidelines:**
- 150-160 characters
- Include primary keyword naturally
- Compelling call-to-action
- Unique for every page
- Matches page content

### Heading structure

```html
<!-- ❌ Poor structure -->
<h2>Welcome to Our Store</h2>
<h4>Products</h4>
<h1>Contact Us</h1>

<!-- ✅ Proper hierarchy -->
<h1>Blue Widgets - Premium Quality</h1>
  <h2>Product Features</h2>
    <h3>Durability</h3>
    <h3>Design</h3>
  <h2>Customer Reviews</h2>
  <h2>Pricing</h2>
```

**Heading guidelines:**
- Single `<h1>` per page (the main topic)
- Logical hierarchy (don't skip levels)
- Include keywords naturally
- Descriptive, not generic

### Image SEO

```html
<!-- ❌ Poor image SEO -->
<img src="IMG_12345.jpg">

<!-- ✅ Optimized image -->
<img src="blue-widget-product-photo.webp"
     alt="Blue widget with chrome finish, side view showing control panel"
     width="800"
     height="600"
     loading="lazy">
```

**Image guidelines:**
- Descriptive filenames with keywords
- Alt text describes the image content
- Compressed and properly sized
- WebP/AVIF with fallbacks
- Lazy load below-fold images

### Internal linking

```html
<!-- ❌ Non-descriptive -->
<a href="/products">Click here</a>
<a href="/widgets">Read more</a>

<!-- ✅ Descriptive anchor text -->
<a href="/products/blue-widgets">Browse our blue widget collection</a>
<a href="/guides/widget-maintenance">Learn how to maintain your widgets</a>
```

**Linking guidelines:**
- Descriptive anchor text with keywords
- Link to relevant internal pages
- Reasonable number of links per page
- Fix broken links promptly
- Use breadcrumbs for hierarchy

### Verify

```bash
curl -s https://example.com/ | grep -oE "<title>[^<]*</title>"
curl -s https://example.com/ | grep -c "<h1"   # expect 1
```

---

## Structured data (JSON-LD)

> Era: Google retired FAQ rich results for every site on 2026-05-07, and HowTo rich results have been deprecated since September 2023 — neither earns Google rich results anymore. The templates stay: valid schema.org data, useful for AI extraction, not a Google lever.

### Organization

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Example Company",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://twitter.com/example",
    "https://linkedin.com/company/example"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-123-4567",
    "contactType": "customer service"
  }
}
</script>
```

### Article

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Choose the Right Widget",
  "description": "Complete guide to selecting widgets for your needs.",
  "image": "https://example.com/article-image.jpg",
  "author": {
    "@type": "Person",
    "name": "Jane Smith",
    "url": "https://example.com/authors/jane-smith"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Example Blog",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-20"
}
</script>
```

### Product

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Blue Widget Pro",
  "image": "https://example.com/blue-widget.jpg",
  "description": "Premium blue widget with advanced features.",
  "brand": {
    "@type": "Brand",
    "name": "WidgetCo"
  },
  "offers": {
    "@type": "Offer",
    "price": "49.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://example.com/products/blue-widget"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1250"
  }
}
</script>
```

### FAQ

Per the Era note above: AI parsing only, no Google rich result.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What colors are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our widgets come in blue, red, and green."
      }
    },
    {
      "@type": "Question",
      "name": "What is the warranty?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All widgets include a 2-year warranty."
      }
    }
  ]
}
</script>
```

### Breadcrumbs

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Products",
      "item": "https://example.com/products"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Blue Widgets",
      "item": "https://example.com/products/blue-widgets"
    }
  ]
}
</script>
```

### Validation

Test structured data at:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

### Verify

```bash
curl -s https://example.com/ | grep -c 'application/ld+json'   # expect >= 1
```

---

## AI search visibility

A class of AI search engines (ChatGPT search, Perplexity, Gemini Overviews) cite web pages from their training and retrieval pipelines, not from the classic ranked results. As of 2026 this is an unstable area — there are no confirmed ranking signals — but a few things are low-cost and won't hurt:

- **Don't block AI crawlers wholesale.** `OAI-SearchBot`, `PerplexityBot`, `GoogleOther`, `Google-Extended`, `ClaudeBot`, etc. each have separate `robots.txt` user-agents. Decide per-bot rather than blanket-blocking — a `Disallow` removes you from that bot's citations.
- **Lean on schema.org `Article`/`Product`/`FAQPage`.** AI summarizers parse structured data more reliably than they parse prose layouts. The structured-data examples above are the same ones that help here (FAQPage: AI parsing only — see Era).
- **Make first-paragraph answers self-contained.** Both featured snippets and AI summaries pull short, coherent passages. A definition or direct answer in the first 1-2 sentences is more extractable than the same content buried under marketing prose.

### llms.txt — proposed, unproven

[`llms.txt`](https://llmstxt.org/) is a proposed convention (a Markdown index of your site's important pages, served at `/llms.txt`) for LLMs to consume. As of mid-2026 adoption is ~0.015% of sites and **no major AI vendor has confirmed they read it**. Treat it as a 5-minute speculative add for content sites — not a meaningful ranking or citation factor — and don't reorganize content around it. The fork dropped this caution; the AEO half was checked against it.

### Verify

```bash
curl -s https://example.com/robots.txt | grep -iE 'OAI-SearchBot|PerplexityBot|GoogleOther|Google-Extended|ClaudeBot'
curl -s -o /dev/null -w "%{http_code}\n" https://example.com/llms.txt
```

---

## Mobile SEO

### Responsive design

```html
<!-- ❌ Not mobile-friendly -->
<meta name="viewport" content="width=1024">

<!-- ✅ Responsive viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### Tap targets

```css
/* ❌ Too small for mobile */
.small-link {
  padding: 4px;
  font-size: 12px;
}

/* ✅ Adequate tap target */
.mobile-friendly-link {
  padding: 12px;
  font-size: 16px;
  min-height: 48px;
  min-width: 48px;
}
```

### Font sizes

```css
/* ❌ Too small on mobile */
body {
  font-size: 10px;
}

/* ✅ Readable without zooming */
body {
  font-size: 16px;
  line-height: 1.5;
}
```

### Verify

```bash
curl -s https://example.com/ | grep viewport
```

---

## International SEO

### Hreflang tags

```html
<!-- For multi-language sites -->
<link rel="alternate" hreflang="en" href="https://example.com/page">
<link rel="alternate" hreflang="es" href="https://example.com/es/page">
<link rel="alternate" hreflang="fr" href="https://example.com/fr/page">
<link rel="alternate" hreflang="x-default" href="https://example.com/page">
```

### Language declaration

```html
<html lang="en">
<!-- or -->
<html lang="es-MX">
```

### Verify

```bash
curl -s https://example.com/ | grep hreflang
```

---

## Audit workflow

1. Baseline: run Lighthouse and PageSpeed on key templates (home, category, detail, blog).
2. Crawl: verify indexability, canonicals, and duplicate content (use Search Console + crawler).
3. Fix blockers: `noindex`, `robots.txt`, canonical mismatches, redirect chains.
4. On-page: titles, meta descriptions, headings, internal linking, image alt.
5. Structured data: add JSON-LD and validate rich results.
6. Re-verify: re-run Lighthouse/PageSpeed and check Search Console coverage.

### Verify

Run the vendored scripts:

```bash
# SEO category; URL or urls.txt
bash scripts/lighthouse.sh https://example.com reports/lighthouse

# PageSpeed Insights v5 API
PAGESPEED_API_KEY=... bash scripts/pagespeed.sh https://example.com reports/pagespeed

# args: <siteUrl> <startDate> <endDate> [outputDir]
GSC_ACCESS_TOKEN=... node scripts/search-console-export.mjs https://example.com 2024-01-01 2024-01-31 reports/search-console
```

The scripts' usage messages print an extra `seo/` path segment (upstream layout); shipped paths are `scripts/<name>`. All three make external calls — see Findings.

---

## AEO / answer-engine visibility

Grafted from the fork, condensed; checked against the llms.txt caution — nothing here treats `llms.txt` as a lever. AEO targets citations and brand authority inside AI-generated responses (ChatGPT, Perplexity, Gemini, Google AI Overviews); the metric is citation frequency, not position and CTR.

**Answer-first content.** Open each section with the 40-60 word direct answer, then elaborate (under 30 words lacks substance; over 80 is hard to extract). Make answers self-contained — AI engines extract passages without surrounding context — with specific, quantified, dated claims phrased as users ask. Entity framing beats keyword repetition: who you are, what you do, concrete numbers, why an AI should trust you.

**Schema for AEO.** Copy-paste templates live in `references/json-ld-templates.md`:

- **FAQPage** — machine-readable Q&A for AI extraction (per Era, no Google rich result). Match visible H2/H3 headings to the schema `name` exactly; no markup diverging from visible content.
- **Author + Organization** — trust signals; AI engines prioritize identifiable sources; `sameAs` disambiguates the brand.
- **Product** — accurate pricing, availability, and reviews in AI shopping surfaces.

**Measurement.** Track AI referrals as separate GA4 sources (`chat.openai.com`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`). Per-engine preference profiles and the monthly citation-testing cadence belong to the bundle's strategy layer (ai-seo), not this reference.

### Verify

```bash
curl -s https://example.com/faq | grep -c 'FAQPage'   # AI parsing only
```

---

## SEO audit checklist

### Critical
- [ ] HTTPS enabled
- [ ] robots.txt allows crawling
- [ ] No `noindex` on important pages
- [ ] Title tags present and unique
- [ ] Single `<h1>` per page

### High priority
- [ ] Meta descriptions present
- [ ] Sitemap submitted
- [ ] Canonical URLs set
- [ ] Mobile-responsive
- [ ] Core Web Vitals passing

### Medium priority
- [ ] Structured data implemented
- [ ] Internal linking strategy
- [ ] Image alt text
- [ ] Descriptive URLs
- [ ] Breadcrumb navigation

### Ongoing
- [ ] Fix crawl errors in Search Console
- [ ] Update sitemap when content changes
- [ ] Monitor ranking changes
- [ ] Check for broken links
- [ ] Review Search Console insights

---

## Tools

| Tool | Use |
|------|-----|
| Google Search Console | Monitor indexing, fix issues |
| Google PageSpeed Insights | Performance + Core Web Vitals |
| Rich Results Test | Validate structured data |
| Lighthouse | Full SEO audit |
| Screaming Frog | Crawl analysis |

## References

- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)

---

## Attribution

- **Base**: `addyosmani/web-quality-skills/seo` (MIT) — every section not listed under Graft, including the llms.txt caution.
- **Graft**: `warpdotdev/oz-skills/seo-aeo-audit` (MIT) — audit workflow, the Lighthouse/PageSpeed/Search Console scripts, the AEO half (condensed).
- Siblings (shared upstream ancestry, zero text taken): `tech-leads-club/agent-skills/seo`, `manojbajaj95/claude-gtm-plugin/seo-and-aeo-strategy`.

Vendored (graft source, MIT, fetched 2026-08-10): `scripts/lighthouse.sh`, `scripts/pagespeed.sh`, `scripts/search-console-export.mjs`, `references/json-ld-templates.md`. MIT-licensed; changes in Findings and notes.md.
