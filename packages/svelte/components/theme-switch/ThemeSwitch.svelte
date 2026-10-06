<script lang="ts" module>
  import type { Component } from 'svelte'

  export type ThemeSwitchTheme = 'light' | 'dark' | 'system' | 'black'
  export type ThemeSwitchVariant = 'cards' | 'icons' | 'icon-only' | 'dropdown' | 'pill' | 'pill-4' | 'switch'

  export interface ThemeSwitchProps {
    value?: ThemeSwitchTheme
    variant?: ThemeSwitchVariant
    title?: string
    description?: string
    /** Wipe the new theme in from the clicked control. Ignored without View Transition support or with reduced motion. */
    viewTransition?: boolean
    class?: string
    /** Called with the new theme after every change. */
    onValueChange?: (value: ThemeSwitchTheme) => void
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { cn } from '$lib/utils'
  import { ChevronDown, Monitor, Moon, Palette, Sparkles, Sun } from '@lucide/svelte'

  const ICONS: Record<ThemeSwitchTheme, Component> = {
    light: Sun,
    dark: Moon,
    system: Monitor,
    black: Sparkles,
  }

  const LABELS: Record<ThemeSwitchTheme, string> = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    black: 'Black',
  }

  const VARIANT_OPTIONS: Record<ThemeSwitchVariant, ThemeSwitchTheme[]> = {
    cards: ['light', 'dark', 'system'],
    icons: ['light', 'dark', 'system'],
    'icon-only': ['light', 'dark'],
    dropdown: ['light', 'dark', 'system'],
    pill: ['light', 'dark', 'system'],
    'pill-4': ['system', 'light', 'dark', 'black'],
    switch: ['light', 'dark'],
  }

  let {
    value = $bindable('system'),
    variant = 'cards',
    title,
    description,
    viewTransition = true,
    class: className,
    onValueChange,
  }: ThemeSwitchProps = $props()

  const options = $derived(VARIANT_OPTIONS[variant])
  const activeIndex = $derived.by(() => {
    const i = options.indexOf(value)
    return i === -1 ? 0 : i
  })

  const indicatorStyle = $derived(
    `width: calc((100% - 4px) / ${options.length}); transform: translateX(calc(${activeIndex} * 100%));`,
  )

  const switchThumbStyle = $derived(`transform: translateX(${value === 'dark' ? '36px' : '4px'});`)

  /**
   * Swap the theme inside a View Transition so the new theme wipes in as a
   * circle growing from the control that was clicked. The keyframes live in
   * tailwind.css behind `html[data-uipkge-theme-reveal]`, so this never
   * hijacks a consumer's own view transitions.
   *
   * Falls back to a plain emit when `view-transition` is off, the browser has
   * no startViewTransition, or the user prefers reduced motion. The theme is
   * applied by whoever owns the model (useTheme / next-themes), so the swap
   * awaits tick() to let that watcher run inside the transition.
   */
  type ViewTransitionDocument = Document & {
    startViewTransition?: (callback: () => unknown) => { finished: Promise<void> }
  }

  // The dropdown variant fires both select and click paths; without this a second
  // startViewTransition would abort the first mid-wipe.
  let revealing = false

  async function withThemeReveal(event: MouseEvent | undefined, swap: () => void) {
    const startViewTransition = (document as ViewTransitionDocument).startViewTransition?.bind(document)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!viewTransition || !startViewTransition || reduceMotion) {
      swap()
      return
    }
    if (revealing) return
    revealing = true

    const root = document.documentElement
    const x = event?.clientX ?? window.innerWidth / 2
    const y = event?.clientY ?? window.innerHeight / 2
    // Radius that still covers the farthest corner from the click.
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    root.style.setProperty('--uipkge-theme-x', `${x}px`)
    root.style.setProperty('--uipkge-theme-y', `${y}px`)
    root.style.setProperty('--uipkge-theme-r', `${radius}px`)
    root.setAttribute('data-uipkge-theme-reveal', '')

    try {
      await startViewTransition(async () => {
        swap()
        await tick()
      }).finished
    } finally {
      root.removeAttribute('data-uipkge-theme-reveal')
      revealing = false
    }
  }

  function set(t: ThemeSwitchTheme, event?: MouseEvent) {
    withThemeReveal(event, () => {
      value = t
      onValueChange?.(t)
    })
  }

  function cycle(event?: MouseEvent) {
    const next = options[(activeIndex + 1) % options.length]
    if (next)
      withThemeReveal(event, () => {
        value = next
        onValueChange?.(next)
      })
  }

  let dropdownOpen = $state(false)

  /** Close the hand-rolled dropdown on outside pointer-down or Escape (no bits-ui). */
  function dismissable(node: HTMLElement) {
    function onPointerDown(e: PointerEvent) {
      if (!node.contains(e.target as Node)) dropdownOpen = false
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') dropdownOpen = false
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return {
      destroy() {
        document.removeEventListener('pointerdown', onPointerDown)
        document.removeEventListener('keydown', onKeyDown)
      },
    }
  }

  function selectDropdown(t: ThemeSwitchTheme, event: MouseEvent) {
    dropdownOpen = false
    set(t, event)
  }
</script>

<!-- Cards: full section card with 3-button grid (default). Hand-rolled card
     (no section-card dependency): header row + bordered body. -->
{#if variant === 'cards'}
  <section
    data-uipkge=""
    data-slot="theme-switch"
    data-variant="cards"
    class={cn('bg-card rounded-lg border p-4 shadow-xs', className)}
  >
    <div class="mb-3 flex items-start justify-between gap-2">
      <div>
        <h3 class="text-sm font-semibold">{title ?? 'Appearance'}</h3>
        <p class="text-muted-foreground text-xs">{description ?? 'Choose your interface theme.'}</p>
      </div>
      <Palette class="text-muted-foreground size-5" aria-hidden="true" />
    </div>
    <div class="grid grid-cols-3 gap-2" role="radiogroup" aria-label={title ?? 'Theme'}>
      {#each options as t (t)}
        {@const Icon = ICONS[t]}
        <button
          type="button"
          role="radio"
          aria-checked={value === t}
          class={cn(
            'focus-visible:ring-ring rounded-md border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:outline-none',
            value === t ? 'border-primary ring-primary bg-primary/5 ring-1' : 'border-border hover:bg-muted/50',
          )}
          onclick={(e) => set(t, e)}
        >
          <Icon class="text-muted-foreground mb-2 size-4" aria-hidden="true" />
          <p class="text-xs font-medium">{LABELS[t]}</p>
        </button>
      {/each}
    </div>
  </section>

  <!-- Icons: compact 3-icon segmented row, no labels -->
{:else if variant === 'icons'}
  <div
    role="radiogroup"
    aria-label={title ?? 'Theme'}
    data-uipkge=""
    data-slot="theme-switch"
    data-variant="icons"
    class={cn('border-border bg-card inline-flex items-center gap-0.5 rounded-md border p-0.5', className)}
  >
    {#each options as t (t)}
      {@const Icon = ICONS[t]}
      <button
        type="button"
        role="radio"
        aria-checked={value === t}
        aria-label={LABELS[t]}
        class={cn(
          'focus-visible:ring-ring grid size-7 place-items-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none',
          value === t
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
        onclick={(e) => set(t, e)}
      >
        <Icon class="size-4" aria-hidden="true" />
      </button>
    {/each}
  </div>

  <!-- Icon-only: header-grade icon button. No border, ghost background,
       rounded-lg to match adjacent header affordances (notification
       bell, profile avatar). A direct icon swap (no rotate+fade
       transition) reads cleaner and never flickers empty. -->
{:else if variant === 'icon-only'}
  {@const CycleIcon = ICONS[options.includes(value) ? value : 'light']}
  <button
    type="button"
    aria-label={LABELS[value] ?? 'Theme'}
    data-uipkge=""
    data-slot="theme-switch"
    data-variant="icon-only"
    class={cn(
      'text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring inline-flex size-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none',
      className,
    )}
    onclick={(e) => cycle(e)}
  >
    <CycleIcon class="size-4" aria-hidden="true" />
  </button>

  <!-- Dropdown: trigger button → menu of states (hand-rolled, no dropdown-menu dep) -->
{:else if variant === 'dropdown'}
  {@const TriggerIcon = ICONS[value] ?? Monitor}
  <div use:dismissable data-uipkge="" data-slot="theme-switch" data-variant="dropdown" class="relative inline-block">
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={dropdownOpen}
      class={cn(
        'border-border bg-card hover:bg-muted focus-visible:ring-ring inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      onclick={() => (dropdownOpen = !dropdownOpen)}
    >
      <TriggerIcon class="size-4" aria-hidden="true" />
      <span>{LABELS[value] ?? value}</span>
      <ChevronDown class="size-3 opacity-60" aria-hidden="true" />
    </button>
    {#if dropdownOpen}
      <div
        role="menu"
        aria-label={title ?? 'Theme'}
        class="bg-popover text-popover-foreground absolute right-0 z-50 mt-1 min-w-[140px] rounded-md border p-1 shadow-md"
      >
        {#each options as t (t)}
          {@const ItemIcon = ICONS[t]}
          <button
            type="button"
            role="menuitemradio"
            aria-checked={value === t}
            class={cn(
              'hover:bg-accent focus-visible:ring-ring flex w-full items-center rounded-sm px-2 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
              value === t && 'bg-accent/50',
            )}
            onclick={(e) => selectDropdown(t, e)}
          >
            <ItemIcon class="mr-2 size-4" aria-hidden="true" />
            <span>{LABELS[t]}</span>
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Pill / Pill-4: equal segments with sliding indicator -->
{:else if variant === 'pill' || variant === 'pill-4'}
  <div
    role="radiogroup"
    aria-label={title ?? 'Theme'}
    data-uipkge=""
    data-slot="theme-switch"
    data-variant={variant}
    class={cn('border-border bg-card relative inline-flex w-full max-w-md rounded-full border p-0.5', className)}
  >
    <span
      aria-hidden="true"
      class="bg-primary pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 rounded-full transition-transform duration-300 ease-out"
      style={indicatorStyle}
    ></span>
    {#each options as t (t)}
      {@const Icon = ICONS[t]}
      <button
        type="button"
        role="radio"
        aria-checked={value === t}
        aria-label={LABELS[t]}
        class={cn(
          'focus-visible:ring-ring relative z-[1] inline-flex h-7 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
          value === t ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
        )}
        onclick={(e) => set(t, e)}
      >
        <Icon class="size-3.5" aria-hidden="true" />
        <span>{LABELS[t]}</span>
      </button>
    {/each}
  </div>

  <!-- Switch: iOS-style 2-state toggle with thumb that slides -->
{:else if variant === 'switch'}
  <button
    type="button"
    role="switch"
    aria-checked={value === 'dark'}
    aria-label={LABELS[value] ?? 'Theme'}
    data-uipkge=""
    data-slot="theme-switch"
    data-variant="switch"
    class={cn(
      'border-border focus-visible:ring-ring relative inline-flex h-8 w-16 items-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none',
      value === 'dark' ? 'bg-primary' : 'bg-muted',
      className,
    )}
    onclick={(e) => set(value === 'dark' ? 'light' : 'dark', e)}
  >
    <Sun
      class={cn('text-warning absolute left-1.5 size-4 transition-opacity', value === 'dark' ? 'opacity-30' : 'opacity-100')}
      aria-hidden="true"
    />
    <Moon
      class={cn(
        'text-muted-foreground absolute right-1.5 size-4 transition-opacity',
        value === 'light' ? 'opacity-30' : 'opacity-100',
      )}
      aria-hidden="true"
    />
    <span
      aria-hidden="true"
      class="bg-card border-border absolute size-6 rounded-full border shadow transition-transform duration-300 ease-out"
      style={switchThumbStyle}
    ></span>
  </button>
{/if}
