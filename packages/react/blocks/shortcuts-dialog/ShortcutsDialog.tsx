'use client'

import * as React from 'react'
import { Keyboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Kbd } from '@/components/ui/kbd'

export interface Shortcut {
  keys: string[]
  description: string
}

export interface ShortcutGroup {
  label: string
  shortcuts: Shortcut[]
}

export interface ShortcutsDialogProps {
  groups?: ShortcutGroup[]
  /** Render the built-in trigger button. */
  trigger?: boolean
  /** Show the 'Press Esc to close' footer hint. */
  footer?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  triggerSlot?: React.ReactNode
  className?: string
}

const defaultGroups: ShortcutGroup[] = [
  {
    label: 'Navigation',
    shortcuts: [
      { keys: ['G', 'I'], description: 'Go to inbox' },
      { keys: ['G', 'D'], description: 'Go to drafts' },
      { keys: ['⌘', 'K'], description: 'Open command menu' },
      { keys: ['⌥', '↑', '↓'], description: 'Move between items' },
    ],
  },
  {
    label: 'Actions',
    shortcuts: [
      { keys: ['C'], description: 'Compose new' },
      { keys: ['/'], description: 'Focus search' },
      { keys: ['⌘', 'S'], description: 'Save changes' },
      { keys: ['E'], description: 'Archive selection' },
    ],
  },
  {
    label: 'General',
    shortcuts: [
      { keys: ['?'], description: 'Show this dialog' },
      { keys: ['⇧', '?'], description: 'Show cheat sheet' },
      { keys: ['Esc'], description: 'Close dialogs' },
    ],
  },
]

export function ShortcutsDialog({
  groups = defaultGroups,
  trigger = true,
  footer = true,
  open,
  onOpenChange,
  triggerSlot,
  className,
}: ShortcutsDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open !== undefined ? open : internalOpen

  function setOpen(value: boolean) {
    if (open === undefined) setInternalOpen(value)
    onOpenChange?.(value)
  }

  return (
    <Dialog data-slot="shortcuts-dialog" open={isOpen} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Keyboard aria-hidden="true" />
            Shortcuts
            <Kbd>?</Kbd>
          </Button>
        </DialogTrigger>
      ) : (
        triggerSlot
      )}
      <DialogContent className={cn('max-w-lg', className)}>
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>Move faster without leaving the keyboard.</DialogDescription>
        </DialogHeader>
        <div className="grid max-h-[60vh] gap-x-8 gap-y-6 overflow-y-auto pr-1 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.label} className="space-y-2">
              <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">{group.label}</p>
              <ul className="divide-y">
                {group.shortcuts.map((shortcut) => (
                  <li key={shortcut.description} className="flex items-center justify-between gap-4 py-1.5">
                    <span className="text-sm">{shortcut.description}</span>
                    <span className="flex shrink-0 items-center gap-1">
                      {shortcut.keys.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {footer && (
          <DialogFooter className="justify-start">
            <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
              Press <Kbd>Esc</Kbd> to close
            </p>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
