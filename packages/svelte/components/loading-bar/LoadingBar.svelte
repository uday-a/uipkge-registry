<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface LoadingBarProps extends HTMLAttributes<HTMLDivElement> {
    /** 0–100 progress value. Bind it or drive via `createLoadingBar`. */
    value?: number
    /** Bar color. Accepts any CSS color value. */
    color?: string
    /** Bar height in px. */
    height?: number
    /** Indeterminate sliding animation (ignores value). */
    indeterminate?: boolean
    /** Anchor the bar to the top or bottom of the viewport. */
    position?: 'top' | 'bottom'
    /** Show a spinner at the trailing edge of the bar. */
    spinner?: boolean
    /** Error state tints the bar. */
    error?: boolean
    /** Hide the bar entirely (e.g. when finished). */
    hidden?: boolean
    /** Fires when the bar reaches 100 via `finish()` / `fail()`. */
    onfinish?: () => void
    ref?: HTMLDivElement | null
  }

  /** Imperative handle — grab it with `bind:this` and call `start` / `finish` /
   *  `error` / `inc` / `set` directly, or drive it via `createLoadingBar`. */
  export interface LoadingBarHandle {
    start: (from?: number) => void
    finish: () => void
    fail: () => void
    error: () => void
    inc: (amount?: number) => void
    set: (value: number) => void
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    value = $bindable(0),
    color = '',
    height = 3,
    indeterminate = false,
    position = 'top',
    spinner = false,
    error: errorProp = false,
    hidden = false,
    onfinish,
    ref = $bindable(null),
    class: className,
    ...restProps
  }: LoadingBarProps = $props()

  let internal = $state(value)
  /** Imperative fail() tints the bar without requiring the error prop. */
  let internalError = $state(false)
  /** After finish/fail, fade out then reset. */
  let fading = $state(false)
  let raf: number | null = null
  let hideTimer: ReturnType<typeof setTimeout> | null = null
  /** Bumped on start/finish/fail so in-flight trickle frames abort. */
  let generation = 0

  $effect(() => {
    internal = value
  })

  const pct = $derived(Math.min(100, Math.max(0, internal)))
  const isError = $derived(errorProp || internalError)
  const barColor = $derived(color || (isError ? 'var(--destructive)' : 'var(--primary)'))
  const visible = $derived(!hidden && !fading && (indeterminate || internal > 0))

  function clearTimers() {
    if (raf) {
      cancelAnimationFrame(raf)
      raf = null
    }
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
  }

  /** Slowly creep the bar toward a soft ceiling so progress feels alive. */
  function trickle(gen: number) {
    if (raf) cancelAnimationFrame(raf)
    const step = () => {
      if (gen !== generation || internalError || fading) return
      if (internal >= 95) return
      // Asymptotic crawl — slows as it approaches the ceiling.
      const next = Math.min(95, internal + (95 - internal) * 0.04 + 0.15)
      set(next)
      if (next < 95 && gen === generation) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  }

  // Imperative API exposed for `createLoadingBar` / parent `bind:this`.
  export function set(v: number) {
    internal = v
    value = v
  }

  export function start(from = 20) {
    clearTimers()
    generation += 1
    const gen = generation
    internalError = false
    fading = false
    set(from)
    // Trickle toward ~95 while the consumer is still working (classic NProgress).
    trickle(gen)
  }

  export function inc(amount = 10) {
    if (fading) return
    set(Math.min(99, internal + amount))
  }

  export function finish() {
    clearTimers()
    generation += 1
    internalError = false
    set(100)
    onfinish?.()
    // Hold full bar briefly, then fade + reset so the next start() is clean.
    hideTimer = setTimeout(() => {
      fading = true
      hideTimer = setTimeout(() => {
        internal = 0
        value = 0
        fading = false
        hideTimer = null
      }, 300)
    }, 200)
  }

  export function fail() {
    clearTimers()
    generation += 1
    internalError = true
    internal = 100
    value = 100
    onfinish?.()
    hideTimer = setTimeout(() => {
      fading = true
      hideTimer = setTimeout(() => {
        internal = 0
        internalError = false
        value = 0
        fading = false
        hideTimer = null
      }, 300)
    }, 400)
  }

  export const error = fail

  onDestroy(() => {
    clearTimers()
  })
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="loading-bar"
  data-position={position}
  data-state={isError ? 'error' : indeterminate ? 'indeterminate' : 'determinate'}
  class={cn(
    'pointer-events-none fixed left-0 z-[9999] w-full transition-opacity duration-300',
    position === 'top' ? 'top-0' : 'bottom-0',
    visible ? 'opacity-100' : 'opacity-0',
    className,
  )}
  style:height={`${height}px`}
  role="progressbar"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={indeterminate ? undefined : pct}
  aria-busy={visible && !isError ? true : undefined}
  aria-hidden={!visible}
  {...restProps}
>
  <!-- Track -->
  <div class="absolute inset-0 bg-transparent"></div>

  <!-- Determinate bar -->
  {#if !indeterminate}
    <div
      data-slot="loading-bar-fill"
      class="absolute inset-y-0 left-0 transition-[width] duration-200 ease-out"
      style:width={`${pct}%`}
      style:background-color={barColor}
    >
      {#if spinner}
        <div
          data-slot="loading-bar-spinner"
          class="absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-current border-t-transparent"
          style:color={barColor}
        ></div>
      {/if}
    </div>
  {:else}
    <!-- Indeterminate sliding bar -->
    <div
      data-slot="loading-bar-indeterminate"
      class="loading-bar-indeterminate absolute inset-y-0 w-1/3"
      style:background-color={barColor}
    >
      {#if spinner}
        <div
          data-slot="loading-bar-spinner"
          class="absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-current border-t-transparent"
          style:color={barColor}
        ></div>
      {/if}
    </div>
  {/if}
</div>

<style>
  @media (prefers-reduced-motion: no-preference) {
    .loading-bar-indeterminate {
      animation: uipkge-loading-bar-slide 1.2s ease-in-out infinite;
    }
  }

  @keyframes uipkge-loading-bar-slide {
    0% {
      left: -33%;
    }
    100% {
      left: 100%;
    }
  }
</style>
