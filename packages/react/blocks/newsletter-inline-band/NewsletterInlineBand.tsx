'use client'

import { useState, type FormEvent } from 'react'
import { Check, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function NewsletterInlineBand() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function subscribe(event: FormEvent) {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section data-slot="newsletter-inline-band" className="border-border bg-muted/40 border-y">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:gap-12">
        <div className="min-w-0 lg:flex-1">
          <div className="flex items-center gap-2">
            <Mail className="text-muted-foreground size-4" aria-hidden="true" />
            <Badge variant="secondary">Monthly</Badge>
          </div>
          <p className="mt-2.5 text-lg leading-snug font-medium text-balance">
            Engineering notes on metric modelling, access control, and warehouse cost.
          </p>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Read by 8,400 data and finance engineers. One email a month, no product announcements.
          </p>
        </div>

        <form className="lg:w-[26rem] lg:shrink-0" onSubmit={subscribe}>
          <div className="flex gap-2">
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              placeholder="you@company.com"
              autoComplete="email"
              aria-label="Email address"
            />
            <Button type="submit" className="shrink-0">
              Subscribe
            </Button>
          </div>
          {/* Status row is reserved from first paint, so confirming does not
              nudge the band's height and shift the page under the cursor. */}
          <p className="mt-2 min-h-5 text-xs" aria-live="polite">
            {submitted ? (
              <span className="text-success inline-flex items-center gap-1.5">
                <Check className="size-3" aria-hidden="true" />
                Check your inbox to confirm.
              </span>
            ) : (
              <span className="text-muted-foreground">Unsubscribe in one click. We never share the list.</span>
            )}
          </p>
        </form>
      </div>
    </section>
  )
}
