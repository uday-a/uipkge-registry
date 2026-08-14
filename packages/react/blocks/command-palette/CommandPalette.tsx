'use client'

import * as React from 'react'
import { LayoutDashboard, FileText, Inbox, Settings, Users, KanbanSquare, Search, type LucideIcon } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

export interface CommandPaletteItem {
  label: string
  value?: string
  hint?: string
  icon?: LucideIcon
  onSelect?: () => void
}

export interface CommandPaletteGroup {
  heading: string
  items: CommandPaletteItem[]
}

export interface CommandPaletteProps {
  groups?: CommandPaletteGroup[]
  placeholder?: string
  triggerLabel?: string
  showTrigger?: boolean
  onSelect?: (item: CommandPaletteItem) => void
}

const defaultGroups: CommandPaletteGroup[] = [
  {
    heading: 'Navigate',
    items: [
      { label: 'Dashboard', hint: '/dashboard', icon: LayoutDashboard },
      { label: 'Inbox', hint: '/inbox', icon: Inbox },
      { label: 'Kanban', hint: '/kanban', icon: KanbanSquare },
      { label: 'Team', hint: '/team', icon: Users },
    ],
  },
  {
    heading: 'Settings',
    items: [
      { label: 'Profile', hint: '/profile', icon: FileText },
      { label: 'Settings', hint: '/settings', icon: Settings },
    ],
  },
]

export function CommandPalette({
  groups = defaultGroups,
  placeholder = 'Search pages, commands…',
  triggerLabel = 'Search pages, commands…',
  showTrigger = true,
  onSelect,
}: CommandPaletteProps) {
  const [open, setOpen] = React.useState(false)
  const [triggerShortcut] = React.useState(() => {
    if (typeof navigator === 'undefined') return '⌘K'
    return /Mac|iPhone|iPad/i.test(navigator.platform) ? '⌘K' : 'Ctrl K'
  })

  function pick(item: CommandPaletteItem) {
    setOpen(false)
    item.onSelect?.()
    onSelect?.(item)
  }

  React.useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [])

  return (
    <>
      {showTrigger && (
        <button
          type="button"
          className="bg-secondary/50 hover:bg-secondary text-muted-foreground focus-visible:ring-ring relative hidden h-8 w-full items-center gap-2 rounded-lg border border-transparent px-2.5 text-sm shadow-none transition-colors focus-visible:ring-1 focus-visible:outline-none sm:flex md:w-[220px] lg:w-[300px]"
          aria-label="Open command palette"
          onClick={() => setOpen(true)}
        >
          <Search className="size-3.5 shrink-0" />
          <span className="flex-1 truncate text-left">{triggerLabel}</span>
          <kbd className="bg-muted/80 text-muted-foreground pointer-events-none flex h-5 items-center justify-center rounded-md border px-1.5 font-mono text-xs font-medium">
            <span>{triggerShortcut}</span>
          </kbd>
        </button>
      )}

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Command palette"
        description="Search pages and run commands"
      >
        <CommandInput placeholder={placeholder} />
        <CommandList className="max-h-[480px]">
          <CommandEmpty>No matches.</CommandEmpty>
          {groups.map((group, gi) => (
            <React.Fragment key={group.heading}>
              <CommandGroup heading={group.heading}>
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <CommandItem
                      data-slot="command-palette"
                      key={`${group.heading}-${item.label}`}
                      value={`${group.heading} ${item.label} ${item.hint ?? ''}`}
                      onSelect={() => pick(item)}
                    >
                      {Icon && <Icon className="size-4" />}
                      <span>{item.label}</span>
                      {item.hint && <CommandShortcut className="text-muted-foreground/70">{item.hint}</CommandShortcut>}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
              {gi < groups.length - 1 && <CommandSeparator />}
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
