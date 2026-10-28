import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSEO } from '@/hooks/useSEO'
import '@/styles/guides.css'

export const ComparisonGuidePage = () => {
  useSEO({
    title: 'Three.js & GSAP vs Spline 3D Performance | ZASHLY',
    description: 'An architectural benchmark comparing custom Three.js and GSAP against Spline 3D and generic web builders for web performance, SEO crawlability, and 60fps animations.',
    canonical: 'https://zubairkaportfolio.netlify.app/comparisons/threejs-vs-spline-performance/',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': 'Custom Three.js & GSAP vs Spline 3D & Generic Web Builders: Real Web Performance & SEO Benchmark',
    'description': 'Technical comparison of bespoke Three.js and GSAP implementations versus heavy 3D runtimes like Spline and no-code builders for modern websites.',
    'author': {
      '@type': 'Person',
      'name': 'Zubair',
      'alternateName': 'ZASHLY',
      'jobTitle': 'Freelance React & Three.js Developer',
      'url': 'https://zubairkaportfolio.netlify.app/'
    },
    'publisher': {
      '@type': 'Person',
      'name': 'Zubair (ZASHLY)',
      'url': 'https://zubairkaportfolio.netlify.app/'
    },
    'datePublished': '2026-10-27',
    'dateModified': '2026-10-28',
    'mainEntityOfPage': 'https://zubairkaportfolio.netlify.app/comparisons/threejs-vs-spline-performance'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Why is custom Three.js faster than Spline 3D for websites?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Custom Three.js code is tree-shaken, including only the exact geometries, shaders, and lighting needed for the scene (~200kB–350kB). In contrast, Spline embeds a generic runtime engine (~1.5MB–3.5MB) that drains mobile GPU memory and delays Largest Contentful Paint (LCP).'
        }
      },
      {
        '@type': 'Question',
        'name': 'Does 3D content hurt SEO rankings?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'When 3D is trapped inside canvas-only builders without semantic HTML, search crawlers cannot index the text. Custom Three.js architecture decouples visual canvas rendering from semantic DOM text, ensuring 100% crawlability for Googlebot and AI answer engines.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Why choose custom developer code over generic website builders?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Generic web builders generate bloated, unoptimized DOM trees, non-semantic CSS, and heavy third-party tracking scripts. Custom React 19 and Three.js development by Zubair (ZASHLY) delivers 60fps animations, sub-second load times, and superior Core Web Vitals.'
        }
      }
    ]
  }

  return (
    <div className="guide-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="guide-wrapper">
        <nav className="guide-back-nav" aria-label="Breadcrumb">
          <Link to="/" className="guide-back-btn">
            &larr; Back to Portfolio
          </Link>
        </nav>

        <header className="guide-header">
          <span className="guide-badge">Architecture &middot; 3D Performance &middot; SEO Comparison</span>
          <h1 className="guide-title">
            Custom Three.js &amp; GSAP vs. Spline 3D &amp; Generic Web Builders
          </h1>
          <p className="guide-subtitle">
            An empirical comparison of payload sizes, mobile GPU utilization, Core Web Vitals impact, and search engine discoverability.
          </p>
          <div className="guide-meta-row">
            <span className="guide-meta-item">
              Author: <strong>Zubair (ZASHLY)</strong> &middot; Creative Frontend Specialist
            </span>
            <span className="guide-meta-item">
              Location: <strong>Faisalabad, Pakistan</strong>
            </span>
            <span className="guide-meta-item">
              Updated: <strong>October 2026</strong>
            </span>
          </div>
        </header>

        <div className="guide-metrics-grid">
          <div className="guide-metric-card">
            <div className="guide-metric-value">80% Less</div>
            <div className="guide-metric-label">Bundle Weight (Three.js vs Spline)</div>
          </div>
          <div className="guide-metric-card">
            <div className="guide-metric-value">60 FPS</div>
            <div className="guide-metric-label">Mobile Frame Rate with GSAP</div>
          </div>
          <div className="guide-metric-card">
            <div className="guide-metric-value">100%</div>
            <div className="guide-metric-label">DOM Text Crawlability for SEO</div>
          </div>
        </div>

        <article className="guide-content">
          <div className="guide-callout">
            <strong>The Developer Dilemma:</strong> While no-code 3D tools like Spline make importing scenes quick, they often carry prohibitive performance taxes on real-world mobile devices. Custom Three.js development bridges the gap between cinematic visuals and Google PageSpeed perfection.
          </div>

          <h2>1. Payload Size &amp; Network Delivery</h2>
          <p>
            When embedding 3D graphics on the web, initial download weight determines your site's <strong>Largest Contentful Paint (LCP)</strong> and bounce rates:
          </p>
          <ul>
            <li>
              <strong>Spline Runtime &amp; Scene File:</strong> The generic Spline WebGL/WASM runtime typically weighs between 1.2MB and 2.5MB uncompressed, in addition to binary scene models (1MB–5MB). On cellular connections, this triggers multi-second delays before visitors see interactive content.
            </li>
            <li>
              <strong>Bespoke Three.js &amp; GLTF Optimization:</strong> By contrast, custom Three.js code is tree-shaken with Vite. Only the specific camera, renderer, and shader modules needed for the scene are bundled (~180kB–320kB gzipped). Meshes are compressed with Draco or Meshopt, reducing total asset transfer to a fraction of generic runtimes.
            </li>
          </ul>

          <h2>2. Head-to-Head Comparison Table</h2>
          <div className="guide-table-wrap">
            <table className="guide-table">
              <thead>
                <tr>
                  <th>Criteria</th>
                  <th>Spline 3D Embed</th>
                  <th>Generic No-Code Builders</th>
                  <th>Custom Three.js &amp; GSAP (ZASHLY)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Initial Runtime Footprint</strong></td>
                  <td>1.5MB – 3.5MB</td>
                  <td>800kB – 2.0MB (bloated CSS/JS)</td>
                  <td><strong>&lt; 350kB gzipped</strong></td>
                </tr>
                <tr>
                  <td><strong>Mobile Frame Rates</strong></td>
                  <td>Frequent drops to 25–40 FPS</td>
                  <td>Varies (heavy reflows)</td>
                  <td><strong>Locked 60 FPS</strong></td>
                </tr>
                <tr>
                  <td><strong>Text &amp; SEO Crawlability</strong></td>
                  <td>Baked into WebGL canvas (invisible)</td>
                  <td>Poor heading structure &amp; div soup</td>
                  <td><strong>100% Semantic HTML &amp; JSON-LD</strong></td>
                </tr>
                <tr>
                  <td><strong>Core Web Vitals Impact</strong></td>
                  <td>High INP &amp; delayed LCP</td>
                  <td>High CLS from unoptimized widgets</td>
                  <td><strong>Green Core Web Vitals (90+ Scores)</strong></td>
                </tr>
                <tr>
                  <td><strong>Tailored Interactivity</strong></td>
                  <td>Limited to tool presets</td>
                  <td>Strict template limitations</td>
                  <td><strong>Infinite creative freedom</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>3. SEO &amp; AEO / GEO Implications</h2>
          <p>
            A major hidden risk of purely canvas-based website builders is the <strong>Render Gap</strong>. When Googlebot, Perplexity, or ChatGPT crawlers ingest a page built with no-code 3D canvases, they cannot read text rendered inside WebGL textures.
          </p>
          <p>
            In Zubair's architectural approach (demonstrated in the <Link to="/" style={{ color: '#f7931e', textDecoration: 'underline' }}>ZASHLY portfolio</Link>):
          </p>
          <ol>
            <li><strong>Canvas as an Enhancement:</strong> The 3D canvas is layered as a hardware-accelerated ambient backdrop or interactive element.</li>
            <li><strong>Decoupled Semantic DOM:</strong> All headlines, service descriptions, project case studies, and FAQ items are standard, accessible HTML tags (<code>&lt;h1&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;button&gt;</code>) directly discoverable by search engines without waiting for WebGL initialization.</li>
            <li><strong>Linked Structured Data:</strong> Deep JSON-LD schema (Person, WebSite, FAQPage, BreadcrumbList) provides unambiguous entity context for AI answer engines.</li>
          </ol>

          <h2>4. Conclusion: When to Choose Which Architecture</h2>
          <p>
            For rapid internal prototypes or simple social graphics, tools like Spline are convenient. However, for <strong>brand-defining commercial portfolios, high-growth startup landing pages, and flagship e-commerce platforms</strong> where search rankings, mobile load speeds, and conversion rates matter, bespoke Three.js and GSAP engineering is decisively superior.
          </p>

          <section className="guide-faq-section">
            <h2>Frequently Asked Questions</h2>

            <div className="guide-faq-item">
              <h3 className="guide-faq-question">Why is custom Three.js faster than Spline 3D for websites?</h3>
              <p className="guide-faq-answer">
                Custom Three.js code only includes the exact math, lighting, and rendering components required for your specific design, keeping bundles under 350kB. Spline ships a monolithic runtime engine that consumes excess memory and stalls mobile processors.
              </p>
            </div>

            <div className="guide-faq-item">
              <h3 className="guide-faq-question">Does 3D content hurt SEO rankings?</h3>
              <p className="guide-faq-answer">
                Not if architected properly. By decoupling WebGL canvas visuals from clean semantic HTML text, search crawlers read 100% of your copy instantly while visitors enjoy immersive 60fps animations.
              </p>
            </div>

            <div className="guide-faq-item">
              <h3 className="guide-faq-question">Can Zubair integrate custom 3D into existing React or Next.js projects?</h3>
              <p className="guide-faq-answer">
                Yes. Zubair specializes in integrating Three.js, WebGL shaders, and GSAP animations directly into existing React 19 and Next.js applications with zero layout shift and minimal performance impact.
              </p>
            </div>
          </section>

          <div className="guide-cta-card">
            <h3 className="guide-cta-title">Want a High-Performance 3D Website That Actually Ranks?</h3>
            <p className="guide-cta-text">
              Let's create a bespoke interactive experience that wows your visitors and scores 100 on Google PageSpeed.
            </p>
            <Link to="/contact" className="guide-cta-btn">
              Get in Touch with Zubair &rarr;
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
export default ComparisonGuidePage
