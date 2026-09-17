<script setup lang="ts">
import { ref, computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  ShieldCheck,
  Copy,
  Check,
  Download,
  Building2,
  Mail,
  Cookie,
  CreditCard,
  BarChart3,
  Bug,
  Server,
  Scale,
  Sparkles,
  Code2,
  FileCode,
  Sliders,
  CheckCircle2,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

interface Props {
  class?: HTMLAttributes['class']
  initialCompanyName?: string
  initialContactEmail?: string
  initialWebsiteUrl?: string
  initialEffectiveDate?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialCompanyName: 'UIPKGE Technologies Inc.',
  initialContactEmail: 'privacy@uipkge.dev',
  initialWebsiteUrl: 'https://uipkge.dev',
  initialEffectiveDate: 'August 21, 2026',
})

// Configuration State
const companyName = ref(props.initialCompanyName)
const contactEmail = ref(props.initialContactEmail)
const websiteUrl = ref(props.initialWebsiteUrl)
const effectiveDate = ref(props.initialEffectiveDate)

// Jurisdictions & Legal Regulations
const jurisdictions = ref({
  gdpr: true,
  ccpa: true,
  pipeda: false,
  lgpd: false,
})

// Third-Party Data Processors
const processors = ref({
  ga4: true,
  posthog: false,
  plausible: true,
  stripe: true,
  paddle: false,
  sentry: true,
  datadog: false,
  cloudflare: true,
  aws: true,
})

// Cookie Tracking Switch
const cookieTracking = ref(true)

// Copy feedback states
const copiedMd = ref(false)
const copiedHtml = ref(false)

interface ProcessorMeta {
  id: keyof typeof processors.value
  name: string
  category: 'Analytics' | 'Payment' | 'Telemetry' | 'Infrastructure'
  description: string
  purpose: string
  dataCollected: string
  location: string
}

const ALL_PROCESSORS: ProcessorMeta[] = [
  {
    id: 'ga4',
    name: 'Google Analytics 4',
    category: 'Analytics',
    description: 'Traffic telemetry, session counts, anonymized IP',
    purpose: 'Audience engagement & web traffic analytics',
    dataCollected: 'Anonymized IP, browser type, referral URLs, screen resolution',
    location: 'United States (Google LLC)',
  },
  {
    id: 'posthog',
    name: 'PostHog Cloud',
    category: 'Analytics',
    description: 'Product telemetry, session recording, feature flags',
    purpose: 'User journey tracking and product telemetry',
    dataCollected: 'Interaction events, UI clickstreams, feature flag evaluation data',
    location: 'United States / EU (PostHog, Inc.)',
  },
  {
    id: 'plausible',
    name: 'Plausible Analytics',
    category: 'Analytics',
    description: 'Privacy-first cookieless analytics',
    purpose: 'Aggregated website traffic metrics without personal identification',
    dataCollected: 'Page views, referrers, operating system name (no persistent cookies)',
    location: 'European Union (Estonia)',
  },
  {
    id: 'stripe',
    name: 'Stripe, Inc.',
    category: 'Payment',
    description: 'PCI-DSS Level 1 tokenized billing and transactions',
    purpose: 'Payment gateway execution, fraud screening, and subscription billing',
    dataCollected: 'Card token, last 4 digits, billing address, customer ID',
    location: 'United States / Global (Stripe, Inc.)',
  },
  {
    id: 'paddle',
    name: 'Paddle',
    category: 'Payment',
    description: 'Merchant of record, checkout & tax compliance',
    purpose: 'International checkout, VAT/sales tax management, and receipt delivery',
    dataCollected: 'Customer billing details, invoice records, transaction totals',
    location: 'United Kingdom / Global (Paddle.com Market Ltd.)',
  },
  {
    id: 'sentry',
    name: 'Sentry',
    category: 'Telemetry',
    description: 'Application exceptions, crash stack traces, release health',
    purpose: 'Crash diagnosis, real-time error telemetry, and performance tracking',
    dataCollected: 'Error stack traces, browser environment, client runtime exceptions',
    location: 'United States (Functional Software, Inc.)',
  },
  {
    id: 'datadog',
    name: 'Datadog',
    category: 'Telemetry',
    description: 'APM performance telemetry, log indexing',
    purpose: 'Edge latency monitoring, API endpoint tracing, system uptime auditing',
    dataCollected: 'Server request metrics, response latencies, infrastructure logs',
    location: 'United States (Datadog, Inc.)',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Pages',
    category: 'Infrastructure',
    description: 'Global CDN routing, edge caching, and DDoS mitigation',
    purpose: 'Edge website delivery, SSL/TLS encryption, and automated bot mitigation',
    dataCollected: 'Connecting IP address (for DDoS protection), HTTP request headers',
    location: 'Global Anycast Edge Network (Cloudflare, Inc.)',
  },
  {
    id: 'aws',
    name: 'AWS S3',
    category: 'Infrastructure',
    description: 'Encrypted cloud object storage for assets and files',
    purpose: 'Scalable cloud object storage for media assets and encrypted backups',
    dataCollected: 'Uploaded user media assets, encrypted data archives',
    location: 'United States & EU Regions (Amazon Web Services, Inc.)',
  },
]

const activeProcessorsList = computed(() => {
  return ALL_PROCESSORS.filter((p) => processors.value[p.id])
})

const activeJurisdictionsCount = computed(() => {
  let count = 0
  if (jurisdictions.value.gdpr) count++
  if (jurisdictions.value.ccpa) count++
  if (jurisdictions.value.pipeda) count++
  if (jurisdictions.value.lgpd) count++
  return count
})

