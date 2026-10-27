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

// ── 1. Create dist/contact/index.html ──────────────────────────────────────
const contactDir = path.join(distDir, 'contact')
if (!fs.existsSync(contactDir)) {
  fs.mkdirSync(contactDir, { recursive: true })
}

let contactHtml = indexHtml

// Update <title>
contactHtml = contactHtml.replace(
  /<title>.*?<\/title>/,
  '<title>Contact Zubair — Hire a Freelance React Developer | ZASHLY</title>'
)

// Update <meta name="description">
contactHtml = contactHtml.replace(
  /<meta\s+name="description"\s+content=".*?"\s*\/?>/,
  '<meta name="description" content="Contact Zubair (ZASHLY), freelance React developer and UI/UX designer based in Faisalabad, Pakistan. Available for freelance projects, full-time roles, and contracts. Email: zashlycraft@gmail.com" />'
)

// Update canonical URL
contactHtml = contactHtml.replace(
  /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/,
  '<link rel="canonical" href="https://zubairkaportfolio.netlify.app/contact" />'
)

// Update OG tags
contactHtml = contactHtml.replace(
  /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/,
  '<meta property="og:title" content="Contact Zubair — Hire a Freelance React Developer | ZASHLY" />'
)
contactHtml = contactHtml.replace(
  /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/,
  '<meta property="og:description" content="Get in touch with Zubair (ZASHLY), a freelance React developer and UI/UX designer from Faisalabad, Pakistan. Email: zashlycraft@gmail.com" />'
)
contactHtml = contactHtml.replace(
  /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/,
  '<meta property="og:url" content="https://zubairkaportfolio.netlify.app/contact" />'
)

// Update Twitter card tags
contactHtml = contactHtml.replace(
  /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/,
  '<meta name="twitter:title" content="Contact Zubair — Hire a Freelance React Developer | ZASHLY" />'
)
contactHtml = contactHtml.replace(
  /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/,
  '<meta name="twitter:description" content="Get in touch with Zubair (ZASHLY), a freelance React developer and UI/UX designer from Faisalabad, Pakistan." />'
)

// Pre-render semantic fallback inside #root for crawlers that don't execute JS
const contactFallback = `
    <div id="root">
      <noscript>
        <main style="font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;color:#fff;background:#000;">
          <h1>Contact Zubair (ZASHLY)</h1>
          <p>Freelance React Developer &amp; UI/UX Designer based in Faisalabad, Pakistan.</p>
          <p><strong>Email:</strong> <a href="mailto:zashlycraft@gmail.com" style="color:#f7931e;">zashlycraft@gmail.com</a></p>
          <p><strong>Phone:</strong> +923294264963</p>
          <p><strong>GitHub:</strong> <a href="https://github.com/zashlyautomation-crypto/" style="color:#f7931e;">zashlyautomation-crypto</a></p>
          <p><a href="https://zubairkaportfolio.netlify.app/" style="color:#f7931e;">&larr; Back to Portfolio</a></p>
        </main>
      </noscript>
    </div>`

contactHtml = contactHtml.replace('<div id="root"></div>', contactFallback)

fs.writeFileSync(path.join(contactDir, 'index.html'), contactHtml, 'utf8')
console.log('[PASS] Generated dist/contact/index.html with route-specific metadata and noscript fallback')

// ── 2. Create dist/404.html ──────────────────────────────────────────────
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
      .box {
        max-width: 500px;
      }
      h1 {
        font-size: 6rem;
        margin: 0;
        color: #f7931e;
        line-height: 1;
      }
      h2 {
        font-size: 1.5rem;
        margin: 16px 0 8px;
        font-weight: 600;
      }
      p {
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.6;
        margin-bottom: 24px;
      }
      a {
        display: inline-block;
        background: #f7931e;
        color: #000000;
        padding: 12px 28px;
        border-radius: 9999px;
        text-decoration: none;
        font-weight: 600;
        transition: transform 0.2s, background 0.2s;
      }
      a:hover {
        background: #ffaa44;
        transform: scale(1.04);
      }
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
