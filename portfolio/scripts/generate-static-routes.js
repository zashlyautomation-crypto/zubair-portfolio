import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')

console.log('=== GENERATING STATIC PRE-RENDERED ROUTES FOR NETLIFY ===\n')

if (!fs.existsSync(distDir)) {
  console.error('[ERROR] dist directory does not exist. Run vite build first.')
  process.exit(1)
}

const indexPath = path.join(distDir, 'index.html')
const indexHtml = fs.readFileSync(indexPath, 'utf8')

function createRouteHtml({ routePath, title, description, canonical, h1, bodyContent, extraSchema }) {
  // Ensure cross-platform directory creation (Windows \ vs Linux /)
  const segments = routePath.split(/[/\\]/)
  const targetDir = path.resolve(distDir, ...segments)
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  let routeHtml = indexHtml

  // Update Title (strictly <60 chars for Semrush & SERP display)
  routeHtml = routeHtml.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)

  // Update Meta Description
  routeHtml = routeHtml.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/,
    `<meta name="description" content="${description}" />`
  )

  // Update Canonical (with trailing slash for Netlify 200 OK)
  routeHtml = routeHtml.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/,
    `<link rel="canonical" href="${canonical}" />`
  )

  // Update OG
  routeHtml = routeHtml.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/,
    `<meta property="og:title" content="${title}" />`
  )
  routeHtml = routeHtml.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/,
    `<meta property="og:description" content="${description}" />`
  )
  routeHtml = routeHtml.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/,
    `<meta property="og:url" content="${canonical}" />`
  )

  // Update Twitter
  routeHtml = routeHtml.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/,
    `<meta name="twitter:title" content="${title}" />`
  )
  routeHtml = routeHtml.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/,
    `<meta name="twitter:description" content="${description}" />`
  )

  // Insert extra schema if provided
  if (extraSchema) {
    routeHtml = routeHtml.replace(
      '</head>',
      `  <script type="application/ld+json">\n${JSON.stringify(extraSchema, null, 2)}\n  </script>\n</head>`
    )
  }

  // Pre-render content inside #root
  const semanticRoot = `
    <div id="root">
      <header style="max-width:960px;margin:0 auto;padding:30px 24px;">
        <nav><a href="https://zubairkaportfolio.netlify.app/" style="color:#f7931e;text-decoration:none;font-weight:700;">&larr; Back to Portfolio</a></nav>
      </header>
      <main style="max-width:960px;margin:0 auto;padding:20px 24px 60px;font-family:sans-serif;line-height:1.7;color:#fff;">
        <h1 style="color:#f7931e;font-size:2.2rem;margin-bottom:16px;">${h1}</h1>
        ${bodyContent}
      </main>
    </div>`

  routeHtml = routeHtml.replace(/<div id="root">[\s\S]*?<\/div>\s*<script/m, `${semanticRoot}\n    <script`)

  fs.writeFileSync(path.join(targetDir, 'index.html'), routeHtml, 'utf8')
  console.log(`[PASS] Generated dist/${segments.join('/')}/index.html with pre-rendered copy & metadata`)
}

// ── 1. Contact Route ────────────────────────────────────────────────────────
createRouteHtml({
  routePath: 'contact',
  title: 'Contact Zubair (ZASHLY) — Hire React Developer',
  description: 'Hire Zubair (ZASHLY / zashly craft), freelance React JS developer and UI/UX designer based in Faisalabad, Pakistan. Email: zashlycraft@gmail.com',
  canonical: 'https://zubairkaportfolio.netlify.app/contact/',
  h1: "Let's Connect — Hire Zubair (ZASHLY)",
  bodyContent: `
    <p>Freelance React JS Developer &amp; UI/UX Designer based in Faisalabad, Punjab, Pakistan.</p>
    <p><strong>Email:</strong> <a href="mailto:zashlycraft@gmail.com" style="color:#f7931e;">zashlycraft@gmail.com</a></p>
    <p><strong>Phone:</strong> +923294264963</p>
    <p><strong>GitHub:</strong> <a href="https://github.com/zashlyautomation-crypto/" style="color:#f7931e;">github.com/zashlyautomation-crypto</a></p>
    <p><strong>Location:</strong> Faisalabad, Punjab, Pakistan</p>
    <h2>Frequently Asked Questions About Hiring</h2>
    <p><strong>How can I hire Zubair for a project?</strong> Send your project brief and timeline to zashlycraft@gmail.com or submit the message form.</p>
    <p><strong>Do you work with international clients?</strong> Yes, remote contracts are available for clients across the US, UK, Europe, UAE, and Pakistan.</p>
    <p><strong>What is the typical response time?</strong> Inquiries receive an answer within 24 hours.</p>
  `,
  extraSchema: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How can I hire Zubair for a web development project?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Send your project brief and timeline to zashlycraft@gmail.com or submit the direct message form on the contact page.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Do you work with international clients outside Pakistan?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes. Zubair collaborates with founders, design studios, and engineering teams across the United States, United Kingdom, Europe, and UAE on remote contracts.'
        }
      }
    ]
  }
})

