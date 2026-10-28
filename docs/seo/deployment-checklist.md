# Pre-Launch & Netlify Deployment Checklist

**Project:** Zubair (ZASHLY) Developer Portfolio  
**Target Production URL:** [https://zubairkaportfolio.netlify.app/](https://zubairkaportfolio.netlify.app/)  
**Date:** October 27, 2026  
**Auditor:** Senior Release Engineer & Technical SEO Specialist  

---

## 1. Verified Local Quality Gates (All Passed)

- [x] **Linting:** `npm run lint` passes with 0 errors and 0 warnings (100% clean codebase).
- [x] **Production Compilation:** `npm run build` succeeds cleanly in <900ms.
- [x] **Static Route Generation:** `dist/contact/index.html` and `dist/404.html` generated with route-specific metadata and semantic noscript fallbacks.
- [x] **SEO Integrity Checks:** `npm run test:seo` passes 100% of checks across 5 JSON-LD schemas, robots.txt, sitemap.xml, llms.txt, and canonical URLs.
- [x] **Netlify SPA Configuration:** `public/_redirects` and `netlify.toml` configured with `/* /index.html 200` rewrite rules.
- [x] **Asset Bundling & Compression:** Brotli (`.br`) and Gzip (`.gz`) pre-compressed assets generated in `dist/`.
- [x] **Entity Consistency:** Creator standardized to "Zubair" (Brand: ZASHLY, zashly craft) with location Faisalabad, Pakistan.

---

## 2. Netlify Deployment Instructions

You have two standard, robust ways to deploy to `https://zubairkaportfolio.netlify.app/`:

### Option A: Automatic Git-Based Continuous Deployment (Recommended)
If your Netlify site is connected to your GitHub repository:
1. Commit and push your local branch to GitHub:
   ```bash
   git add .
   git commit -m "feat(seo): complete Netlify SEO, AEO, and GEO optimization"
   git push origin main
   ```
2. In the **Netlify Dashboard** for `zubairkaportfolio`:
   - Navigate to **Site configuration** -> **Build & deploy** -> **Build settings**.
   - Verify settings:
     - **Base directory:** `portfolio` (or leave blank if using root `netlify.toml`)
     - **Build command:** `npm run build`
     - **Publish directory:** `dist` (or `portfolio/dist` if base is repository root)
3. Netlify will trigger the build and deploy to `https://zubairkaportfolio.netlify.app/`.

### Option B: Netlify CLI Direct Deployment
From your terminal in the `portfolio/` directory:
```bash
# 1. Install or run Netlify CLI
npx netlify deploy --prod --dir=dist
```
*Follow the terminal prompts to link with your existing site `zubairkaportfolio`.*

---

## 3. Post-Deployment Live Verification Checklist

Once Netlify shows the deployment is published, verify the live endpoints:

- [ ] **Homepage HTTP Check:**
  ```bash
  curl -I https://zubairkaportfolio.netlify.app/
  ```
  *Expected result:* `HTTP/2 200`
- [ ] **Contact Page Direct Navigation / Refresh Check:**
  ```bash
  curl -I https://zubairkaportfolio.netlify.app/contact
  ```
  *Expected result:* `HTTP/2 200` (pre-rendered static HTML or SPA rewrite).
- [ ] **Robots.txt Check:**
  ```bash
  curl https://zubairkaportfolio.netlify.app/robots.txt
  ```
  *Expected result:* Complete robots.txt with allowed crawlers and `Sitemap: https://zubairkaportfolio.netlify.app/sitemap.xml`.
- [ ] **Sitemap.xml Check:**
  ```bash
  curl https://zubairkaportfolio.netlify.app/sitemap.xml
  ```
  *Expected result:* Clean XML with `https://zubairkaportfolio.netlify.app/` and `/contact`.
- [ ] **LLMs.txt Check:**
  ```bash
  curl https://zubairkaportfolio.netlify.app/llms.txt
  ```
  *Expected result:* Markdown document summarizing Zubair's profile, projects, and contact channels.
- [ ] **Social Sharing Preview Test:**
  Share `https://zubairkaportfolio.netlify.app/` in a LinkedIn post or Twitter/X composer draft or test on [https://www.opengraph.xyz/](https://www.opengraph.xyz/) to confirm `og-image.png` loads properly.

---

## 4. Search Engine & Webmaster Console Setup (Owner Manual Action)

Search engines do not index new custom domains immediately without explicit registration:

### Step 1: Google Search Console (GSC)
1. Go to [https://search.google.com/search-console](https://search.google.com/search-console).
2. Click **Add Property** -> Select **URL prefix**: `https://zubairkaportfolio.netlify.app/`.
3. Verification method:
   - *HTML Tag:* Add the verification meta tag to `index.html` (or use Netlify DNS / Google Analytics if already linked).
4. After verification:
   - Navigate to **Sitemaps** -> Submit: `https://zubairkaportfolio.netlify.app/sitemap.xml`.
   - Go to **URL Inspection** -> Enter `https://zubairkaportfolio.netlify.app/` -> Click **Request Indexing**.
   - Inspect `https://zubairkaportfolio.netlify.app/contact` -> Click **Request Indexing**.

### Step 2: Bing Webmaster Tools
1. Go to [https://www.bing.com/webmasters](https://www.bing.com/webmasters).
2. Choose **Import from Google Search Console** (simplest 1-click verification).
3. Confirm `https://zubairkaportfolio.netlify.app/sitemap.xml` is listed under Sitemaps.

### Step 3: Local Visibility & Google Business Profile Note
- As a freelance web developer, Google Business Profile (GBP) guidelines require either a physical office with visible signage or a Service Area Business (SAB) where you serve clients in person.
- If you work 100% remotely as a digital freelancer, your primary local ranking mechanism is on-page Local SEO (Faisalabad keywords in title, description, schema, and FAQ) rather than a physical store listing.
