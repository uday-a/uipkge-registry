'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Menu, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const links = [
  { label: 'Product', href: '#product' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Customers', href: '#customers' },
  { label: 'Docs', href: '#docs' },
]

export function HeaderFloatingPill() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)
  // Measured from the live element, so the indicator fits any label length or
  // font — no hard-coded widths to drift out of sync with the copy.
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const measure = useCallback(
    (index = active) => {
      const el = navRef.current?.querySelectorAll<HTMLElement>('[data-pill-link]')[index]
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
    },
    [active],
  )

  useEffect(() => {
    measure()
    const nav = navRef.current
    if (!nav || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => measure())
    observer.observe(nav)
    return () => observer.disconnect()
  }, [measure])

  return (
    <div data-slot="header-floating-pill" className="pointer-events-none sticky top-0 z-40 px-4 pt-4">
      <header className="border-border bg-card/85 pointer-events-auto mx-auto flex h-14 max-w-4xl items-center gap-3 rounded-full border px-3 shadow-sm backdrop-blur">
        <a href="#top" className="flex shrink-0 items-center gap-2 pl-2 font-semibold tracking-tight">
          <Sparkles className="text-primary size-4" aria-hidden="true" />
          Verity
        </a>

        <nav ref={navRef} className="relative hidden items-center md:flex" aria-label="Primary">
          <span
            className="bg-muted absolute inset-y-1 rounded-full transition-all duration-200 ease-out"
            style={{ left: `${indicator.left}px`, width: `${indicator.width}px` }}
            aria-hidden="true"
          />
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              data-pill-link
              className={`focus-visible:ring-ring relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                index === active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-current={index === active ? 'page' : undefined}
              onMouseEnter={() => measure(index)}
              onMouseLeave={() => measure()}
              onFocus={() => measure(index)}
              onBlur={() => measure()}
              onClick={() => setActive(index)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button size="sm" className="ml-auto rounded-full">
          Start free
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full md:hidden" aria-label="Open navigation menu">
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top">
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
          </SheetContent>
        </Sheet>
      </header>
    </div>
  )
}