// ── 2. Dedicated Next.js Landing Page ──────────────────────────────────────
createRouteHtml({
  routePath: 'hire-next-js-developer-faisalabad',
  title: 'Hire Next.js Developer Faisalabad | ZASHLY Optimization',
  description: 'Looking to hire a top Next.js developer in Faisalabad, Pakistan? Zubair (ZASHLY) specializes in Next.js 15, App Router, Core Web Vitals optimization, and high-converting web apps.',
  canonical: 'https://zubairkaportfolio.netlify.app/hire-next-js-developer-faisalabad/',
  h1: 'Hire Next.js Developer in Faisalabad &middot; Next.js Performance Optimization Expert',
  bodyContent: `
    <p>Looking to hire a vetted Next.js developer in Faisalabad, Punjab, Pakistan? Zubair (ZASHLY) engineers high-performance web applications with Next.js 15, App Router, React Server Components (RSC), and sub-second Core Web Vitals.</p>
    <h2>Next.js Engineering Services in Faisalabad</h2>
    <ul>
      <li><strong>Next.js App Router Architecture:</strong> Server components, streaming responses, and nested layouts.</li>
      <li><strong>Core Web Vitals Optimization:</strong> Remediating poor LCP, INP, and CLS scores to achieve 90+ Lighthouse ratings.</li>
      <li><strong>Server Actions &amp; Zero-Bundle RPC:</strong> Moving data fetching to server layers for instantaneous optimistic UX.</li>
      <li><strong>Headless E-commerce Frontends:</strong> Fast, conversion-optimized shopping experiences.</li>
    </ul>
    <h2>Serving Faisalabad Businesses &amp; Global Remote Teams</h2>
    <p>Zubair provides dedicated frontend engineering for software houses and startups across Faisalabad and Pakistan, alongside overseas founders in the US, UK, and Europe.</p>
    <p><a href="https://zubairkaportfolio.netlify.app/contact/" style="background:#f7931e;color:#000;padding:10px 24px;border-radius:9999px;font-weight:700;text-decoration:none;">Contact Zubair for Next.js Projects &rarr;</a></p>
  `,
  extraSchema: {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': 'ZASHLY Next.js Development Faisalabad',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Faisalabad',
      'addressRegion': 'Punjab',
      'addressCountry': 'PK'
    },
    'telephone': '+923294264963',
    'email': 'zashlycraft@gmail.com'
  }
})

// ── 3. React 19 Technical Guide ───────────────────────────────────────────
createRouteHtml({
  routePath: 'guides/react-19-server-actions-performance',
  title: 'React 19 Server Actions & Real-Time Performance | ZASHLY',
  description: 'A deep-dive technical guide on how React 19 Server Actions, useOptimistic, and streaming SSR dramatically improve real-time performance and reduce INP in modern web apps.',
  canonical: 'https://zubairkaportfolio.netlify.app/guides/react-19-server-actions-performance/',
  h1: 'How React 19 Features Like Server Actions Improve Real-Time Performance in Web Applications',
  bodyContent: `
    <p>An in-depth technical analysis authored by Zubair (ZASHLY), freelance React JS developer from Faisalabad, Pakistan. Learn how React 19 Server Actions, zero-bundle RPCs, and the useOptimistic hook transform web performance.</p>
    <h2>1. The Problem with Legacy Client-Side Mutations</h2>
    <p>Traditional React 16-18 apps bundled heavy fetching libraries (Axios, TanStack Query), bloating client bundles and delaying Interaction to Next Paint (INP).</p>
    <h2>2. Zero-Bundle RPC &amp; Server-Side Execution</h2>
    <p>React 19 Server Actions with the 'use server' directive move database operations and validation schemas entirely to the server, keeping browser bundles under 70kB.</p>
    <h2>3. 0ms Perceived Latency with useOptimistic</h2>
    <p>Optimistic state mutations allow the UI to paint immediately at 60 FPS while the server executes in the background, slashing INP to sub-35ms.</p>
    <p><a href="https://zubairkaportfolio.netlify.app/contact/" style="background:#f7931e;color:#000;padding:10px 24px;border-radius:9999px;font-weight:700;text-decoration:none;">Hire Zubair for React 19 Architecture &rarr;</a></p>
  `,
  extraSchema: {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': 'How React 19 Server Actions Improve Real-Time Performance in Web Applications',
    'author': {
      '@type': 'Person',
      'name': 'Zubair',
      'url': 'https://zubairkaportfolio.netlify.app/'
    }
  }
})

