'use client'

import * as React from 'react'
import { Boxes, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Header01() {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <header
      data-slot="header-01"
      className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <Boxes className="size-4" />
          </div>
          <span className="text-base font-semibold">Acme</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          <a href="#features" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            Pricing
          </a>
          <a href="#customers" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            Customers
          </a>
          <a href="#docs" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            Docs
          </a>
          <a href="#blog" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            Blog
          </a>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
          <Button size="sm">Start free trial</Button>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
                    <Boxes className="size-3.5" />
                  </div>
                  <span className="text-sm font-semibold">Acme</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Mobile">
                <a
                  href="#features"
                  className="hover:bg-muted rounded-md px-3 py-2 text-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="hover:bg-muted rounded-md px-3 py-2 text-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Pricing
                </a>
                <a
                  href="#customers"
                  className="hover:bg-muted rounded-md px-3 py-2 text-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Customers
                </a>
                <a
                  href="#docs"
                  className="hover:bg-muted rounded-md px-3 py-2 text-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Docs
                </a>
                <a
                  href="#blog"
                  className="hover:bg-muted rounded-md px-3 py-2 text-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Blog
                </a>
              </nav>
              <div className="flex flex-col gap-2 border-t p-4">
                <Button variant="outline" className="w-full">
                  Sign in
                </Button>
                <Button className="w-full">Start free trial</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
