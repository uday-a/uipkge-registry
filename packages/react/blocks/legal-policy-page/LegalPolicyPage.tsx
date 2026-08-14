'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { CheckCircle2, FileText, Mail, MapPin, Pencil, Printer, ShieldCheck, Sliders, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export interface LegalPolicyPageProps {
  className?: string
}

const tableOfContents = [
  { id: 'introduction', label: '1. Introduction & Scope' },
  { id: 'information-collected', label: '2. Information We Collect' },
  { id: 'data-usage', label: '3. How We Use Your Data' },
  { id: 'third-parties', label: '4. Data Sharing & Third Parties' },
  { id: 'your-rights', label: '5. Your Rights & Choices' },
  { id: 'contact-dpo', label: '6. Contact & Data Protection Officer' },
]

export function LegalPolicyPage({ className }: LegalPolicyPageProps) {
  const [activeSection, setActiveSection] = useState('introduction')
  const [selectedVersion, setSelectedVersion] = useState('v2.4')

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-10% 0px -70% 0px' },
    )

    for (const item of tableOfContents) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div data-slot="legal-policy-page" className={cn('bg-background text-foreground w-full', className)}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="font-mono text-xs">
              Legal &amp; Compliance
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
            <p className="text-muted-foreground text-sm">
              Effective date: August 15, 2026 &bull; Current version: {selectedVersion}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedVersion} onValueChange={setSelectedVersion}>
              <SelectTrigger className="w-40 text-xs" aria-label="Select policy version">
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v2.4">v2.4 (Current)</SelectItem>
                <SelectItem value="v2.3">v2.3 (July 2025)</SelectItem>
                <SelectItem value="v2.0">v2.0 (Jan 2025)</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint}>
              <Printer className="size-4" aria-hidden="true" />
              <span>Print / PDF</span>
            </Button>
          </div>
        </div>

        <Separator className="my-8" />

        {/* 2-Column Documentation Layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Sticky Sidebar Navigation */}
          <aside className="space-y-6 lg:sticky lg:top-8 lg:col-span-4 lg:self-start xl:col-span-3">
            <div className="border-border bg-card rounded-lg border p-4 shadow-xs">
              <p className="text-muted-foreground px-2 pb-2 text-xs font-semibold tracking-wider uppercase">
                Table of Contents
              </p>
              <nav aria-label="Table of contents">
                <ul className="space-y-1">
                  {tableOfContents.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className={cn(
                          'focus-visible:ring-ring w-full rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                          activeSection === item.id
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                        )}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <Card className="bg-muted/30 border-border">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-primary size-4" aria-hidden="true" />
                  <CardTitle className="text-xs font-semibold">Privacy Questions?</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2 p-4 pt-0 text-xs">
                <p>Need clarification on our data handling practices or DPAs?</p>
                <a
                  href="mailto:privacy@acmecorp.com"
                  className="text-primary flex min-h-6 items-center font-medium hover:underline"
                >
                  privacy@acmecorp.com
                </a>
              </CardContent>
            </Card>
          </aside>

          {/* Right Main Content */}
          <main className="space-y-12 lg:col-span-8 xl:col-span-9">
            {/* Section 1: Introduction & Scope */}
            <section id="introduction" className="scroll-mt-8 space-y-4">
              <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                1. Introduction &amp; Scope
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                At Acme Corp (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), safeguarding your privacy and
                maintaining customer trust is core to everything we build. This Privacy Policy sets forth our policies
                regarding the collection, processing, storage, and disclosure of personal data when you access or use
                our developer platform, APIs, web interfaces, and documentation (collectively, the
                &ldquo;Services&rdquo;).
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                This policy applies to all registered workspace members, API consumers, and website visitors. By
                accessing our Services, you acknowledge that you have read and understood this Privacy Policy.
              </p>

              {/* Highlights Callout */}
              <div className="border-primary/20 bg-primary/5 rounded-lg border p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary mt-0.5 rounded-md p-2">
                    <ShieldCheck className="size-5 shrink-0" aria-hidden="true" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-foreground text-sm font-semibold">Our Core Privacy Commitments</h3>
                    <ul className="text-muted-foreground space-y-1.5 text-xs sm:text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="text-primary size-4 shrink-0" aria-hidden="true" />
                        <span>
                          <strong>Zero Data Monetization:</strong> We never sell, rent, or trade your personal data to
                          third-party brokers or advertisers.
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="text-primary size-4 shrink-0" aria-hidden="true" />
                        <span>
                          <strong>End-to-End Encryption:</strong> Customer databases and authentication keys are
                          protected with AES-256 at rest and TLS 1.3 in transit.
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="text-primary size-4 shrink-0" aria-hidden="true" />
                        <span>
                          <strong>Portability &amp; Erasure:</strong> Export your data archive in standard JSON or
                          trigger permanent account deletion at any time.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Information We Collect */}
            <section id="information-collected" className="scroll-mt-8 space-y-4">
              <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                2. Information We Collect
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We collect information strictly necessary to fulfill our service commitments, secure account access, and
                meet statutory compliance obligations.
              </p>

              <div className="border-border overflow-hidden rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-muted/50 border-border border-b font-semibold">
                      <tr>
                        <th scope="col" className="px-4 py-3">
                          Data Category
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Collected Information
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Purpose &amp; Legal Basis
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                      <tr className="hover:bg-muted/30 transition-colors">
                        <td className="text-foreground px-4 py-3 align-top font-medium whitespace-nowrap">
                          Account Identity
                        </td>
                        <td className="text-muted-foreground px-4 py-3 align-top">
                          Full name, email address, password hash, organization name, role, API keys.
                        </td>
                        <td className="text-muted-foreground px-4 py-3 align-top">
                          Authentication and contractual service delivery (GDPR Art. 6(1)(b)).
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/30 transition-colors">
                        <td className="text-foreground px-4 py-3 align-top font-medium whitespace-nowrap">
                          Billing &amp; Payments
                        </td>
                        <td className="text-muted-foreground px-4 py-3 align-top">
                          Billing address, tax ID, payment transaction tokens (card numbers tokenized by Stripe).
                        </td>
                        <td className="text-muted-foreground px-4 py-3 align-top">
                          Payment processing, invoice generation, tax compliance (GDPR Art. 6(1)(c)).
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/30 transition-colors">
                        <td className="text-foreground px-4 py-3 align-top font-medium whitespace-nowrap">
                          Usage &amp; Telemetry
                        </td>
                        <td className="text-muted-foreground px-4 py-3 align-top">
                          IP address, client user agent, API endpoint invocations, response latencies, error logs.
                        </td>
                        <td className="text-muted-foreground px-4 py-3 align-top">
                          Security monitoring, rate limiting, and system stability (GDPR Art. 6(1)(f)).
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/30 transition-colors">
                        <td className="text-foreground px-4 py-3 align-top font-medium whitespace-nowrap">
                          Cookies &amp; Storage
                        </td>
                        <td className="text-muted-foreground px-4 py-3 align-top">
                          Session authentication tokens, theme preference state, consent audit records.
                        </td>
                        <td className="text-muted-foreground px-4 py-3 align-top">
                          Session persistence, interface customization, and consent tracking.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 3: How We Use Your Data */}
            <section id="data-usage" className="scroll-mt-8 space-y-4">
              <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">3. How We Use Your Data</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We process personal data only when an explicit legal basis exists under applicable regulations.
                Specifically, your information is used for:
              </p>

              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <li className="border-border bg-card flex items-start gap-3 rounded-lg border p-3.5 shadow-xs">
                  <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <div className="text-xs sm:text-sm">
                    <strong className="text-foreground font-semibold">Service Operation:</strong>
                    <p className="text-muted-foreground mt-0.5">
                      Managing user authentication, executing API workloads, and delivering developer tooling.
                    </p>
                  </div>
                </li>
                <li className="border-border bg-card flex items-start gap-3 rounded-lg border p-3.5 shadow-xs">
                  <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <div className="text-xs sm:text-sm">
                    <strong className="text-foreground font-semibold">Security &amp; Fraud Prevention:</strong>
                    <p className="text-muted-foreground mt-0.5">
                      Detecting suspicious sign-ins, preventing credential abuse, and enforcing rate limits.
                    </p>
                  </div>
                </li>
                <li className="border-border bg-card flex items-start gap-3 rounded-lg border p-3.5 shadow-xs">
                  <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <div className="text-xs sm:text-sm">
                    <strong className="text-foreground font-semibold">Billing &amp; Invoicing:</strong>
                    <p className="text-muted-foreground mt-0.5">
                      Processing subscription payments, issuing VAT invoices, and maintaining financial records.
                    </p>
                  </div>
                </li>
                <li className="border-border bg-card flex items-start gap-3 rounded-lg border p-3.5 shadow-xs">
                  <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <div className="text-xs sm:text-sm">
                    <strong className="text-foreground font-semibold">Transactional Communications:</strong>
                    <p className="text-muted-foreground mt-0.5">
                      Sending password reset links, security audit notices, and critical maintenance alerts.
                    </p>
                  </div>
                </li>
                <li className="border-border bg-card flex items-start gap-3 rounded-lg border p-3.5 shadow-xs">
                  <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <div className="text-xs sm:text-sm">
                    <strong className="text-foreground font-semibold">Performance Analytics:</strong>
                    <p className="text-muted-foreground mt-0.5">
                      Analyzing aggregated telemetry to reduce edge query latency and improve uptime.
                    </p>
                  </div>
                </li>
                <li className="border-border bg-card flex items-start gap-3 rounded-lg border p-3.5 shadow-xs">
                  <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <div className="text-xs sm:text-sm">
                    <strong className="text-foreground font-semibold">Statutory Compliance:</strong>
                    <p className="text-muted-foreground mt-0.5">
                      Fulfilling mandatory tax disclosures, court orders, and regulatory audit standards.
                    </p>
                  </div>
                </li>
              </ul>
            </section>

            {/* Section 4: Data Sharing & Third Parties */}
            <section id="third-parties" className="scroll-mt-8 space-y-4">
              <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                4. Data Sharing &amp; Third Parties (Sub-Processors)
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We do not sell user data. To maintain high-availability infrastructure, we engage vetted sub-processors
                bound by Data Processing Agreements (DPAs) incorporating standard contractual clauses (SCCs).
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card className="border-border bg-card">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">Amazon Web Services</CardTitle>
                      <Badge variant="secondary" className="text-xs font-normal">
                        Cloud Hosting
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">Database storage and edge computation</CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground space-y-1 p-4 pt-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-foreground font-medium">Location:</span>
                      <span>US &amp; EU (Frankfurt)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground font-medium">Data Shared:</span>
                      <span>Encrypted databases, backups</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">Stripe, Inc.</CardTitle>
                      <Badge variant="secondary" className="text-xs font-normal">
                        Payments
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">PCI-DSS Level 1 payment gateway</CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground space-y-1 p-4 pt-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-foreground font-medium">Location:</span>
                      <span>United States / Global</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground font-medium">Data Shared:</span>
                      <span>Billing info, payment tokens</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">Postmark</CardTitle>
                      <Badge variant="secondary" className="text-xs font-normal">
                        Transactional Email
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">System emails &amp; security alerts</CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground space-y-1 p-4 pt-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-foreground font-medium">Location:</span>
                      <span>United States</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground font-medium">Data Shared:</span>
                      <span>Recipient email, delivery logs</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">Sentry / Datadog</CardTitle>
                      <Badge variant="secondary" className="text-xs font-normal">
                        Observability
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">Application monitoring &amp; crash tracing</CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground space-y-1 p-4 pt-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-foreground font-medium">Location:</span>
                      <span>US &amp; European Union</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground font-medium">Data Shared:</span>
                      <span>Anonymized crash traces, IP hash</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 5: Your Rights & Choices */}
            <section id="your-rights" className="scroll-mt-8 space-y-4">
              <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                5. Your Rights &amp; Choices
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Under GDPR (Articles 15&ndash;22), CCPA/CPRA, and related global regulations, you possess specific
                enforceable rights regarding your personal records.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card className="border-border bg-card">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="text-primary size-4" aria-hidden="true" />
                      <CardTitle className="text-sm font-semibold">Right to Access &amp; Portability</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-muted-foreground p-4 pt-1 text-xs sm:text-sm">
                    Request a complete machine-readable copy (JSON) of your account data, logs, and billing history.
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center gap-2">
                      <Pencil className="text-primary size-4" aria-hidden="true" />
                      <CardTitle className="text-sm font-semibold">Right to Rectification</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-muted-foreground p-4 pt-1 text-xs sm:text-sm">
                    Update or correct inaccurate profile details, billing addresses, and organization contacts in
                    settings.
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center gap-2">
                      <Trash2 className="text-destructive size-4" aria-hidden="true" />
                      <CardTitle className="text-sm font-semibold">Right to Erasure (To Be Forgotten)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-muted-foreground p-4 pt-1 text-xs sm:text-sm">
                    Request permanent deletion of your account and personal identifiers within 30 calendar days.
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center gap-2">
                      <Sliders className="text-primary size-4" aria-hidden="true" />
                      <CardTitle className="text-sm font-semibold">Right to Restrict &amp; Opt-Out</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-muted-foreground p-4 pt-1 text-xs sm:text-sm">
                    Opt out of non-essential telemetry, unsubscribe from product updates, and configure cookie
                    preferences.
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 6: Contact & Data Protection Officer */}
            <section id="contact-dpo" className="scroll-mt-8 space-y-4">
              <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                6. Contact &amp; Data Protection Officer
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                If you have inquiries, complaints, or formal requests regarding this policy, contact our designated Data
                Protection Officer.
              </p>

              <Card className="border-border bg-card">
                <CardHeader className="p-5 pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-base font-semibold">Acme Data Protection Officer</CardTitle>
                    <Badge variant="outline" className="font-mono text-xs">
                      30-Day Response SLA
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">
                    Designated compliance contact under GDPR Article 37 and international privacy statutes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4 p-5 pt-0 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-2.5">
                      <Mail className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-foreground font-medium">Email Inquiries</p>
                        <a
                          href="mailto:dpo@acmecorp.com"
                          className="text-primary inline-flex min-h-6 items-center font-medium hover:underline"
                        >
                          dpo@acmecorp.com
                        </a>
                        <p className="text-muted-foreground mt-0.5 text-xs">PGP key available upon request</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-foreground font-medium">Physical Address</p>
                        <p>Acme Corporation</p>
                        <p>Attn: Legal &amp; Compliance</p>
                        <p>500 Market St, Suite 300</p>
                        <p>San Francisco, CA 94105, USA</p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    If you reside in the European Economic Area (EEA) and believe that our data processing infringes
                    applicable data protection law, you have the statutory right to lodge a complaint with your local
                    supervisory authority.
                  </p>
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
