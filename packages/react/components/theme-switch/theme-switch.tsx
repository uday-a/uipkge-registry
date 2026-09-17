'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { ChevronDown, Monitor, Moon, Palette, Sparkles, Sun, type LucideIcon } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

type Theme = 'light' | 'dark' | 'system' | 'black'
type Variant = 'cards' | 'icons' | 'icon-only' | 'dropdown' | 'pill' | 'pill-4' | 'switch'

const ICONS: Record<Theme, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
  black: Sparkles,
}

const LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  black: 'Black',
}

const VARIANT_OPTIONS: Record<Variant, Theme[]> = {
  cards: ['light', 'dark', 'system'],
  icons: ['light', 'dark', 'system'],
  'icon-only': ['light', 'dark'],
  dropdown: ['light', 'dark', 'system'],
  pill: ['light', 'dark', 'system'],
  'pill-4': ['system', 'light', 'dark', 'black'],
  switch: ['light', 'dark'],
}

export interface ThemeSwitchProps {
  /** Controlled value. When omitted, falls back to next-themes' `theme`. */
  value?: Theme
  onValueChange?: (theme: Theme) => void
  variant?: Variant
  title?: string
  description?: string
  className?: string
}

const ThemeSwitch = React.forwardRef<HTMLDivElement, ThemeSwitchProps>(
  ({ value, onValueChange, variant = 'cards', title, description, className }, ref) => {
    const { theme, setTheme } = useTheme()
    const modelValue = (value ?? (theme as Theme) ?? 'system') as Theme

    const options = VARIANT_OPTIONS[variant]
    const activeIndex = React.useMemo(() => {
      const i = options.indexOf(modelValue)
      return i === -1 ? 0 : i
    }, [options, modelValue])

    const indicatorStyle: React.CSSProperties = {
      width: `calc((100% - 4px) / ${options.length})`,
      transform: `translateX(calc(${activeIndex} * 100%))`,
    }

    function set(t: Theme) {
      if (onValueChange) onValueChange(t)
      else setTheme(t)
    }
    function cycle() {
      const next = options[(activeIndex + 1) % options.length]
      if (next) set(next)
    }

    // Cards: full SectionCard with 3-button grid (default)
    if (variant === 'cards') {
      return (
        <SectionCard
          ref={ref}
          title={title ?? 'Appearance'}
          description={description ?? 'Choose your interface theme.'}
          className={className}
          headerAction={<Palette className="text-muted-foreground size-5" />}
        >
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={title ?? 'Theme'}>
            {options.map((t) => {
              const Icon = ICONS[t]
              return (
                <button
                  type="button"
                  key={t}
                  role="radio"
                  aria-checked={modelValue === t}
                  className={[
                    'focus-visible:ring-ring rounded-md border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:outline-none',
                    modelValue === t
                      ? 'border-primary ring-primary bg-primary/5 ring-1'
                      : 'border-border hover:bg-muted/50',
                  ].join(' ')}
                  onClick={() => set(t)}
                >
                  <Icon className="text-muted-foreground mb-2 size-4" aria-hidden="true" />
                  <p className="text-xs font-medium">{LABELS[t]}</p>
                </button>
              )
            })}
          </div>
        </SectionCard>
      )
    }

    // Icons: compact 3-icon segmented row, no labels
    if (variant === 'icons') {
      return (
        <div
          ref={ref}
          role="radiogroup"
          aria-label={title ?? 'Theme'}
          className={['border-border bg-card inline-flex items-center gap-0.5 rounded-md border p-0.5', className]
            .filter(Boolean)
            .join(' ')}
        >
          {options.map((t) => {
            const Icon = ICONS[t]
            return (
              <button
                type="button"
                key={t}
                role="radio"
                aria-checked={modelValue === t}
                aria-label={LABELS[t]}
                className={[
                  'focus-visible:ring-ring grid size-7 place-items-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  modelValue === t
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')}
                onClick={() => set(t)}
              >
                <Icon className="size-4" aria-hidden="true" />
              </button>
            )
          })}
        </div>
      )
    }

    // Icon-only: header-grade icon button.
    if (variant === 'icon-only') {
      const Icon = ICONS[modelValue]
      return (
        <button
          type="button"
          ref={ref as React.Ref<HTMLButtonElement>}
          aria-label={LABELS[modelValue]}
          className={[
            'text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring inline-flex size-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={cycle}
        >
          <Icon className="size-4" aria-hidden="true" />
        </button>
      )
    }

    // Dropdown: trigger button → menu of states
    if (variant === 'dropdown') {
      const TriggerIcon = ICONS[modelValue]
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={[
                'border-border bg-card hover:bg-muted focus-visible:ring-ring inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none',
                className,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <TriggerIcon className="size-4" aria-hidden="true" />
              <span>{LABELS[modelValue]}</span>
              <ChevronDown className="size-3 opacity-60" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[140px]">
            {options.map((t) => {
              const Icon = ICONS[t]
              return (
                <DropdownMenuItem key={t} onSelect={() => set(t)} onClick={() => set(t)}>
                  <Icon className="mr-2 size-4" aria-hidden="true" />
                  <span>{LABELS[t]}</span>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    // Pill / Pill-4: equal segments with sliding indicator
    if (variant === 'pill' || variant === 'pill-4') {
      return (
        <div
          ref={ref}
          role="radiogroup"
          aria-label={title ?? 'Theme'}
          className={['border-border bg-card relative inline-flex w-full max-w-md rounded-full border p-0.5', className]
            .filter(Boolean)
            .join(' ')}
        >
          <span
            aria-hidden
            className="bg-primary pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 rounded-full transition-transform duration-300 ease-out"
            style={indicatorStyle}
          />
          {options.map((t) => {
            const Icon = ICONS[t]
            return (
              <button
                type="button"
                key={t}
                role="radio"
                aria-checked={modelValue === t}
                aria-label={LABELS[t]}
                className={[
                  'focus-visible:ring-ring relative z-[1] inline-flex h-7 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  modelValue === t ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                ].join(' ')}
                onClick={() => set(t)}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                <span>{LABELS[t]}</span>
              </button>
            )
          })}
        </div>
      )
    }

    // Switch: iOS-style 2-state toggle with thumb that slides
    return (
      <button
        type="button"
        ref={ref as React.Ref<HTMLButtonElement>}
        role="switch"
        aria-checked={modelValue === 'dark'}
        aria-label={LABELS[modelValue]}
        className={[
          'border-border focus-visible:ring-ring relative inline-flex h-8 w-16 items-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none',
          modelValue === 'dark' ? 'bg-primary' : 'bg-muted',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => set(modelValue === 'dark' ? 'light' : 'dark')}
      >
        <Sun
          className={[
            'text-warning absolute left-1.5 size-4 transition-opacity',
            modelValue === 'dark' ? 'opacity-30' : 'opacity-100',
          ].join(' ')}
          aria-hidden="true"
        />
        <Moon
          className={[
            'text-muted-foreground absolute right-1.5 size-4 transition-opacity',
            modelValue === 'light' ? 'opacity-30' : 'opacity-100',
          ].join(' ')}
          aria-hidden="true"
        />
        <span
          aria-hidden
          className="bg-card border-border absolute size-6 rounded-full border shadow transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${modelValue === 'dark' ? '36px' : '4px'})` }}
        />
      </button>
    )
  },
)
ThemeSwitch.displayName = 'ThemeSwitch'

export { ThemeSwitch }
