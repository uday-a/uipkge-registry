'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Menu, Sparkles, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const STORAGE_KEY = 'uipkge:announcement-dismissed'

const links = [
  { label: 'Platform', href: '#platform' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Customers', href: '#customers' },
  { label: 'Docs', href: '#docs' },
]

export function HeaderAnnouncementStack() {
  // Rendered on the server and dismissed only on the client, so there is no
  // flash of a strip that then vanishes.
  const [dismissed, setDismissed] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      setDismissed(window.sessionStorage.getItem(STORAGE_KEY) === '1')
    } catch {
      setDismissed(false)
    }
  }, [])

  function dismiss() {
    setDismissed(true)
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // Blocked storage: the dismissal still holds for this page view.
    }
  }

  return (
    <div data-slot="header-announcement-stack" className="sticky top-0 z-40">
      {!dismissed && (
        <div className="border-border bg-muted/60 border-b backdrop-blur">
          <div className="mx-auto flex h-10 max-w-6xl items-center gap-3 px-6 text-sm">
            <Badge variant="secondary" className="shrink-0">
              New
            </Badge>
            <p className="min-w-0 truncate">
              Row-level scoping now evaluates against SCIM groups.{' '}
              <a href="#changelog" className="hover:text-foreground underline underline-offset-4">
                Read the changelog
              </a>
            </p>
            <ArrowRight className="text-muted-foreground hidden size-3.5 shrink-0 sm:block" aria-hidden="true" />
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto size-7 shrink-0"
              aria-label="Dismiss announcement"
              onClick={dismiss}
            >
              <X className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

      <header className="border-border bg-background/90 border-b backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
          <a href="#top" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
            <Sparkles className="text-primary size-5" aria-hidden="true" />
            Northwind
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
            <Button size="sm">Book a demo</Button>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto md:hidden" aria-label="Open navigation menu">
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 grid gap-1" aria-label="Mobile">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="hover:bg-muted rounded-md px-3 py-2 text-sm font-medium transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <Separator className="my-5" />
              <div className="grid gap-2">
                <Button variant="outline">Sign in</Button>
                <Button>Book a demo</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  )
}
