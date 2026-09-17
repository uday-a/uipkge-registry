'use client'

import * as React from 'react'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 016 0C17 4.7 18 5 18 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
  </svg>
)

const Twitter = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
  </svg>
)

interface FooterColumn {
  title: string
  links: { label: string; href: string; badge?: string }[]
}

const columns: FooterColumn[] = [
  {
    title: 'UI Primitives',
    links: [
      { label: 'Button & Controls', href: '#' },
      { label: 'Dialog & Overlays', href: '#' },
      { label: 'Data Table & Virtual', href: '#' },
      { label: 'Charts & Sparklines', href: '#' },
      { label: 'Form Controls & Inputs', href: '#' },
      { label: 'KpiGrid & Metric Tiles', href: '#' },
    ],
  },
  {
    title: 'Marketing Blocks',
    links: [
      { label: 'Hero Sandboxes', href: '#' },
      { label: 'Feature Workbenches', href: '#' },
      { label: 'Pricing Matrix & ROI', href: '#' },
      { label: 'Social Proof Tickers', href: '#' },
      { label: 'Testimonial Masonry', href: '#' },
      { label: 'Interactive Demos', href: '#', badge: 'New' },
    ],
  },
  {
    title: 'Ecosystem Templates',
    links: [
      { label: 'HRMS Nuxt Template', href: '#' },
      { label: 'HMS Clinical Dashboard', href: '#' },
      { label: 'Shipment Tracking Live', href: '#' },
      { label: 'Fintech Banking Portal', href: '#' },
      { label: 'AI LLM Workspace', href: '#' },
    ],
  },
  {
    title: 'Developer DX',
    links: [
      { label: 'CLI Installation Guide', href: '#' },
      { label: 'Tailwind CSS v4 Tokens', href: '#' },
      { label: 'Dual-Framework Parity', href: '#' },
      { label: 'Reka UI Primitives', href: '#' },
      { label: 'Radix UI Primitives', href: '#' },
      { label: 'Changelog Timeline', href: '#' },
    ],
  },
]

export interface FooterDeveloperDenseGridProps {
  className?: string
}

export function FooterDeveloperDenseGrid({ className }: FooterDeveloperDenseGridProps) {
  return (
    <footer
      data-slot="footer-developer-dense-grid"
      className={cn('border-border bg-card/60 text-foreground border-t backdrop-blur-md', className)}
    >
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Top Grid: Brand & Categorized Columns */}
        <div className="grid grid-cols-2 gap-8 text-left md:grid-cols-6 lg:grid-cols-12">
          {/* Brand Info (4 Cols) */}
          <div className="col-span-2 space-y-4 md:col-span-6 lg:col-span-4">
            <div className="flex items-center gap-2 font-mono text-base font-bold tracking-tight">
              <span className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-lg text-xs font-bold shadow-xs">
                U
              </span>
              <span>UIPKGE.DEV</span>
            </div>

            <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
              The open-source unbundled component registry where you own 100% of the source code. Calibrated tokens,
              pure AST distribution, and mathematical dual-framework parity across Vue 3.5 and React 19.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2 pt-2">
              <Button size="sm" variant="outline" className="size-8 rounded-lg p-0">
                <Github className="size-3.5" />
              </Button>
              <Button size="sm" variant="outline" className="size-8 rounded-lg p-0">
                <Twitter className="size-3.5" />
              </Button>
              <Button size="sm" variant="outline" className="size-8 rounded-lg p-0">
                <Globe className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* 4 Links Columns (8 Cols total, 2 cols each) */}
          {columns.map((col, idx) => (
            <div key={idx} className="col-span-1 space-y-3 md:col-span-3 lg:col-span-2">
              <h4 className="text-foreground font-mono text-xs font-bold tracking-wider uppercase">{col.title}</h4>
              <ul className="text-muted-foreground space-y-2 font-mono text-xs">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href={link.href}
                      className="hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="py-0.2 bg-primary/20 text-primary rounded px-1.5 text-xs font-bold uppercase">
                          {link.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Operational Status & Copyright Bar */}
        <div className="border-border/80 text-muted-foreground flex flex-col items-center justify-between gap-4 border-t pt-8 text-center font-mono text-xs sm:flex-row sm:text-left">
          {/* Live System Telemetry Status */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-foreground font-medium">All Global Edge Nodes Operational</span>
            <span className="text-muted-foreground/60">&bull; Latency: 14ms (P99)</span>
          </div>

          {/* Right Copyright & MIT Notice */}
          <div className="flex items-center gap-3">
            <span>MIT Licensed &bull; Unbundled Code</span>
            <span>&copy; {new Date().getFullYear()} UIPKGE</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default FooterDeveloperDenseGrid
