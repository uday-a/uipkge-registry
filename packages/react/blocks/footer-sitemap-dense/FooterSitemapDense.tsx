'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'

// lucide-react no longer ships brand glyphs, so they are inlined here the
// same way footer-01 and the other shipped React blocks do it.
const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 016 0C17 4.7 18 5 18 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
  </svg>
)

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
)

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

const sections = [
  { heading: 'Platform', links: ['Metric layer', 'Dashboards', 'Alerting', 'Embedding', 'API', 'CLI'] },
  { heading: 'Solutions', links: ['Finance', 'RevOps', 'Analytics', 'Engineering', 'Healthcare', 'Retail'] },
  { heading: 'Developers', links: ['Documentation', 'API reference', 'SDKs', 'Webhooks', 'Status', 'Changelog'] },
  { heading: 'Resources', links: ['Guides', 'Benchmarks', 'Customers', 'Blog', 'Webinars', 'Glossary'] },
  { heading: 'Company', links: ['About', 'Careers', 'Press kit', 'Partners', 'Contact', 'Security'] },
  { heading: 'Legal', links: ['Privacy', 'Terms', 'DPA', 'Subprocessors', 'SLA', 'Accessibility'] },
]

export function FooterSitemapDense() {
  const [region, setRegion] = useState('eu')
  const [currency, setCurrency] = useState('eur')

  return (
    <footer data-slot="footer-sitemap-dense" className="border-border bg-background border-t">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {sections.map((section) => (
            <div key={section.heading}>
              <p className="text-muted-foreground/70 text-xs font-medium tracking-wide uppercase">{section.heading}</p>
              <ul className="mt-3 space-y-1.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <a href="#top" className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight">
            <Sparkles className="text-primary size-4" aria-hidden="true" />
            Northwind
          </a>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="h-8 w-40 text-xs" aria-label="Data region">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eu">EU (Frankfurt)</SelectItem>
                <SelectItem value="us">US (Virginia)</SelectItem>
                <SelectItem value="au">AU (Sydney)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="h-8 w-28 text-xs" aria-label="Currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eur">EUR €</SelectItem>
                <SelectItem value="usd">USD $</SelectItem>
                <SelectItem value="gbp">GBP £</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
            {/* Status dot is a live indicator, so it carries its own text for
                screen readers rather than relying on colour alone. */}
            <a href="#status" className="hover:bg-muted flex items-center gap-2 rounded-md px-2 py-1 transition-colors">
              <span className="bg-success size-2 rounded-full" aria-hidden="true" />
              <span className="text-muted-foreground text-xs">All systems operational</span>
            </a>
            <Badge variant="outline">SOC 2</Badge>
            <Badge variant="outline">GDPR</Badge>
            <Button variant="ghost" size="icon" className="size-8" aria-label="GitHub">
              <Github className="size-4" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8" aria-label="LinkedIn">
              <Linkedin className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground mt-6 text-xs">© 2026 Northwind Data, Inc. All rights reserved.</p>
      </div>
    </footer>
  )
}