function generateMarkdown(): string {
  const company = companyName.value.trim() || 'Our Company'
  const email = contactEmail.value.trim() || 'privacy@example.com'
  const website = websiteUrl.value.trim() || 'https://example.com'
  const date = effectiveDate.value.trim() || 'August 21, 2026'

  let md = `# Privacy Policy for ${company}\n\n`
  md += `**Effective Date:** ${date}  \n`
  md += `**Last Updated:** ${date}  \n`
  md += `**Website:** [${website}](${website})\n\n`
  md += `---\n\n`

  md += `## 1. Introduction & Overview\n\n`
  md += `${company} ("we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy details our practices concerning the collection, use, storage, and disclosure of personal data when you visit [${website}](${website}) (the "Website") or use our services.\n\n`
  md += `By accessing or using our Website, you consent to the data collection and processing methods outlined in this policy.\n\n`

  md += `## 2. Personal Information We Collect\n\n`
  md += `We collect information necessary to operate our platform, maintain security, and fulfill legal requirements:\n\n`
  md += `- **Direct Inquiries & Communication:** When you reach out to us at ${email}, we retain your contact details and message contents.\n`
  if (processors.value.stripe || processors.value.paddle) {
    md += `- **Payment & Billing Data:** For paid services, payment transactions are processed securely through PCI-DSS Level 1 compliant processors. We do not store complete raw credit card numbers on our servers.\n`
  }
  if (
    processors.value.ga4 ||
    processors.value.posthog ||
    processors.value.plausible ||
    processors.value.sentry ||
    processors.value.datadog
  ) {
    md += `- **Telemetry & Usage Information:** Diagnostic telemetry, operating system details, browser version, and aggregated usage metrics are collected to maintain service reliability.\n`
  }
  md += `\n`

  md += `## 3. Third-Party Sub-Processors & Data Sharing\n\n`
  if (activeProcessorsList.value.length > 0) {
    md += `We partner with trusted third-party sub-processors to power our application infrastructure. Each partner operates under a Data Processing Agreement (DPA) adhering to standard contractual clauses:\n\n`
    md += `| Sub-Processor | Category | Purpose | Processing Location |\n`
    md += `| :--- | :--- | :--- | :--- |\n`
    for (const p of activeProcessorsList.value) {
      md += `| **${p.name}** | ${p.category} | ${p.purpose} | ${p.location} |\n`
    }
    md += `\n`
  } else {
    md += `We do not share your personal information with external commercial sub-processors.\n\n`
  }

  md += `## 4. Cookies & Tracking Technologies\n\n`
  if (cookieTracking.value) {
    md += `We use cookies and equivalent browser storage mechanisms to ensure core site navigation and analyze traffic:\n\n`
    md += `- **Strictly Necessary Cookies:** Essential for page routing, authentication tokens, and user preference persistence.\n`
    if (processors.value.ga4 || processors.value.posthog) {
      md += `- **Performance & Analytics Cookies:** Help us analyze traffic patterns to optimize layout performance.\n`
    }
    md += `\nYou may configure your browser to reject cookies. However, disabling certain necessary cookies may affect website functionality.\n\n`
  } else {
    md += `**Zero-Tracking Cookies Guarantee:** This website operates on a privacy-first basis and does not place tracking cookies, advertising beacons, or third-party marketing identifiers on your device.\n\n`
  }

  md += `## 5. Compliance & Statutory Privacy Rights\n\n`
  if (jurisdictions.value.gdpr) {
    md += `### 5.1 European Union (GDPR - Regulation EU 2016/679)\n\n`
    md += `If you reside in the European Economic Area (EEA), you possess specific rights under the GDPR:\n`
    md += `- **Right of Access (Art. 15):** Request confirmation and a portable copy of personal records held.\n`
    md += `- **Right to Rectification (Art. 16):** Update or rectify inaccurate or incomplete personal records.\n`
    md += `- **Right to Erasure (Art. 17):** Request permanent erasure of personal data under statutory conditions.\n`
    md += `- **Right to Data Portability (Art. 20):** Receive your personal data in a structured, machine-readable format.\n`
    md += `- **Supervisory Authority:** You have the statutory right to lodge a complaint with an EU Data Protection Authority.\n\n`
  }
  if (jurisdictions.value.ccpa) {
    md += `### 5.2 California Privacy Rights (CCPA / CPRA)\n\n`
    md += `Under the California Consumer Privacy Act and California Privacy Rights Act, California consumers have the right to:\n`
    md += `- **Know and Access:** Request details regarding personal data categories collected over the past 12 months.\n`
    md += `- **Delete Personal Information:** Request deletion of personal data collected directly from you.\n`
    md += `- **Do Not Sell or Share My Information:** ${company} does not sell, rent, or trade your personal data to third-party brokers.\n`
    md += `- **Non-Discrimination:** You will not receive discriminatory pricing or service degradation for exercising your privacy rights.\n\n`
  }
  if (jurisdictions.value.pipeda) {
    md += `### 5.3 Canadian Privacy Rights (PIPEDA)\n\n`
    md += `In compliance with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA), we adhere to the 10 Fair Information Principles ensuring accountability and purpose limitation. Complaints may be directed to the Office of the Privacy Commissioner of Canada (OPC).\n\n`
  }
  if (jurisdictions.value.lgpd) {
    md += `### 5.4 Brazilian Privacy Rights (LGPD - Law No. 13.709/2018)\n\n`
    md += `Under the Brazilian General Data Protection Law (LGPD), Brazilian data subjects may request confirmation of processing, anonymization of non-essential records, and revocation of consent. Oversight is provided by the ANPD.\n\n`
  }
  if (
    !jurisdictions.value.gdpr &&
    !jurisdictions.value.ccpa &&
    !jurisdictions.value.pipeda &&
    !jurisdictions.value.lgpd
  ) {
    md += `We honor international data privacy best practices. You may request access to, correction of, or deletion of your personal records at any time.\n\n`
  }

  md += `## 6. Data Security & Storage\n\n`
  md += `We implement defense-in-depth technical safeguards including TLS 1.3 encryption for data in transit, AES-256 encryption for data at rest, and strict role-based access control (RBAC). Data is retained only for the duration required to fulfill contractual and legal compliance duties.\n\n`

  md += `## 7. Contact Information & Privacy Inquiries\n\n`
  md += `If you have questions, inquiries, or wish to exercise your statutory rights, contact our Data Protection representative:\n\n`
  md += `- **Entity:** ${company}\n`
  md += `- **Privacy Email:** [${email}](mailto:${email})\n`
  md += `- **Website:** [${website}](${website})\n`

  return md
}

