'use client'

import { useEffect, useState } from 'react'
import { BarChart3, BookOpen, FileText, Menu, Search, Sparkles, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Kbd } from '@/components/ui/kbd'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const links = [
  { label: 'Product', href: '#product' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
]

const groups = [
  {
    heading: 'Documentation',
    items: [
      { icon: BookOpen, label: 'Connect a warehouse' },
      { icon: FileText, label: 'Define your first metric' },
      { icon: BarChart3, label: 'Publish a dashboard' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { icon: Users, label: 'Customer stories' },
      { icon: Sparkles, label: 'Changelog' },
    ],
  },
]

export function HeaderSearchCommand() {
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return
      event.preventDefault()
      setOpen((value) => !value)
    }
    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [])

  return (
    <header data-slot="header-search-command" className="border-border bg-background/90 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
          <Sparkles className="text-primary size-5" aria-hidden="true" />
          Halden
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

        {/* Trigger is a button, not an input: the real field lives in the dialog,
            so focus lands there and the shortcut hint stays visible until then. */}
        <button
          type="button"
          className="border-border bg-muted/40 text-muted-foreground hover:bg-muted focus-visible:ring-ring ml-auto flex h-9 w-full max-w-64 items-center gap-2 rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          onClick={() => setOpen(true)}
        >
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Search docs…</span>
          <Kbd className="ml-auto hidden sm:inline-flex">⌘K</Kbd>
        </button>

        <Separator orientation="vertical" className="hidden h-5 md:block" />
        <Button size="sm" className="hidden shrink-0 sm:inline-flex">
          Start free
        </Button>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 md:hidden" aria-label="Open navigation menu">
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
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <Separator className="my-5" />
            <div className="grid gap-2">
              <Button variant="outline">Sign in</Button>
              <Button>Start free</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search documentation, guides, and stories…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          {groups.map((group) => (
            <CommandGroup key={group.heading} heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem key={item.label} value={item.label}>
                  <item.icon className="text-muted-foreground mr-2 size-4" aria-hidden="true" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </header>
  )
}
