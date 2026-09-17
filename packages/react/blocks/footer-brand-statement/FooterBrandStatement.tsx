'use client'

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
import { Separator } from '@/components/ui/separator'

const sections = [
  { heading: 'Platform', links: ['Metric layer', 'Governance', 'Alerting', 'Embedding'] },
  { heading: 'Company', links: ['About', 'Careers', 'Customers', 'Press kit'] },
  { heading: 'Resources', links: ['Documentation', 'Guides', 'Benchmarks', 'Status'] },
]

export function FooterBrandStatement() {
  return (
    <footer data-slot="footer-brand-statement" className="border-border bg-background border-t">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <a href="#top" className="flex w-fit items-center gap-2 font-semibold tracking-tight">
          <Sparkles className="text-primary size-5" aria-hidden="true" />
          Northwind
        </a>

        {/* The statement is the only oversized type on the page. Keep it to one
            sentence; at this size a second one stops being read. */}
        <p className="mt-8 max-w-3xl text-2xl leading-tight font-medium tracking-tight text-balance sm:text-3xl">
          Every number your company acts on should have one definition, one owner, and a history you can read.
        </p>
        <p className="text-muted-foreground mt-4 max-w-xl text-sm leading-relaxed">
          That is the whole product. Everything else here is detail.
        </p>

        <Separator className="my-12" />

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {sections.map((section) => (
            <div key={section.heading}>
              <p className="text-muted-foreground/70 text-xs font-medium tracking-wide uppercase">{section.heading}</p>
              <ul className="mt-3 space-y-2">
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

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <span>© 2026 Northwind Data, Inc.</span>
            <a href="#privacy" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#terms" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="mailto:hello@northwind.example" className="hover:text-foreground transition-colors">
              hello@northwind.example
            </a>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <Badge variant="outline">SOC 2 Type II</Badge>
            <Badge variant="outline">GDPR</Badge>
            <Button variant="ghost" size="icon" className="size-8" aria-label="GitHub">
              <Github className="size-4" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8" aria-label="LinkedIn">
              <Linkedin className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
