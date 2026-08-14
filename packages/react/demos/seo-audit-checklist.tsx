import * as React from 'react'
import Story from '../../components/story/Story'
import { SeoAuditChecklist, type SeoCategory } from '@react-registry-blocks/seo-audit-checklist/SeoAuditChecklist'

const ecommerceCategories: SeoCategory[] = [
  {
    id: 'meta-tags',
    name: 'Title & Meta Description',
    icon: 'meta',
    score: 92,
    checks: [
      {
        id: 'title-length',
        title: 'Title Tag Length & Structure',
        description: 'Page title is 54 characters with high conversion keyword intent (Product name + Brand).',
        status: 'pass',
        value: 'Minimalist Mechanical Keyboard Pro | TechStore Global',
        tag: '54 / 60 chars',
      },
      {
        id: 'meta-desc',
        title: 'Meta Description Length & CTA',
        description: '148 characters highlighting pricing ($149), free global shipping, and warranty terms.',
        status: 'pass',
        value:
          'Buy the Minimalist Mechanical Keyboard Pro with hot-swappable switches, wireless Bluetooth 5.2, and CNC aluminum chassis. Free shipping on orders $99+.',
        tag: '148 / 160 chars',
      },
      {
        id: 'canonical-url',
        title: 'Canonical URL Tag',
        description: 'Canonical tag points to primary SKU without trailing tracking query parameters.',
        status: 'pass',
        value: '<link rel="canonical" href="https://techstore.com/products/mechanical-keyboard-pro" />',
        tag: 'Present',
      },
    ],
  },
  {
    id: 'headings',
    name: 'Heading Hierarchy & Structure',
    icon: 'headings',
    score: 100,
    checks: [
      {
        id: 'h1-presence',
        title: 'Single Primary H1 Tag',
        description: 'Product title rendered as primary H1 with structured review markup.',
        status: 'pass',
        value: '<h1>Minimalist Mechanical Keyboard Pro</h1>',
        tag: '1 H1 Tag',
      },
      {
        id: 'h2-distribution',
        title: 'H2 Specification Sections',
        description: '5 H2 tags (Specifications, Reviews, In the Box, Warranty, FAQ).',
        status: 'pass',
        value: '5 H2 tags · Clean hierarchy',
        tag: '5 H2 Tags',
      },
    ],
  },
  {
    id: 'opengraph',
    name: 'OpenGraph & Social Share Cards',
    icon: 'opengraph',
    score: 100,
    checks: [
      {
        id: 'og-image',
        title: 'OpenGraph Product Hero Banner',
        description: 'High resolution 1200x630px lifestyle product image with transparent background option.',
        status: 'pass',
        value: 'https://techstore.com/cdn/products/keyboard-og.jpg',
        tag: '1200x630 px',
      },
    ],
  },
  {
    id: 'technical',
    name: 'Performance, Images & Technical SEO',
    icon: 'technical',
    score: 75,
    checks: [
      {
        id: 'image-alt-tags',
        title: 'Image Alt Attributes',
        description: '2 of 16 gallery images are missing descriptive alt text attributes.',
        status: 'warning',
        value: '14 / 16 images with alt text (87.5%)',
        recommendation: 'Add descriptive alt text to gallery thumbnail 3 and 4 to boost Google Images visibility.',
        tag: '14 / 16 Pass',
      },
      {
        id: 'schema-markup',
        title: 'Product Structured Data (Schema.org)',
        description: 'Valid Product schema found with aggregateRating and offer price specifications.',
        status: 'pass',
        value: 'schema.org/Product · price: $149 · inStock: true',
        tag: 'Rich Snippet Valid',
      },
      {
        id: 'ssl-security',
        title: 'SSL / HTTPS & Checkout Security',
        description: 'TLS 1.3 encryption with strict transport security active on payment endpoints.',
        status: 'pass',
        value: 'PCI-DSS Compliant TLS 1.3',
        tag: 'Secure',
      },
    ],
  },
]