function generateHtml(): string {
  const company = companyName.value.trim() || 'Our Company'
  const email = contactEmail.value.trim() || 'privacy@example.com'
  const website = websiteUrl.value.trim() || 'https://example.com'
  const date = effectiveDate.value.trim() || 'August 21, 2026'

  let html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <title>Privacy Policy - ${company}</title>\n  <style>\n    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1e293b; }\n    h1 { font-size: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }\n    h2 { font-size: 1.35rem; margin-top: 2rem; }\n    h3 { font-size: 1.1rem; }\n    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 0.9rem; }\n    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }\n    th { background: #f8fafc; }\n    .meta { color: #64748b; font-size: 0.9rem; margin-bottom: 24px; }\n    a { color: #2563eb; text-decoration: underline; }\n  </style>\n</head>\n<body>\n`
  html += `  <h1>Privacy Policy</h1>\n`
  html += `  <div class="meta">\n`
  html += `    <strong>Effective Date:</strong> ${date} &bull; <strong>Organization:</strong> ${company} &bull; <strong>Website:</strong> <a href="${website}">${website}</a>\n`
  html += `  </div>\n\n`

  html += `  <h2>1. Introduction &amp; Overview</h2>\n`
  html += `  <p>${company} ("we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy details our practices concerning the collection, use, storage, and disclosure of personal data when you visit <a href="${website}">${website}</a> (the "Website") or use our services.</p>\n\n`

  html += `  <h2>2. Personal Information We Collect</h2>\n`
  html += `  <p>We collect information necessary to operate our platform, maintain security, and fulfill legal requirements:</p>\n`
  html += `  <ul>\n`
  html += `    <li><strong>Direct Inquiries &amp; Communication:</strong> When you reach out to us at ${email}, we retain your contact details and message records.</li>\n`
  if (processors.value.stripe || processors.value.paddle) {
    html += `    <li><strong>Payment &amp; Billing Data:</strong> Payment transactions are processed securely through PCI-DSS Level 1 compliant processors. Complete raw credit card numbers are never stored on our servers.</li>\n`
  }
  if (
    processors.value.ga4 ||
    processors.value.posthog ||
    processors.value.plausible ||
    processors.value.sentry ||
    processors.value.datadog
  ) {
    html += `    <li><strong>Telemetry &amp; Usage Information:</strong> Diagnostic telemetry, operating system details, browser version, and aggregated usage metrics are collected to maintain service reliability.</li>\n`
  }
  html += `  </ul>\n\n`

  html += `  <h2>3. Third-Party Sub-Processors &amp; Data Sharing</h2>\n`
  if (activeProcessorsList.value.length > 0) {
    html += `  <p>We partner with trusted third-party sub-processors to power our application infrastructure under strict Data Processing Agreements (DPAs):</p>\n`
    html += `  <table>\n    <thead>\n      <tr>\n        <th>Sub-Processor</th>\n        <th>Category</th>\n        <th>Purpose</th>\n        <th>Processing Location</th>\n      </tr>\n    </thead>\n    <tbody>\n`
    for (const p of activeProcessorsList.value) {
      html += `      <tr>\n        <td><strong>${p.name}</strong></td>\n        <td>${p.category}</td>\n        <td>${p.purpose}</td>\n        <td>${p.location}</td>\n      </tr>\n`
    }
    html += `    </tbody>\n  </table>\n\n`
  } else {
    html += `  <p>We do not share your personal information with external commercial sub-processors.</p>\n\n`
  }

  html += `  <h2>4. Cookies &amp; Tracking Technologies</h2>\n`
  if (cookieTracking.value) {
    html += `  <p>We use cookies and equivalent browser storage mechanisms to ensure core site navigation and analyze traffic:</p>\n`
    html += `  <ul>\n    <li><strong>Strictly Necessary Cookies:</strong> Essential for page routing, authentication tokens, and user preference persistence.</li>\n`
    if (processors.value.ga4 || processors.value.posthog) {
      html += `    <li><strong>Performance &amp; Analytics Cookies:</strong> Help us analyze traffic patterns to optimize layout performance.</li>\n`
    }
    html += `  </ul>\n`
    html += `  <p>You may configure your browser to reject cookies. However, disabling certain necessary cookies may affect website functionality.</p>\n\n`
  } else {
    html += `  <p><strong>Zero-Tracking Cookies Guarantee:</strong> This website operates on a privacy-first basis and does not place tracking cookies, advertising beacons, or third-party marketing identifiers on your device.</p>\n\n`
  }

  html += `  <h2>5. Compliance &amp; Statutory Privacy Rights</h2>\n`
  if (jurisdictions.value.gdpr) {
    html += `  <h3>5.1 European Union (GDPR - Regulation EU 2016/679)</h3>\n`
    html += `  <p>If you reside in the European Economic Area (EEA), you possess rights under the GDPR including Right of Access (Art. 15), Right to Rectification (Art. 16), Right to Erasure (Art. 17), and Right to Data Portability (Art. 20). You may also lodge a complaint with your local EU Data Protection Authority.</p>\n`
  }
  if (jurisdictions.value.ccpa) {
    html += `  <h3>5.2 California Privacy Rights (CCPA / CPRA)</h3>\n`
    html += `  <p>Under the California Consumer Privacy Act (CCPA/CPRA), California residents may request details regarding personal data collected, request erasure of personal data, and are guaranteed that ${company} does not sell personal data to third parties.</p>\n`
  }
  if (jurisdictions.value.pipeda) {
    html += `  <h3>5.3 Canadian Privacy Rights (PIPEDA)</h3>\n`
    html += `  <p>In compliance with Canada's PIPEDA, we adhere to the 10 Fair Information Principles ensuring accountability, consent, and purpose limitation.</p>\n`
  }
  if (jurisdictions.value.lgpd) {
    html += `  <h3>5.4 Brazilian Privacy Rights (LGPD)</h3>\n`
    html += `  <p>Under the Brazilian General Data Protection Law (LGPD), Brazilian data subjects may request confirmation of processing, anonymization of non-essential records, and revocation of consent.</p>\n`
  }
  if (
    !jurisdictions.value.gdpr &&
    !jurisdictions.value.ccpa &&
    !jurisdictions.value.pipeda &&
    !jurisdictions.value.lgpd
  ) {
    html += `  <p>We honor international data privacy best practices. You may request access to, correction of, or deletion of your personal records at any time.</p>\n`
  }

  html += `\n  <h2>6. Data Security &amp; Storage</h2>\n`
  html += `  <p>We implement defense-in-depth technical safeguards including TLS 1.3 encryption for data in transit, AES-256 encryption for data at rest, and strict role-based access control (RBAC).</p>\n\n`

  html += `  <h2>7. Contact Information &amp; Privacy Inquiries</h2>\n`
  html += `  <p>For any questions or statutory inquiries, contact our Data Protection team at <a href="mailto:${email}">${email}</a>.</p>\n`

  html += `</body>\n</html>`
  return html
}

