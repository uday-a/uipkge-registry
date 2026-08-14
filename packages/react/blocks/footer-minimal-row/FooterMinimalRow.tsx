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

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const links = [
  { label: 'Product', href: '#product' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'Terms', href: '#terms' },
]

export function FooterMinimalRow() {
  return (
    <footer data-slot="footer-minimal-row" className="border-border bg-background border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center">
        <a href="#top" className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight">
          <Sparkles className="text-primary size-4" aria-hidden="true" />
          Northwind
        </a>

        <Separator orientation="vertical" className="hidden h-4 sm:block" />

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Footer">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:ml-auto">
          <Button variant="ghost" size="icon" className="size-8" aria-label="GitHub">
            <Github className="size-4" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" aria-label="LinkedIn">
            <Linkedin className="size-4" aria-hidden="true" />
          </Button>
          <span className="text-muted-foreground ml-2 text-xs">© 2026 Northwind</span>
        </div>
      </div>
    </footer>
  )
}
