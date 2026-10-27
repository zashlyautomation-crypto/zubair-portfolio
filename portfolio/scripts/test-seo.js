import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

console.log('=== RUNNING SEO & STRUCTURED DATA INTEGRITY TESTS ===\n')

let totalErrors = 0

// 1. Validate index.html JSON-LD
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
const schemaRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
let match
let schemaCount = 0
let schemaErrors = 0

while ((match = schemaRegex.exec(html)) !== null) {
  schemaCount++
  const raw = match[1].trim()
  try {
    const parsed = JSON.parse(raw)
    const type = parsed['@type'] || (parsed['@graph'] ? '@graph' : 'unknown')
    console.log(`[PASS] JSON-LD block #${schemaCount}: @type = ${type}`)
  } catch (err) {
    schemaErrors++
    totalErrors++
    console.error(`[FAIL] JSON-LD block #${schemaCount} has syntax error:`, err.message)
  }
}

console.log(`\nFound ${schemaCount} JSON-LD blocks, ${schemaErrors} errors.\n`)

// 2. Validate robots.txt
const robotsPath = path.join(root, 'public', 'robots.txt')
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8')
  const hasSitemap = robots.includes('Sitemap: https://zubairkaportfolio.netlify.app/sitemap.xml')
  const allowsAll = robots.includes('User-agent: *')
  console.log(`[${hasSitemap ? 'PASS' : 'WARN'}] robots.txt references Netlify sitemap: ${hasSitemap}`)
  console.log(`[${allowsAll ? 'PASS' : 'WARN'}] robots.txt permits User-agent *: ${allowsAll}`)
  if (!hasSitemap) totalErrors++
} else {
  totalErrors++
  console.error('[FAIL] robots.txt missing in public/')
}

// 3. Validate sitemap.xml
const sitemapPath = path.join(root, 'public', 'sitemap.xml')
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8')
  const hasUrlset = sitemap.includes('<urlset') && sitemap.includes('</urlset>')
  const locMatches = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])
  const hasFragments = locMatches.some(u => u.includes('#'))
  const allNetlify = locMatches.every(u => u.startsWith('https://zubairkaportfolio.netlify.app'))
  console.log(`[${hasUrlset ? 'PASS' : 'FAIL'}] sitemap.xml valid urlset structure`)
  console.log(`[${!hasFragments ? 'PASS' : 'FAIL'}] sitemap.xml free of invalid fragment (#) identifiers: ${!hasFragments}`)
  console.log(`[${allNetlify ? 'PASS' : 'FAIL'}] sitemap.xml all URLs match Netlify origin: ${allNetlify}`)
  console.log(`       URLs found: ${locMatches.join(', ')}`)
  if (!hasUrlset || hasFragments || !allNetlify) totalErrors++
} else {
  totalErrors++
  console.error('[FAIL] sitemap.xml missing in public/')
}

// 4. Validate llms.txt
const llmsPath = path.join(root, 'public', 'llms.txt')
if (fs.existsSync(llmsPath)) {
  const llms = fs.readFileSync(llmsPath, 'utf8')
  const hasNetlify = llms.includes('https://zubairkaportfolio.netlify.app/')
  console.log(`[${hasNetlify ? 'PASS' : 'FAIL'}] llms.txt exists and references Netlify URL (${llms.length} bytes)`)
  if (!hasNetlify) totalErrors++
} else {
  totalErrors++
  console.error('[FAIL] llms.txt missing in public/')
}

// 5. Check no legacy GitHub Pages URLs remain in public config or index.html
const oldOrigin = 'zashlyautomation-crypto.github.io/zubair-portfolio'
const legacyInHtml = html.includes(oldOrigin)
console.log(`[${!legacyInHtml ? 'PASS' : 'FAIL'}] index.html has no legacy GitHub Pages portfolio URLs`)
if (legacyInHtml) totalErrors++

// 6. Validate Netlify configuration
const redirectsPath = path.join(root, 'public', '_redirects')
const netlifyTomlPath = path.join(root, 'netlify.toml')
const hasRedirects = fs.existsSync(redirectsPath)
const hasToml = fs.existsSync(netlifyTomlPath)
console.log(`[${hasRedirects ? 'PASS' : 'FAIL'}] public/_redirects exists: ${hasRedirects}`)
console.log(`[${hasToml ? 'PASS' : 'FAIL'}] netlify.toml exists: ${hasToml}`)
if (!hasRedirects || !hasToml) totalErrors++

console.log(`\n=== INTEGRITY CHECKS COMPLETE: ${totalErrors === 0 ? 'ALL PASSED' : totalErrors + ' ERRORS'} ===`)
process.exit(totalErrors > 0 ? 1 : 0)
