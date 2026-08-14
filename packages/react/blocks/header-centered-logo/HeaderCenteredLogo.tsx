'use client'

import { useState } from 'react'
import { Menu, ShoppingBag, Sparkles, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const leftLinks = [
  { label: 'Collections', href: '#collections' },
  { label: 'New in', href: '#new' },
  { label: 'Studio', href: '#studio' },
]
const rightLinks = [
  { label: 'Journal', href: '#journal' },
  { label: 'Stockists', href: '#stockists' },
  { label: 'Contact', href: '#contact' },
]

const linkClass =
  'text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none'

export function HeaderCenteredLogo() {
  const [open, setOpen] = useState(false)

  return (
    <header data-slot="header-centered-logo" className="border-border bg-background border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
        {/* Equal-basis flanks keep the wordmark optically centred regardless of
            how long the link labels are. */}
        <nav className="hidden flex-1 basis-0 items-center gap-1 lg:flex" aria-label="Primary left">
          {leftLinks.map((link) => (
            <a key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </a>
          ))}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation menu">
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 grid gap-1" aria-label="Mobile">
              {[...leftLinks, ...rightLinks].map((link) => (
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
            <Button className="w-full">Account</Button>
          </SheetContent>
        </Sheet>

        <a
          href="#top"
          className="mx-auto flex items-center gap-2 text-base font-semibold tracking-[0.18em] uppercase lg:mx-6"
        >
          <Sparkles className="text-primary size-4" aria-hidden="true" />
          Halden
        </a>

        <nav className="hidden flex-1 basis-0 items-center justify-end gap-1 lg:flex" aria-label="Primary right">
          {rightLinks.map((link) => (
            <a key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 lg:ml-4">
          <Button variant="ghost" size="icon" aria-label="Account">
            <User className="size-4" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Bag">
            <ShoppingBag className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  )
}
