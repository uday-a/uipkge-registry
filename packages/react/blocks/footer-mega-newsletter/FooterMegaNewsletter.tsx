'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, Sparkles } from 'lucide-react'

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

const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
  </svg>
)

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const sections = [
  { heading: 'Product', links: ['Metric layer', 'Dashboards', 'Alerting', 'Embedding', 'Changelog'] },
  { heading: 'Solutions', links: ['Finance', 'RevOps', 'Analytics', 'Engineering'] },
  { heading: 'Developers', links: ['Documentation', 'API reference', 'CLI', 'Status'] },
  { heading: 'Company', links: ['About', 'Careers', 'Customers', 'Press kit'] },
  { heading: 'Legal', links: ['Privacy', 'Terms', 'DPA', 'Subprocessors'] },
]

export function FooterMegaNewsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function subscribe(event: FormEvent) {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <footer data-slot="footer-mega-newsletter" className="border-border bg-background border-t">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-12 lg:grid-cols-[22rem_1fr] lg:gap-16">
          <div>
            <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
              <Sparkles className="text-primary size-5" aria-hidden="true" />
              Northwind
            </a>
            <p className="text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed">
              One certified metric layer between your warehouse and everything downstream.
            </p>

            <form className="mt-6" onSubmit={subscribe}>
              <label htmlFor="footer-email" className="text-sm font-medium">
                Monthly engineering notes
              </label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="footer-email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="max-w-64"
                />
                <Button type="submit">
                  Subscribe
                  <ArrowRight className="ml-1.5 size-3.5" aria-hidden="true" />
                </Button>
              </div>
              {/* Status line reserves its own row, so confirming does not shift the columns. */}
              <p className="text-muted-foreground mt-2 min-h-5 text-xs">
                {submitted ? (
                  <span className="text-success inline-flex items-center gap-1.5">
                    <Check className="size-3" aria-hidden="true" />
                    Check your inbox to confirm.
                  </span>
                ) : (
                  <span>One email a month. Unsubscribe in one click.</span>
                )}
              </p>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {sections.map((section) => (
              <div key={section.heading}>
                <p className="text-muted-foreground/70 text-xs font-medium tracking-wide uppercase">
                  {section.heading}
                </p>
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
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <p className="text-muted-foreground text-xs">© 2026 Northwind Data, Inc. All rights reserved.</p>
          <Badge variant="outline" className="w-fit">
            SOC 2 Type II
          </Badge>
          <div className="flex items-center gap-1 sm:ml-auto">
            <Button variant="ghost" size="icon" className="size-8" aria-label="GitHub">
              <Github className="size-4" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8" aria-label="LinkedIn">
              <Linkedin className="size-4" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8" aria-label="YouTube">
              <Youtube className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
