'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Check, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export function ExitIntentNewsletter({ storageKey = 'uipkge:exit-newsletter-seen' }: { storageKey?: string }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const onPointerOut = (event: MouseEvent) => {
      // Top edge only: leaving sideways is usually the scrollbar or another window.
      if (event.relatedTarget || event.clientY > 4) return
      try {
        if (window.sessionStorage.getItem(storageKey) === '1') return
        window.sessionStorage.setItem(storageKey, '1')
      } catch {
        // Blocked storage: shows once more this page view, never in a loop.
      }
      setOpen(true)
      document.removeEventListener('mouseout', onPointerOut)
    }
    document.addEventListener('mouseout', onPointerOut)
    return () => document.removeEventListener('mouseout', onPointerOut)
  }, [storageKey])

  function subscribe(event: FormEvent) {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <div data-slot="exit-intent-newsletter">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <Badge variant="secondary" className="w-fit gap-1.5">
              <Mail className="size-3" aria-hidden="true" />
              Monthly notes
            </Badge>
            <DialogTitle className="mt-3 text-xl leading-snug text-balance">
              Not ready to trial? Take the writing instead
            </DialogTitle>
            <DialogDescription className="leading-relaxed">
              Last issue: “Why we version metric definitions instead of dashboards.” One email a month, no product
              announcements, unsubscribe in one click.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <form onSubmit={subscribe}>
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
            <p className="mt-2 min-h-5 text-xs" aria-live="polite">
              {submitted ? (
                <span className="text-success inline-flex items-center gap-1.5">
                  <Check className="size-3" aria-hidden="true" />
                  Check your inbox to confirm.
                </span>
              ) : (
                <span className="text-muted-foreground">8,400 subscribers, mostly data and finance engineers.</span>
              )}
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
