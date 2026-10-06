<script lang="ts" module>
  import type { Component } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SpeedDialAction {
    icon: Component<Record<string, any>>
    label: string
    handler?: () => void
    disabled?: boolean
    class?: string
  }

  export type SpeedDialDirection = 'up' | 'down' | 'left' | 'right'
  export type SpeedDialTrigger = 'click' | 'hover'
  export type SpeedDialPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center' | 'inline'

  export interface SpeedDialProps extends HTMLAttributes<HTMLDivElement> {
    actions: SpeedDialAction[]
    /** Main FAB icon. Defaults to Plus. */
    icon?: Component<Record<string, any>>
    /** Accessible label for the main FAB. */
    label?: string
    direction?: SpeedDialDirection
    trigger?: SpeedDialTrigger
    /** Close the dial after an action is triggered. */
    closeOnAction?: boolean
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
    position?: SpeedDialPosition
    /** Use absolute instead of fixed positioning (for contained dials). */
    absolute?: boolean
    disabled?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { Plus } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    actions,
    icon,
    label,
    direction = 'up',
    trigger = 'click',
    closeOnAction = true,
    variant = 'default',
    position = 'bottom-right',
    absolute = false,
    disabled = false,
    children,
    ref = $bindable(null),
    ...restProps
  }: SpeedDialProps = $props()

  let open = $state(false)
  let rootEl = $state<HTMLDivElement | null>(null)
  let hoverTimer: ReturnType<typeof setTimeout> | null = null

  $effect(() => {
    ref = rootEl
  })

  function clearHoverTimer() {
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      hoverTimer = null
    }
  }

  function onTriggerEnter() {
    if (disabled || trigger !== 'hover') return
    clearHoverTimer()
    open = true
  }

  function scheduleClose() {
    if (trigger !== 'hover') return
    clearHoverTimer()
    hoverTimer = setTimeout(() => (open = false), 150)
  }

  function onTriggerClick() {
    if (disabled || trigger !== 'click') return
    open = !open
  }

  function runAction(action: SpeedDialAction) {
    if (action.disabled) return
    action.handler?.()
    if (closeOnAction) open = false
  }

  // Click-trigger parity with popover: dismiss on outside click / Escape.
  $effect(() => {
    if (!open || trigger !== 'click') return
    function onPointerDown(event: PointerEvent) {
      if (rootEl && !rootEl.contains(event.target as Node)) open = false
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') open = false
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      clearHoverTimer()
    }
  })

  const positionClass = $derived.by(() => {
    if (position === 'inline') return 'relative inline-flex'
    const corner = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6',
      'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
      inline: '',
    }[position]
    return cn(absolute ? 'absolute' : 'fixed', corner, 'z-50')
  })

  const panelClass = $derived.by(() => {
    switch (direction) {
      case 'up':
        return 'bottom-full left-1/2 mb-3 -translate-x-1/2 flex-col'
      case 'down':
        return 'top-full left-1/2 mt-3 -translate-x-1/2 flex-col'
      case 'left':
        return 'right-full top-1/2 mr-3 -translate-y-1/2 flex-row'
      case 'right':
        return 'left-full top-1/2 ml-3 -translate-y-1/2 flex-row'
    }
  })

  // FAB trigger styling mirrors fabVariants (default size) 1:1; inlined
  // because fab has no Svelte port yet — keep in sync if fab changes.
  const fabVariantClass = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-white hover:bg-destructive/90',
    outline:
      'border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
  } as const

  const TriggerIcon = $derived(icon ?? Plus)
</script>

<!-- Hover handlers only mirror the trigger's hover intent; all actions are real buttons. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={rootEl}
  data-uipkge=""
  data-slot="speed-dial"
  data-state={open ? 'open' : 'closed'}
  data-direction={direction}
  class={cn(positionClass, className)}
  onmouseenter={onTriggerEnter}
  onmouseleave={scheduleClose}
  {...restProps}
>
  <button
    type="button"
    data-uipkge=""
    data-slot="speed-dial-trigger"
    data-variant={variant}
    disabled={disabled}
    aria-label={label || 'Quick actions'}
    aria-expanded={open}
    aria-haspopup="menu"
    class={cn(
      "inline-flex items-center justify-center gap-2 rounded-full font-medium shadow-lg outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] active:scale-95 touch-manipulation [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6 disabled:pointer-events-none disabled:opacity-50",
      fabVariantClass[variant],
      'size-14',
      'transition-[color,background-color,box-shadow,transform,scale,translate,rotate] duration-200',
      open && 'rotate-45',
    )}
    onclick={onTriggerClick}
  >
    <TriggerIcon />
  </button>

  {#if open}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      data-slot="speed-dial-content"
      class={cn('absolute z-50 flex items-center gap-3', panelClass)}
      onmouseenter={clearHoverTimer}
      onmouseleave={scheduleClose}
    >
      {#each actions as action, i (action.label)}
        {@const ActionIcon = action.icon}
        <button
          type="button"
          data-slot="speed-dial-action"
          disabled={action.disabled}
          aria-label={action.label}
          style="animation-delay: {i * 40}ms"
          class={cn(
            "group/speed-dial-item bg-background text-foreground hover:bg-accent hover:text-accent-foreground motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 focus-visible:ring-ring/50 inline-flex size-12 items-center justify-center rounded-full border shadow-md transition-colors outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
            action.class,
          )}
          onclick={() => runAction(action)}
        >
          <ActionIcon />
          <span class="sr-only">{action.label}</span>
        </button>
      {/each}
    </div>
  {/if}
  {@render children?.()}
</div>
