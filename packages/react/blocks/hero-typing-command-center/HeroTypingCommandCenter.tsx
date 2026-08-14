'use client'

import * as React from 'react'
import { Command, CornerDownLeft, FileCode, FolderGit2, Layers, Palette, Search, Sparkles, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface CommandAction {
  id: string
  title: string
  category: 'Components' | 'Themes' | 'Git' | 'Workflows'
  shortcut: string[]
  icon: React.ComponentType<{ className?: string }>
  description: string
  status: string
}

export interface HeroTypingCommandCenterProps {
  title?: string
  description?: string
  className?: string
}

const actions: CommandAction[] = [
  {
    id: 'add-pdp',
    title: 'Insert Product Detail Page',
    category: 'Components',
    shortcut: ['⌘', 'I', 'P'],
    icon: Layers,
    description: 'Adds flagship unbundled PDP with gallery, reviews & buy box',
    status: 'Ready to inject',
  },
  {
    id: 'toggle-dark',
    title: 'Toggle High-Contrast Dark Theme',
    category: 'Themes',
    shortcut: ['⌘', 'T'],
    icon: Palette,
    description: 'Switches active OKLCH tokens to studio obsidian mode',
    status: 'Instant update',
  },
  {
    id: 'git-branch',
    title: 'Checkout Release Branch: v2.4.0',
    category: 'Git',
    shortcut: ['⌘', 'G', 'B'],
    icon: FolderGit2,
    description: 'Switches workspace to staging pipeline branch',
    status: 'Clean working tree',
  },
  {
    id: 'sync-registry',
    title: 'Synchronize Dual-Framework ASTs',
    category: 'Workflows',
    shortcut: ['⌘', 'S', 'Y'],
    icon: FileCode,
    description: 'Generates parity manifests between Vue 3.5 and React 19',
    status: 'Verified 100% parity',
  },
  {
    id: 'run-audit',
    title: 'Trigger Automated Craft Audit',
    category: 'Workflows',
    shortcut: ['⌘', 'A', 'U'],
    icon: Zap,
    description: 'Validates semantic scales, AA contrast and eliminates design slop',
    status: 'Zero regressions',
  },
]

export function HeroTypingCommandCenter({
  title = 'Execute workflows at the speed of thought with keyboard command palette.',
  description = 'Instant component insertion, theme switching, git branches, and automated deployment pipelines driven by zero-latency hotkeys.',
  className,
}: HeroTypingCommandCenterProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [executedAction, setExecutedAction] = React.useState<CommandAction | null>(null)

  const filteredActions = React.useMemo(() => {
    if (!searchQuery.trim()) return actions
    const q = searchQuery.toLowerCase()
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q),
    )
  }, [searchQuery])

  function execute(action: CommandAction) {
    setExecutedAction(action)
    setTimeout(() => {
      setExecutedAction(null)
    }, 2500)
  }

  return (
    <section
      data-slot="hero-typing-command-center"
      className={cn('bg-background relative overflow-hidden py-16 sm:py-24 lg:py-28', className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left: Headline & Key Advantages (5 Cols) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="border-border/80 bg-secondary/60 text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs">
              <Command className="text-primary size-3.5" />
              <span>Keyboard Ergonomics &bull; Zero Latency</span>
            </div>

            <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>

            <p className="text-muted-foreground text-base sm:text-lg">{description}</p>

            {/* Hotkey Highlights Grid */}
            <div className="border-border bg-muted/20 grid grid-cols-2 gap-3 rounded-xl border p-4 text-xs">
              <div className="space-y-1">
                <div className="text-muted-foreground font-medium">Global Trigger</div>
                <div className="flex items-center gap-1 font-mono">
                  <kbd className="border-border bg-card rounded border px-1.5 py-0.5 shadow-2xs">⌘</kbd>
                  <kbd className="border-border bg-card rounded border px-1.5 py-0.5 shadow-2xs">K</kbd>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground font-medium">Quick Insert</div>
                <div className="flex items-center gap-1 font-mono">
                  <kbd className="border-border bg-card rounded border px-1.5 py-0.5 shadow-2xs">⌘</kbd>
                  <kbd className="border-border bg-card rounded border px-1.5 py-0.5 shadow-2xs">I</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Command Palette Hub (7 Cols) */}
          <div className="lg:col-span-7">
            <Card className="border-border bg-card shadow-lg">
              {/* Search Header */}
              <div className="border-border flex items-center gap-3 border-b px-4 py-3">
                <Search className="text-muted-foreground size-4 shrink-0" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Type a command or search actions (e.g., 'insert', 'git', 'theme')..."
                  className="placeholder:text-muted-foreground text-foreground flex-1 bg-transparent text-sm outline-none"
                />
                <div className="text-muted-foreground flex items-center gap-1 font-mono text-xs">
                  <kbd className="border-border bg-muted rounded border px-1.5 py-0.5 text-xs">ESC</kbd>
                </div>
              </div>

              {/* Command List */}
              <CardContent className="space-y-1 p-2">
                {filteredActions.map((action, idx) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={action.id}
                      type="button"
                      className={cn(
                        'group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all',
                        selectedIndex === idx
                          ? 'border-primary/30 bg-accent text-accent-foreground border'
                          : 'hover:bg-muted/50 text-foreground border border-transparent',
                      )}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => execute(action)}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="border-border bg-background flex size-8 shrink-0 items-center justify-center rounded-md border shadow-2xs">
                          <Icon className="text-primary size-4" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-xs font-semibold">{action.title}</span>
                            <Badge variant="outline" className="h-4.5 px-1.5 text-xs">
                              {action.category}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground truncate text-xs">{action.description}</p>
                        </div>
                      </div>

                      {/* Shortcut Badge Group */}
                      <div className="ml-3 flex shrink-0 items-center gap-1 font-mono text-xs">
                        {action.shortcut.map((key, kIdx) => (
                          <kbd
                            key={kIdx}
                            className="border-border bg-background rounded border px-1.5 py-0.5 text-xs shadow-2xs"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </button>
                  )
                })}
              </CardContent>

              {/* Status Footer */}
              <div className="border-border bg-muted/30 flex items-center justify-between border-t px-4 py-2.5 text-xs">
                <div className="text-muted-foreground flex items-center gap-2">
                  <CornerDownLeft className="size-3.5" />
                  <span>
                    Press <strong>Enter</strong> to run
                  </span>
                </div>
                {executedAction ? (
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="size-3.5" />
                    <span>Executed: {executedAction.title}</span>
                  </div>
                ) : (
                  <div className="text-muted-foreground font-mono text-xs">
                    {filteredActions.length} actions available
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
