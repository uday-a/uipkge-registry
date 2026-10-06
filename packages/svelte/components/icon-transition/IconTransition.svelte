<script lang="ts" module>
  import type { Component } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TransitionConfig } from 'svelte/transition'

  // Self-contained icon-swap control. Click runs an optional async `action`,
  // then flips from `defaultIcon` to `activeIcon` with a spring pop. By default
  // it auto-reverts after 1500ms; pass `resetAfter={0}` to keep the active
  // icon, then call `ref.reset()` manually.
  //
  // Two operating modes:
  //   1. Self-managed (most common): pass `defaultIcon`, `activeIcon`, and
  //      either `action` or just listen to `onActivate`. The component runs
  //      the action, manages its own `active` state, and auto-resets.
  //   2. Externally controlled: pass `active={boolean}` and the component
  //      will mirror that prop, ignoring its internal flag.
  //
  // Renders as a <button> by default. Pass `as="span"` for a non-interactive
  // icon (e.g. inside a parent button) — in that mode the parent is responsible
  // for triggering `trigger()` via the component ref.
  /** Imperative handle — grab it with `bind:this` (React `IconTransitionHandle` parity). */
  export interface IconTransitionHandle {
    trigger: () => Promise<void>
    reset: () => void
  }

  export interface IconTransitionProps extends HTMLAttributes<HTMLButtonElement> {
    defaultIcon: Component
    activeIcon: Component
    /** Tailwind size/color applied to the icons. */
    iconClass?: string
    /** Async work executed on click before the icon flips. Return `false` to skip the flip. */
    action?: () => boolean | void | Promise<boolean | void>
    /** ms before reverting to defaultIcon. Set to `0` (or null) to stay active. */
    resetAfter?: number | null
    /** Pop animation duration in ms (also scales the leave fade). */
    duration?: number
    /** aria-label shown in default state. */
    label?: string
    /** aria-label shown after activation; falls back to `label`. */
    activeLabel?: string
    /** Tailwind class applied while active (e.g. "text-success"). */
    activeClass?: string
    /** Render element. `button` adds click handler + focus styling; `span` is purely visual. */
    as?: 'button' | 'span'
    /** External control. When provided, this prop wins over internal state. */
    active?: boolean
    onActivate?: () => void
    onReset?: () => void
  }

  // Leave fade matching the Vue `icon-transition-fade` keyframes (opacity
  // 1→0, scale 1→0.85). Enter is a plain CSS animation (see the style block
  // below) that autoplays when the keyed icon mounts — Svelte has no
  // <Transition> wrapper. NOTE: do not spell out a style tag literally in
  // this comment — svelte-check misparses it as the style block start.
  function leaveFade(_node: Element, { duration }: { duration: number }): TransitionConfig {
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return { duration: 0 }
    }
    return {
      duration,
      easing: (t) => t * t,
      css: (t) => `opacity: ${t}; transform: scale(${0.85 + 0.15 * t});`,
    }
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    defaultIcon,
    activeIcon,
    iconClass = 'size-4',
    action,
    resetAfter = 1500,
    duration = 240,
    label,
    activeLabel,
    activeClass = 'text-success',
    as = 'button',
    active,
    onActivate,
    onReset,
    ...restProps
  }: IconTransitionProps = $props()

  let internalActive = $state(false)
  const isActive = $derived(active !== undefined ? active : internalActive)

  let timer: ReturnType<typeof setTimeout> | null = null

  function clearTimer() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  export async function trigger() {
    if (action) {
      const result = await action()
      if (result === false) return
    }
    internalActive = true
    onActivate?.()
    clearTimer()
    if (resetAfter && resetAfter > 0) {
      timer = setTimeout(reset, resetAfter)
    }
  }

  export function reset() {
    internalActive = false
    onReset?.()
    clearTimer()
  }

  onDestroy(clearTimer)

  const CurrentIcon = $derived(isActive ? activeIcon : defaultIcon)
</script>

<svelte:element
  this={as}
  data-uipkge
  data-slot="icon-transition"
  {...restProps}
  type={as === 'button' ? 'button' : undefined}
  aria-label={isActive ? (activeLabel ?? label) : label}
  aria-live={isActive ? 'polite' : undefined}
  class={cn(
    'icon-transition focus-visible:ring-ring inline-grid place-items-center transition-colors focus-visible:ring-2 focus-visible:outline-none',
    isActive ? activeClass : '',
    className,
  )}
  style="--it-duration: {duration}ms"
  onclick={as === 'button' ? trigger : undefined}
>
  {#key isActive}
    <!-- Wrapping span isolates the positioning + transform from the icon
      itself. Putting the transition transform directly on the SVG would
      stretch it to fill the parent (e.g. 28×28 inside a size-7 button) and
      the icon would visually balloon mid-transition; the wrapper takes the
      layout role and the SVG keeps its intrinsic iconClass-driven size. -->
    <span class="icon-transition-slot" out:leaveFade={{ duration: duration * 0.66 }}>
      <CurrentIcon class={iconClass} aria-hidden="true" />
    </span>
  {/key}
</svelte:element>

<style>
  .icon-transition-slot {
    /* Both default and active icons map to the same grid cell so they can
     overlap during the cross-fade without ever leaving the parent's flow. */
    grid-area: 1 / 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transform-origin: center;
    /* Fill `backwards` (not `both`): the fill must release once the enter
     animation ends, otherwise it overrides the leaveFade transition's
     inline opacity/transform during the outro. */
    animation: icon-transition-pop var(--it-duration, 240ms) cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  }
  @keyframes icon-transition-pop {
    0% {
      opacity: 0;
      transform: scale(0.5) rotate(-12deg);
    }
    60% {
      opacity: 1;
      transform: scale(1.18) rotate(2deg);
    }
    100% {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .icon-transition-slot {
      animation-duration: 0ms !important;
    }
  }
</style>