const pristineBlogCategories: SeoCategory[] = [
  {
    id: 'meta-tags',
    name: 'Title & Meta Description',
    icon: 'meta',
    score: 100,
    checks: [
      {
        id: 'title-length',
        title: 'Article Title Tag',
        description: '56 characters with keyword prominence and year freshness identifier.',
        status: 'pass',
        value: 'Migrating to Tailwind CSS v4 and OKLCH Tokens (2026 Guide)',
        tag: '56 / 60 chars',
      },
      {
        id: 'meta-desc',
        title: 'Meta Description',
        description: '154 characters summarizing the migration steps, theme bindings, and backwards compatibility.',
        status: 'pass',
        value:
          'Learn how to upgrade your UI library to Tailwind CSS v4 with OKLCH dynamic color palettes, @theme inline directives, and zero-config CSS-first architecture.',
        tag: '154 / 160 chars',
      },
    ],
  },
  {
    id: 'headings',
    name: 'Heading Hierarchy & Structure',
    icon: 'headings',
    score: 100,
    checks: [
      {
        id: 'h1-presence',
        title: 'H1 Article Headline',
        description: 'Exactly 1 H1 headline with author and published timestamp metadata.',
        status: 'pass',
        value: '<h1>Complete Guide: Migrating to Tailwind CSS v4</h1>',
        tag: '1 H1 Tag',
      },
      {
        id: 'h2-distribution',
        title: 'H2 Section Headings',
        description: '8 H2 steps mapping the tutorial sequentially.',
        status: 'pass',
        value: '8 H2 steps · 0 skipped levels',
        tag: '8 H2 Tags',
      },
      {
        id: 'h3-nesting',
        title: 'H3 Code Subsections',
        description: '16 H3 subsections for code examples and framework flags.',
        status: 'pass',
        value: '16 H3 subsections',
        tag: '16 H3 Tags',
      },
    ],
  },
  {
    id: 'opengraph',
    name: 'OpenGraph & Social Share Cards',
    icon: 'opengraph',
    score: 100,
    checks: [
      {
        id: 'og-image',
        title: 'OpenGraph Article Banner',
        description: '1200x630px high-contrast cover image with title typography and author badge.',
        status: 'pass',
        value: 'https://uipkge.dev/blog/og-tailwind-v4.png',
        tag: '1200x630 px',
      },
      {
        id: 'twitter-card',
        title: 'Twitter Card Directives',
        description: 'summary_large_image card type with @uipkge creator attribution.',
        status: 'pass',
        value: 'twitter:card = summary_large_image',
        tag: 'Large Image',
      },
    ],
  },
  {
    id: 'technical',
    name: 'Performance, Images & Technical SEO',
    icon: 'technical',
    score: 100,
    checks: [
      {
        id: 'tech-article-schema',
        title: 'TechArticle Schema.org Markup',
        description: 'Complete JSON-LD TechArticle schema with author, datePublished, and codeRepository.',
        status: 'pass',
        value: 'schema.org/TechArticle · Author: UIPKGE Team',
        tag: 'TechArticle Valid',
      },
      {
        id: 'image-alt-tags',
        title: 'Code Diagram Alt Text',
        description: 'All 8 architectural diagrams include detailed technical alt descriptions.',
        status: 'pass',
        value: '8 / 8 diagrams with descriptive alt text',
        tag: '8 / 8 Pass',
      },
    ],
  },
]