function downloadPolicy(format: 'md' | 'html') {
  const content = format === 'md' ? generateMarkdown() : generateHtml()
  const mimeType = format === 'md' ? 'text/markdown;charset=utf-8' : 'text/html;charset=utf-8'
  const ext = format === 'md' ? 'md' : 'html'
  const safeName = (companyName.value.trim() || 'uipkge')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const filename = `${safeName}-privacy-policy.${ext}`

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

async function copyPolicy(format: 'md' | 'html') {
  const content = format === 'md' ? generateMarkdown() : generateHtml()
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(content)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = content
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    if (format === 'md') {
      copiedMd.value = true
      setTimeout(() => {
        copiedMd.value = false
      }, 2000)
    } else {
      copiedHtml.value = true
      setTimeout(() => {
        copiedHtml.value = false
      }, 2000)
    }
  } catch (err) {
    console.error('Failed to copy policy:', err)
  }
}
</script>

<template>
  <div data-slot="privacy-policy-generator" :class="cn('mx-auto w-full max-w-7xl space-y-6', props.class)">
    <!-- Header Section -->
    <div class="border-border flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-2.5">
          <div
            class="bg-primary/10 text-primary border-primary/20 flex size-8 items-center justify-center rounded-md border"
          >
            <ShieldCheck class="size-4" aria-hidden="true" />
          </div>
          <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
            Website Privacy Policy &amp; Compliance Generator
          </h1>
          <Badge variant="outline" class="gap-1 px-2 py-0.5 font-mono text-xs">
            <Scale class="size-3" aria-hidden="true" />
            {{ activeJurisdictionsCount }} Jurisdictions
          </Badge>
        </div>
        <p class="text-muted-foreground text-xs sm:text-sm">
          Generate compliant privacy disclosures tailored to your tech stack and analytics tools.
        </p>
      </div>

      <!-- Quick Export Actions in Header -->
      <div class="flex flex-wrap items-center gap-2">
        <Button
          aria-label="Download attachment"
          variant="outline"
          size="sm"
          class="gap-1.5 text-xs"
          @click="downloadPolicy('md')"
        >
          <Download class="size-3.5" aria-hidden="true" />
          <span>Export (.md)</span>
        </Button>
        <Button size="sm" class="gap-1.5 text-xs font-semibold" @click="downloadPolicy('html')">
          <FileCode class="size-3.5" aria-hidden="true" />
          <span>Export (.html)</span>
        </Button>
      </div>
    </div>

    <!-- 2-Column Builder Workspace -->
    <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      <!-- Left Column: Policy Configuration Sidebar (40% / 5 cols) -->
      <div class="space-y-6 lg:col-span-5">
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Sliders class="text-primary size-4" aria-hidden="true" />
                <CardTitle class="text-base font-semibold">Policy Configuration</CardTitle>
              </div>
              <Badge variant="secondary" class="text-xs"> {{ activeProcessorsList.length }} Sub-Processors </Badge>
            </div>
            <CardDescription class="text-xs">
              Configure company identity, applicable legal regulations, and active data processors.
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-6">
            <!-- 1. Organization & Contact Details -->
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <Building2 class="text-muted-foreground size-4" aria-hidden="true" />
                <span class="text-foreground text-xs font-semibold tracking-wider uppercase">
                  Entity &amp; Contact Information
                </span>
              </div>

              <div class="space-y-3">
                <div class="space-y-1.5">
                  <label for="company-name" class="text-foreground text-xs font-medium">
                    Company / App Name <span class="text-destructive">*</span>
                  </label>
                  <Input
                    id="company-name"
                    v-model="companyName"
                    placeholder="e.g. UIPKGE Technologies Inc."
                    size="middle"
                  />
                </div>

                <div class="space-y-1.5">
                  <label for="contact-email" class="text-foreground text-xs font-medium">
                    Contact &amp; DPO Email <span class="text-destructive">*</span>
                  </label>
                  <Input
                    id="contact-email"
                    v-model="contactEmail"
                    type="email"
                    placeholder="e.g. privacy@uipkge.dev"
                    size="middle"
                  />
                </div>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div class="space-y-1.5">
                    <label for="website-url" class="text-foreground text-xs font-medium"> Website URL </label>
                    <Input id="website-url" v-model="websiteUrl" placeholder="https://uipkge.dev" size="middle" />
                  </div>
                  <div class="space-y-1.5">
                    <label for="effective-date" class="text-foreground text-xs font-medium"> Effective Date </label>
                    <Input id="effective-date" v-model="effectiveDate" placeholder="August 21, 2026" size="middle" />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <!-- 2. Jurisdiction & Legal Regulations -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Scale class="text-muted-foreground size-4" aria-hidden="true" />
                  <span class="text-foreground text-xs font-semibold tracking-wider uppercase">
                    Jurisdiction &amp; Regulations
                  </span>
                </div>
                <span class="text-muted-foreground text-xs">{{ activeJurisdictionsCount }} selected</span>
              </div>
              <p class="text-muted-foreground text-xs">
                Select applicable privacy frameworks to automatically insert required consumer rights clauses.
              </p>

              <div class="space-y-2.5 pt-1">
                <!-- GDPR -->
                <div
                  class="border-border bg-muted/20 hover:bg-muted/40 flex items-start gap-3 rounded-lg border p-3 transition-colors"
                >
                  <Checkbox id="jur-gdpr" v-model="jurisdictions.gdpr" class="mt-0.5" />
                  <div class="space-y-0.5">
                    <label for="jur-gdpr" class="text-foreground cursor-pointer text-xs font-semibold select-none">
                      GDPR (EU)
                    </label>
                    <p class="text-muted-foreground text-xs leading-normal">
                      General Data Protection Regulation (Articles 13, 14, 15&ndash;22, DPO and supervisory authority
                      clauses).
                    </p>
                  </div>
                </div>

                <!-- CCPA / CPRA -->
                <div
                  class="border-border bg-muted/20 hover:bg-muted/40 flex items-start gap-3 rounded-lg border p-3 transition-colors"
                >
                  <Checkbox id="jur-ccpa" v-model="jurisdictions.ccpa" class="mt-0.5" />
                  <div class="space-y-0.5">
                    <label for="jur-ccpa" class="text-foreground cursor-pointer text-xs font-semibold select-none">
                      CCPA / CPRA (California)
                    </label>
                    <p class="text-muted-foreground text-xs leading-normal">
                      California Consumer Privacy Act (Right to Know, Delete, Correct, and &ldquo;Do Not Sell My
                      Info&rdquo;).
                    </p>
                  </div>
                </div>

                <!-- PIPEDA -->
                <div
                  class="border-border bg-muted/20 hover:bg-muted/40 flex items-start gap-3 rounded-lg border p-3 transition-colors"
                >
                  <Checkbox id="jur-pipeda" v-model="jurisdictions.pipeda" class="mt-0.5" />
                  <div class="space-y-0.5">
                    <label for="jur-pipeda" class="text-foreground cursor-pointer text-xs font-semibold select-none">
                      PIPEDA (Canada)
                    </label>
                    <p class="text-muted-foreground text-xs leading-normal">
                      Personal Information Protection and Electronic Documents Act (10 Fair Information Principles).
                    </p>
                  </div>
                </div>

                <!-- LGPD -->
                <div
                  class="border-border bg-muted/20 hover:bg-muted/40 flex items-start gap-3 rounded-lg border p-3 transition-colors"
                >
                  <Checkbox id="jur-lgpd" v-model="jurisdictions.lgpd" class="mt-0.5" />
                  <div class="space-y-0.5">
                    <label for="jur-lgpd" class="text-foreground cursor-pointer text-xs font-semibold select-none">
                      LGPD (Brazil)
                    </label>
                    <p class="text-muted-foreground text-xs leading-normal">
                      Lei Geral de Prote&ccedil;&atilde;o de Dados (Law No. 13.709/2018, ANPD compliance rights).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <!-- 3. Third-Party Data Processors -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Server class="text-muted-foreground size-4" aria-hidden="true" />
                  <span class="text-foreground text-xs font-semibold tracking-wider uppercase">
                    Third-Party Processors
                  </span>
                </div>
                <Badge variant="outline" class="font-mono text-xs">
                  {{ activeProcessorsList.length }}/{{ ALL_PROCESSORS.length }} Active
                </Badge>
              </div>

              <!-- Category: Analytics -->
              <div class="space-y-2">
                <div class="text-foreground flex items-center gap-1.5 text-xs font-medium">
                  <BarChart3 class="text-primary size-3.5" aria-hidden="true" />
                  <span>Analytics &amp; Metrics</span>
                </div>
                <div class="divide-border/60 border-border bg-card divide-y rounded-lg border">
                  <!-- GA4 -->
                  <div class="flex items-center justify-between gap-3 p-2.5">
                    <div class="space-y-0.5">
                      <p class="text-foreground text-xs font-medium">Google Analytics 4</p>
                      <p class="text-muted-foreground text-xs">Traffic telemetry, visitor trends &amp; IP masking</p>
                    </div>
                    <Switch v-model="processors.ga4" aria-label="Google Analytics 4" />
                  </div>
                  <!-- PostHog -->
                  <div class="flex items-center justify-between gap-3 p-2.5">
                    <div class="space-y-0.5">
                      <p class="text-foreground text-xs font-medium">PostHog Cloud</p>
                      <p class="text-muted-foreground text-xs">
                        Product telemetry, event tracking &amp; session replay
                      </p>
                    </div>
                    <Switch v-model="processors.posthog" aria-label="PostHog Cloud" />
                  </div>
                  <!-- Plausible -->
                  <div class="flex items-center justify-between gap-3 p-2.5">
                    <div class="space-y-0.5">
                      <p class="text-foreground text-xs font-medium">Plausible Analytics</p>
                      <p class="text-muted-foreground text-xs">Privacy-first cookieless analytics in EU</p>
                    </div>
                    <Switch v-model="processors.plausible" aria-label="Plausible Analytics" />
                  </div>
                </div>
              </div>

              <!-- Category: Payment Processing -->
              <div class="space-y-2">
                <div class="text-foreground flex items-center gap-1.5 text-xs font-medium">
                  <CreditCard class="text-primary size-3.5" aria-hidden="true" />
                  <span>Payment Processing</span>
                </div>
                <div class="divide-border/60 border-border bg-card divide-y rounded-lg border">
                  <!-- Stripe -->
                  <div class="flex items-center justify-between gap-3 p-2.5">
                    <div class="space-y-0.5">
                      <p class="text-foreground text-xs font-medium">Stripe</p>
                      <p class="text-muted-foreground text-xs">PCI-DSS Level 1 tokenized billing and transactions</p>
                    </div>
                    <Switch v-model="processors.stripe" aria-label="Stripe" />
                  </div>
                  <!-- Paddle -->
                  <div class="flex items-center justify-between gap-3 p-2.5">
                    <div class="space-y-0.5">
                      <p class="text-foreground text-xs font-medium">Paddle</p>
                      <p class="text-muted-foreground text-xs">
                        Merchant of record, checkout &amp; global tax handling
                      </p>
                    </div>
                    <Switch v-model="processors.paddle" aria-label="Paddle" />
                  </div>
                </div>
              </div>

              <!-- Category: Error Logging & Telemetry -->
              <div class="space-y-2">
                <div class="text-foreground flex items-center gap-1.5 text-xs font-medium">
                  <Bug class="text-primary size-3.5" aria-hidden="true" />
                  <span>Error Logging &amp; Telemetry</span>
                </div>
                <div class="divide-border/60 border-border bg-card divide-y rounded-lg border">
                  <!-- Sentry -->
                  <div class="flex items-center justify-between gap-3 p-2.5">
                    <div class="space-y-0.5">
                      <p class="text-foreground text-xs font-medium">Sentry</p>
                      <p class="text-muted-foreground text-xs">
                        Application exceptions, crash tracing &amp; stack traces
                      </p>
                    </div>
                    <Switch v-model="processors.sentry" aria-label="Sentry" />
                  </div>
                  <!-- Datadog -->
                  <div class="flex items-center justify-between gap-3 p-2.5">
                    <div class="space-y-0.5">
                      <p class="text-foreground text-xs font-medium">Datadog</p>
                      <p class="text-muted-foreground text-xs">APM performance telemetry &amp; log aggregation</p>
                    </div>
                    <Switch v-model="processors.datadog" aria-label="Datadog" />
                  </div>
                </div>
              </div>

              <!-- Category: Infrastructure & Hosting -->
              <div class="space-y-2">
                <div class="text-foreground flex items-center gap-1.5 text-xs font-medium">
                  <Server class="text-primary size-3.5" aria-hidden="true" />
                  <span>Infrastructure &amp; Hosting</span>
                </div>
                <div class="divide-border/60 border-border bg-card divide-y rounded-lg border">
                  <!-- Cloudflare -->
                  <div class="flex items-center justify-between gap-3 p-2.5">
                    <div class="space-y-0.5">
                      <p class="text-foreground text-xs font-medium">Cloudflare Pages</p>
                      <p class="text-muted-foreground text-xs">
                        Global CDN edge routing, caching &amp; DDoS mitigation
                      </p>
                    </div>
                    <Switch v-model="processors.cloudflare" aria-label="Cloudflare Pages" />
                  </div>
                  <!-- AWS S3 -->
                  <div class="flex items-center justify-between gap-3 p-2.5">
                    <div class="space-y-0.5">
                      <p class="text-foreground text-xs font-medium">AWS S3</p>
                      <p class="text-muted-foreground text-xs">Encrypted cloud object storage for assets and media</p>
                    </div>
                    <Switch v-model="processors.aws" aria-label="AWS S3" />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <!-- 4. Cookie Tracking Disclosure Switch -->
            <div class="border-border bg-muted/20 flex items-center justify-between gap-4 rounded-lg border p-3.5">
              <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                  <Cookie class="text-primary size-4" aria-hidden="true" />
                  <p class="text-foreground text-xs font-semibold">Cookie Tracking Disclosure</p>
                </div>
                <p class="text-muted-foreground text-xs leading-normal">
                  Enable if using session cookies, analytics tags, or local storage. When disabled, generates a strict
                  cookieless guarantee.
                </p>
              </div>
              <Switch v-model="cookieTracking" aria-label="Cookie Tracking Disclosure" />
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: Live Policy Document Preview (60% / 7 cols) -->
      <div class="space-y-5 lg:sticky lg:top-6 lg:col-span-7">
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="relative flex size-2">
                    <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  <CardTitle class="text-base font-semibold">Live Policy Document Preview</CardTitle>
                </div>
                <CardDescription class="text-xs">
                  Real-time generated legal disclosures tailored to your chosen configuration.
                </CardDescription>
              </div>

              <!-- Copy Actions Bar -->
              <div class="flex items-center gap-2">
                <Button variant="outline" size="sm" class="gap-1.5 text-xs" @click="copyPolicy('md')">
                  <Check v-if="copiedMd" class="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <Copy v-else class="size-3.5" aria-hidden="true" />
                  <span>{{ copiedMd ? 'Copied MD!' : 'Copy Markdown' }}</span>
                </Button>

                <Button variant="outline" size="sm" class="gap-1.5 text-xs" @click="copyPolicy('html')">
                  <Check v-if="copiedHtml" class="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <Code2 v-else class="size-3.5" aria-hidden="true" />
                  <span>{{ copiedHtml ? 'Copied HTML!' : 'Copy HTML' }}</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Formatted Document Canvas -->
            <div
              class="border-border/80 bg-background/50 text-foreground/90 max-h-[720px] space-y-6 overflow-y-auto rounded-lg border p-5 text-sm leading-relaxed sm:p-6"
            >
              <!-- Document Header Block -->
              <div class="border-border space-y-2 border-b pb-5">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="outline" class="font-mono text-xs">Official Disclosure</Badge>
                  <span class="text-muted-foreground text-xs"
                    >Last updated: {{ effectiveDate || 'August 21, 2026' }}</span
                  >
                </div>
                <h2 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  Privacy Policy for {{ companyName || 'UIPKGE Technologies Inc.' }}
                </h2>
                <div class="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span><strong>Effective Date:</strong> {{ effectiveDate || 'August 21, 2026' }}</span>
                  <span>&bull;</span>
                  <span><strong>Website:</strong> {{ websiteUrl || 'https://uipkge.dev' }}</span>
                  <span>&bull;</span>
                  <span><strong>Contact:</strong> {{ contactEmail || 'privacy@uipkge.dev' }}</span>
                </div>
              </div>

              <!-- 1. Introduction & Overview -->
              <section class="space-y-2.5">
                <h3 class="text-foreground text-base font-semibold">1. Introduction &amp; Scope</h3>
                <p class="text-muted-foreground text-xs sm:text-sm">
                  {{ companyName || 'UIPKGE Technologies Inc.' }} (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or
                  &ldquo;us&rdquo;) is dedicated to safeguarding your personal data and ensuring transparent privacy
                  practices. This Privacy Policy governs your use of
                  <a :href="websiteUrl || 'https://uipkge.dev'" class="text-primary underline">{{
                    websiteUrl || 'https://uipkge.dev'
                  }}</a>
                  (the &ldquo;Website&rdquo;) and all associated services and developer APIs.
                </p>
                <p class="text-muted-foreground text-xs sm:text-sm">
                  By accessing our Website, you acknowledge that you have read, understood, and agreed to the practices
                  described in this policy.
                </p>

                <!-- Core Commitments Callout -->
                <div class="border-primary/20 bg-primary/5 rounded-lg border p-3.5">
                  <div class="flex items-start gap-3">
                    <ShieldCheck class="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <div class="space-y-1 text-xs sm:text-sm">
                      <p class="text-foreground font-semibold">Core Privacy Commitments</p>
                      <ul class="text-muted-foreground space-y-1 text-xs">
                        <li class="flex items-center gap-1.5">
                          <CheckCircle2 class="text-primary size-3.5 shrink-0" aria-hidden="true" />
                          <span>We never sell or rent your personal information to third-party data brokers.</span>
                        </li>
                        <li class="flex items-center gap-1.5">
                          <CheckCircle2 class="text-primary size-3.5 shrink-0" aria-hidden="true" />
                          <span>Industry-standard encryption: TLS 1.3 in transit and AES-256 at rest.</span>
                        </li>
                        <li class="flex items-center gap-1.5">
                          <CheckCircle2 class="text-primary size-3.5 shrink-0" aria-hidden="true" />
                          <span>Guaranteed rights to data access, export portability, and permanent erasure.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <!-- 2. Personal Information We Collect -->
              <section class="space-y-2.5">
                <h3 class="text-foreground text-base font-semibold">2. Personal Information We Collect</h3>
                <p class="text-muted-foreground text-xs sm:text-sm">
                  We gather only the minimum information necessary to operate our platform securely:
                </p>

                <div class="space-y-2">
                  <div class="border-border bg-card rounded-md border p-3">
                    <p class="text-foreground text-xs font-semibold">Account &amp; Inquiries</p>
                    <p class="text-muted-foreground mt-0.5 text-xs">
                      When contacting us via {{ contactEmail || 'privacy@uipkge.dev' }} or registering a workspace, we
                      collect names, email addresses, and communication logs.
                    </p>
                  </div>

                  <div
                    v-if="processors.stripe || processors.paddle"
                    class="border-border bg-card rounded-md border p-3"
                  >
                    <p class="text-foreground text-xs font-semibold">Billing &amp; Payment Data</p>
                    <p class="text-muted-foreground mt-0.5 text-xs">
                      Payment processing is handled via tokenized PCI-DSS Level 1 compliant gateways ({{
                        [processors.stripe ? 'Stripe' : '', processors.paddle ? 'Paddle' : '']
                          .filter(Boolean)
                          .join(', ')
                      }}). Raw credit card numbers are never stored on our infrastructure.
                    </p>
                  </div>

                  <div
                    v-if="
                      processors.ga4 ||
                      processors.posthog ||
                      processors.plausible ||
                      processors.sentry ||
                      processors.datadog
                    "
                    class="border-border bg-card rounded-md border p-3"
                  >
                    <p class="text-foreground text-xs font-semibold">Telemetry &amp; System Health</p>
                    <p class="text-muted-foreground mt-0.5 text-xs">
                      Aggregated telemetry, client user-agents, IP addresses, and error stack traces to guarantee uptime
                      and API responsiveness.
                    </p>
                  </div>
                </div>
              </section>

              <!-- 3. Third-Party Sub-Processors -->
              <section class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <h3 class="text-foreground text-base font-semibold">3. Third-Party Sub-Processors</h3>
                  <Badge variant="secondary" class="font-mono text-xs">
                    {{ activeProcessorsList.length }} Disclosed
                  </Badge>
                </div>
                <p class="text-muted-foreground text-xs sm:text-sm">
                  To operate our platform efficiently, we engage vetted sub-processors governed by strict Data
                  Processing Agreements (DPAs):
                </p>

                <div v-if="activeProcessorsList.length > 0" class="border-border overflow-hidden rounded-lg border">
                  <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                      <thead class="bg-muted/50 border-border border-b font-semibold">
                        <tr>
                          <th scope="col" class="px-3.5 py-2.5">Sub-Processor</th>
                          <th scope="col" class="px-3.5 py-2.5">Category</th>
                          <th scope="col" class="px-3.5 py-2.5">Purpose</th>
                          <th scope="col" class="px-3.5 py-2.5">Processing Location</th>
                        </tr>
                      </thead>
                      <tbody class="divide-border divide-y">
                        <tr
                          v-for="proc in activeProcessorsList"
                          :key="proc.id"
                          class="hover:bg-muted/20 transition-colors"
                        >
                          <td class="text-foreground px-3.5 py-2.5 font-medium whitespace-nowrap">
                            {{ proc.name }}
                          </td>
                          <td class="text-muted-foreground px-3.5 py-2.5">
                            <Badge variant="outline" class="px-1.5 py-0 text-xs">
                              {{ proc.category }}
                            </Badge>
                          </td>
                          <td class="text-muted-foreground px-3.5 py-2.5">{{ proc.purpose }}</td>
                          <td class="text-muted-foreground px-3.5 py-2.5 whitespace-nowrap">{{ proc.location }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  v-else
                  class="border-border bg-muted/20 text-muted-foreground rounded-lg border p-4 text-center text-xs"
                >
                  No external third-party sub-processors are currently enabled.
                </div>
              </section>

              <!-- 4. Cookies & Tracking Technologies -->
              <section class="space-y-2.5">
                <h3 class="text-foreground text-base font-semibold">4. Cookies &amp; Tracking Technologies</h3>
                <div v-if="cookieTracking" class="space-y-2">
                  <p class="text-muted-foreground text-xs sm:text-sm">
                    We use cookies and local storage tokens to provide essential authentication and analyze site traffic
                    patterns:
                  </p>
                  <ul class="text-muted-foreground list-disc space-y-1 pl-5 text-xs sm:text-sm">
                    <li>
                      <strong class="text-foreground font-medium">Strictly Necessary Cookies:</strong> Session tokens,
                      theme preference states, and security anti-CSRF verification.
                    </li>
                    <li v-if="processors.ga4 || processors.posthog">
                      <strong class="text-foreground font-medium">Analytics Cookies:</strong> Aggregated interaction
                      counters to assess documentation usability and improve performance.
                    </li>
                  </ul>
                  <p class="text-muted-foreground text-xs">
                    You can configure your browser to block or alert you about cookies. Disabling strictly necessary
                    cookies may degrade website functionality.
                  </p>
                </div>
                <div v-else class="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3.5">
                  <div class="flex items-start gap-2.5">
                    <CheckCircle2
                      class="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                      aria-hidden="true"
                    />
                    <div>
                      <p class="text-foreground text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        Zero-Tracking Cookies Guarantee
                      </p>
                      <p class="text-muted-foreground mt-0.5 text-xs">
                        This website operates on a 100% cookieless privacy architecture. We do not store persistent
                        tracking cookies, cross-site beacons, or marketing identifiers on your device.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- 5. Statutory Compliance & User Rights -->
              <section class="space-y-3">
                <h3 class="text-foreground text-base font-semibold">
                  5. Statutory Compliance &amp; Your Privacy Rights
                </h3>

                <!-- GDPR Clause -->
                <div v-if="jurisdictions.gdpr" class="border-border bg-card space-y-2 rounded-lg border p-4">
                  <div class="flex items-center justify-between">
                    <h4 class="text-foreground text-xs font-semibold">5.1 European Union (GDPR - EU 2016/679)</h4>
                    <Badge variant="outline" class="text-xs">EU / EEA</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    If you reside in the European Economic Area, you possess statutory rights under GDPR Articles
                    15&ndash;22:
                  </p>
                  <ul class="text-muted-foreground grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
                    <li class="flex items-center gap-1.5">
                      <CheckCircle2 class="text-primary size-3 shrink-0" aria-hidden="true" />
                      <span><strong>Access (Art. 15):</strong> Obtain copy of personal data.</span>
                    </li>
                    <li class="flex items-center gap-1.5">
                      <CheckCircle2 class="text-primary size-3 shrink-0" aria-hidden="true" />
                      <span><strong>Rectification (Art. 16):</strong> Correct inaccurate records.</span>
                    </li>
                    <li class="flex items-center gap-1.5">
                      <CheckCircle2 class="text-primary size-3 shrink-0" aria-hidden="true" />
                      <span><strong>Erasure (Art. 17):</strong> Request deletion of data.</span>
                    </li>
                    <li class="flex items-center gap-1.5">
                      <CheckCircle2 class="text-primary size-3 shrink-0" aria-hidden="true" />
                      <span><strong>Portability (Art. 20):</strong> Export data in JSON format.</span>
                    </li>
                  </ul>
                  <p class="text-muted-foreground pt-1 text-xs">
                    You also have the statutory right to lodge a formal complaint with your local EU Supervisory
                    Authority.
                  </p>
                </div>

                <!-- CCPA / CPRA Clause -->
                <div v-if="jurisdictions.ccpa" class="border-border bg-card space-y-2 rounded-lg border p-4">
                  <div class="flex items-center justify-between">
                    <h4 class="text-foreground text-xs font-semibold">5.2 California Privacy Rights (CCPA / CPRA)</h4>
                    <Badge variant="outline" class="text-xs">California</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    California residents are entitled to notice at collection and the following statutory protections:
                  </p>
                  <ul class="text-muted-foreground space-y-1 text-xs">
                    <li>
                      &bull; <strong>Right to Know &amp; Access:</strong> Request categories and specific pieces of data
                      collected in the past 12 months.
                    </li>
                    <li>
                      &bull; <strong>Right to Delete:</strong> Request deletion of personal records collected from you.
                    </li>
                    <li>
                      &bull; <strong>Zero Data Selling:</strong> We do not sell or share personal information with
                      third-party data brokers.
                    </li>
                    <li>
                      &bull; <strong>Non-Discrimination:</strong> We do not alter service availability or pricing when
                      you exercise privacy rights.
                    </li>
                  </ul>
                </div>

                <!-- PIPEDA Clause -->
                <div v-if="jurisdictions.pipeda" class="border-border bg-card space-y-2 rounded-lg border p-4">
                  <div class="flex items-center justify-between">
                    <h4 class="text-foreground text-xs font-semibold">5.3 Canadian Privacy Rights (PIPEDA)</h4>
                    <Badge variant="outline" class="text-xs">Canada</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    In compliance with Canada&rsquo;s PIPEDA, we adhere to the 10 Fair Information Principles ensuring
                    accountability, consent, purpose limitation, and safeguard standards. Inquiries can be escalated to
                    the Office of the Privacy Commissioner of Canada (OPC).
                  </p>
                </div>

                <!-- LGPD Clause -->
                <div v-if="jurisdictions.lgpd" class="border-border bg-card space-y-2 rounded-lg border p-4">
                  <div class="flex items-center justify-between">
                    <h4 class="text-foreground text-xs font-semibold">5.4 Brazilian Privacy Rights (LGPD)</h4>
                    <Badge variant="outline" class="text-xs">Brazil</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    Under Law No. 13.709/2018 (LGPD), Brazilian data subjects may confirm processing activities, request
                    anonymization or blocking of non-compliant data, and revoke consent through our Data Protection
                    Officer.
                  </p>
                </div>

                <!-- Generic fallback if no checkboxes selected -->
                <div
                  v-if="!jurisdictions.gdpr && !jurisdictions.ccpa && !jurisdictions.pipeda && !jurisdictions.lgpd"
                  class="border-border bg-muted/20 text-muted-foreground rounded-lg border p-4 text-xs"
                >
                  We adhere to global privacy principles. You may request access to, correction of, or erasure of your
                  personal data at any time by contacting our team.
                </div>
              </section>

              <!-- 6. Data Security & Storage -->
              <section class="space-y-2.5">
                <h3 class="text-foreground text-base font-semibold">6. Data Security &amp; Storage</h3>
                <p class="text-muted-foreground text-xs sm:text-sm">
                  We enforce technical and organizational safeguards including TLS 1.3 encryption in transit, AES-256
                  encryption at rest, segmented cloud VPC environments, and strict least-privilege role-based access
                  controls (RBAC). Data is retained only for as long as necessary to fulfill operational commitments or
                  statutory legal obligations.
                </p>
              </section>

              <!-- 7. Contact Information & Data Protection Officer -->
              <section class="border-border space-y-2.5 border-t pt-5">
                <h3 class="text-foreground text-base font-semibold">7. Contact Information &amp; Data Protection</h3>
                <p class="text-muted-foreground text-xs sm:text-sm">
                  To submit a data request, exercise your statutory privacy rights, or ask questions regarding this
                  policy, please contact:
                </p>
                <div class="border-border bg-card rounded-lg border p-4">
                  <p class="text-foreground text-xs font-semibold sm:text-sm">
                    {{ companyName || 'UIPKGE Technologies Inc.' }}
                  </p>
                  <p class="text-muted-foreground mt-0.5 text-xs">Attn: Privacy &amp; Data Protection Officer</p>
                  <div class="mt-2 flex items-center gap-2">
                    <Mail class="text-primary size-3.5 shrink-0" aria-hidden="true" />
                    <a
                      :href="`mailto:${contactEmail || 'privacy@uipkge.dev'}`"
                      class="text-primary inline-flex min-h-6 items-center text-xs font-medium hover:underline"
                    >
                      {{ contactEmail || 'privacy@uipkge.dev' }}
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </CardContent>

          <CardFooter class="border-border flex flex-wrap items-center justify-between gap-3 border-t p-4 text-xs">
            <div class="text-muted-foreground flex items-center gap-2">
              <Sparkles class="text-primary size-3.5" aria-hidden="true" />
              <span>
                Generated for <strong>{{ companyName || 'UIPKGE Technologies Inc.' }}</strong>
              </span>
            </div>
            <div class="flex items-center gap-2">
              <Badge variant="outline" class="font-mono text-xs"> {{ activeProcessorsList.length }} Processors </Badge>
              <Badge variant="secondary" class="font-mono text-xs">
                {{ activeJurisdictionsCount }} Jurisdictions
              </Badge>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