// ── 4. Comparison Guide ───────────────────────────────────────────────────
createRouteHtml({
  routePath: 'comparisons/threejs-vs-spline-performance',
  title: 'Three.js & GSAP vs Spline 3D Performance | ZASHLY',
  description: 'An architectural benchmark comparing custom Three.js and GSAP against Spline 3D and generic web builders for web performance, SEO crawlability, and 60fps animations.',
  canonical: 'https://zubairkaportfolio.netlify.app/comparisons/threejs-vs-spline-performance/',
  h1: 'Custom Three.js &amp; GSAP vs. Spline 3D &amp; Generic Web Builders',
  bodyContent: `
    <p>An architectural benchmark by Zubair (ZASHLY) analyzing payload sizes, GPU memory consumption, and SEO discoverability between custom Three.js code and no-code 3D builders.</p>
    <h2>1. Bundle Weight: 350kB vs 2.5MB</h2>
    <p>Custom Three.js bundles only necessary shaders and geometries, whereas Spline ships an entire runtime engine that triggers mobile thermal throttling.</p>
    <h2>2. Eliminating the SEO Render Gap</h2>
    <p>Custom architectures decouple WebGL canvas rendering from semantic DOM text, allowing search engines and AI answer engines to read 100% of your copy instantly.</p>
    <p><a href="https://zubairkaportfolio.netlify.app/contact/" style="background:#f7931e;color:#000;padding:10px 24px;border-radius:9999px;font-weight:700;text-decoration:none;">Discuss a Custom 3D Project with Zubair &rarr;</a></p>
  `,
  extraSchema: {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': 'Custom Three.js & GSAP vs Spline 3D & Generic Web Builders: Real Web Performance & SEO Benchmark',
    'author': {
      '@type': 'Person',
      'name': 'Zubair',
      'url': 'https://zubairkaportfolio.netlify.app/'
    }
  }
})

// ── 5. Create dist/404.html ──────────────────────────────────────────────
const fourOhFourPath = path.join(distDir, '404.html')
const fourOhFourHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, follow" />
    <title>404 — Page Not Found | ZASHLY</title>
    <meta http-equiv="refresh" content="3; url=https://zubairkaportfolio.netlify.app/" />
    <link rel="icon" type="image/svg+xml" href="https://zubairkaportfolio.netlify.app/favicon.svg" />
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        background: #0a0a0a;
        color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 20px;
      }
      .box { max-width: 500px; }
      h1 { font-size: 6rem; margin: 0; color: #f7931e; line-height: 1; }
      h2 { font-size: 1.5rem; margin: 16px 0 8px; font-weight: 600; }
      p { color: rgba(255, 255, 255, 0.7); line-height: 1.6; margin-bottom: 24px; }
      a { display: inline-block; background: #f7931e; color: #000; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 600; }
    </style>
  </head>
  <body>
    <div class="box">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you requested could not be found. You will be redirected to the home page in a few seconds.</p>
      <a href="https://zubairkaportfolio.netlify.app/">Return to Home</a>
    </div>
  </body>
</html>`

fs.writeFileSync(fourOhFourPath, fourOhFourHtml, 'utf8')
console.log('[PASS] Generated dist/404.html with noindex and redirect')

console.log('\n=== STATIC ROUTE GENERATION COMPLETE ===')