const criticalIssueCategories: SeoCategory[] = [
  {
    id: 'meta-tags',
    name: 'Title & Meta Description',
    icon: 'meta',
    score: 55,
    checks: [
      {
        id: 'title-length',
        title: 'Title Tag Missing or Truncated',
        description: 'Page title is 86 characters and gets truncated with "..." in Google SERPs.',
        status: 'warning',
        value:
          'Welcome to Our New Website - We Build Software and Digital Experiences for Enterprise Clients Worldwide',
        recommendation: 'Shorten title to under 60 characters to prevent SERP ellipsis truncation.',
        tag: '86 / 60 chars',
      },
      {
        id: 'meta-desc',
        title: 'Meta Description Missing',
        description: 'No meta description tag found in <head>. Google is dynamically generating snippet text.',
        status: 'fail',
        value: 'Missing <meta name="description">',
        recommendation: 'Add a 150-character meta description targeting high-intent keywords.',
        tag: 'Missing Tag',
      },
    ],
  },
  {
    id: 'headings',
    name: 'Heading Hierarchy & Structure',
    icon: 'headings',
    score: 60,
    checks: [
      {
        id: 'h1-presence',
        title: 'Multiple H1 Tags Detected',
        description: '3 conflicting H1 tags found on the page, confusing search engine topic clustering.',
        status: 'fail',
        value: '3 H1 tags found · Topic dilution risk',
        recommendation: 'Consolidate to a single definitive H1 tag for the primary page topic.',
        tag: '3 H1 Tags',
      },
    ],
  },
  {
    id: 'technical',
    name: 'Performance, Images & Technical SEO',
    icon: 'technical',
    score: 50,
    checks: [
      {
        id: 'broken-links',
        title: 'Broken Internal Links (404)',
        description: '4 internal links return 404 Not Found error responses during crawler traversal.',
        status: 'fail',
        value: '4 broken links detected (/pricing-old, /team-2024)',
        recommendation: 'Update dead hyperlinks or configure 301 permanent redirects to active routes.',
        tag: '4 Dead Links',
      },
      {
        id: 'image-alt-tags',
        title: 'Missing Image Alt Attributes',
        description: '18 of 22 images lack alt attributes, failing accessibility and image indexing checks.',
        status: 'fail',
        value: '4 / 22 images with alt text (18%)',
        recommendation: 'Provide descriptive alt tags for all visual image assets.',
        tag: '18 Missing',
      },
    ],
  },
]

export default function SeoAuditChecklistDemo() {
  return (
    <>
      <Story
        title="Healthy On-Page Audit (Score 94)"
        description="Standard comprehensive SEO audit report for https://uipkge.dev/vue/components with 94/100 score, desktop & mobile Google SERP simulator, Core Web Vitals breakdown, and categorized verification accordions."
      >
        <SeoAuditChecklist />
      </Story>

      <Story
        title="E-Commerce Product Page Audit"
        description="E-commerce SKU analysis with Product structured data, stock availability metadata, and image gallery alt tag recommendations."
      >
        <SeoAuditChecklist
          url="https://techstore.com/products/mechanical-keyboard-pro"
          score={88}
          lastAudited="Audit completed in 520ms · Live crawl"
          titleTag="Minimalist Mechanical Keyboard Pro | TechStore Global"
          metaDescription="Buy the Minimalist Mechanical Keyboard Pro with hot-swappable switches, wireless Bluetooth 5.2, and CNC aluminum chassis. Free shipping on orders $99+."
          h1Tag="Minimalist Mechanical Keyboard Pro"
          categories={ecommerceCategories}
        />
      </Story>

      <Story
        title="Pristine Technical Article (Score 98)"
        description="Deep content audit for a developer blog tutorial featuring 100% TechArticle schema validation, clean H1/H2/H3 nesting, and social card tags."
      >
        <SeoAuditChecklist
          url="https://uipkge.dev/blog/tailwind-v4-guide"
          score={98}
          lastAudited="Audit completed in 410ms · Verified"
          titleTag="Migrating to Tailwind CSS v4 and OKLCH Tokens (2026 Guide)"
          metaDescription="Learn how to upgrade your UI library to Tailwind CSS v4 with OKLCH dynamic color palettes, @theme inline directives, and zero-config CSS-first architecture."
          h1Tag="Complete Guide: Migrating to Tailwind CSS v4"
          categories={pristineBlogCategories}
        />
      </Story>

      <Story
        title="Audit With Critical Issues (Score 64)"
        description="Report showing actionable warnings and critical failures: multiple H1 tags, missing meta description, dead links, and missing image alt text."
      >
        <SeoAuditChecklist
          url="https://example-client.com/legacy-landing"
          score={64}
          lastAudited="Audit completed in 890ms · 4 Critical Issues"
          titleTag="Welcome to Our New Website - We Build Software and Digital Experiences for Enterprise Clients Worldwide"
          metaDescription=""
          h1Tag="Multiple H1 Headings Detected"
          categories={criticalIssueCategories}
        />
      </Story>
    </>
  )
}
