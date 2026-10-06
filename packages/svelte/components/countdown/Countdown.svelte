<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export type CountdownFormat = 'DD:HH:MM:SS' | 'HH:MM:SS' | 'MM:SS' | 'SS'

  export interface CountdownParts {
    days: number
    hours: number
    minutes: number
    seconds: number
  }

  /** React parity alias — the full render-prop payload (`parts` + display string + finished). */
  export type CountdownRenderProps = CountdownParts & { display: string; finished: boolean }

  export interface CountdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Target date/time. Accepts a Date, ISO string, or epoch ms number. */
    target: Date | string | number
    /** Display format. Custom tokens: DD days, HH hours, MM minutes, SS seconds. */
    format?: CountdownFormat | string
    /** Pause the countdown. */
    paused?: boolean
    /** Optional label rendered above the countdown. */
    label?: string
    /** Show leading zeros (e.g. 05 vs 5). */
    pad?: boolean
    /** Separator between units. */
    separator?: string
    /** Fires once when the countdown reaches zero. */
    onfinish?: () => void
    /** Fires every second with the remaining ms. */
    ontick?: (remaining: number) => void
    /** Default content override — receives parts, the formatted display string, and finished. */
    children?: Snippet<[CountdownParts & { display: string; finished: boolean }]>
    /** Per-unit overrides. */
    days?: Snippet<[{ days: number }]>
    hours?: Snippet<[{ hours: number }]>
    minutes?: Snippet<[{ minutes: number }]>
    seconds?: Snippet<[{ seconds: number }]>
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    target,
    format = 'DD:HH:MM:SS',
    paused = false,
    label = '',
    pad = true,
    separator = ':',
    onfinish,
    ontick,
    children,
    days: daysSnippet,
    hours: hoursSnippet,
    minutes: minutesSnippet,
    seconds: secondsSnippet,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: CountdownProps = $props()

  let now = $state(Date.now())
  let finished = $state(false)

  const targetMs = $derived(
    target instanceof Date ? target.getTime() : typeof target === 'number' ? target : new Date(target).getTime(),
  )
  const remainingMs = $derived(Math.max(0, targetMs - now))

  const parts = $derived<CountdownParts>(byParts(remainingMs))

  function byParts(total: number): CountdownParts {
    const days = Math.floor(total / 86_400_000)
    const hours = Math.floor((total % 86_400_000) / 3_600_000)
    const minutes = Math.floor((total % 3_600_000) / 60_000)
    const seconds = Math.floor((total % 60_000) / 1000)
    return { days, hours, minutes, seconds }
  }

  /** Values actually painted for each unit under the active format (rolled-up totals for compact formats). */
  const displayParts = $derived.by((): CountdownParts => {
    const { days, hours, minutes, seconds } = parts
    if (format === 'HH:MM:SS') {
      return { days, hours: days * 24 + hours, minutes, seconds }
    }
    if (format === 'MM:SS') {
      return { days, hours, minutes: days * 24 * 60 + hours * 60 + minutes, seconds }
    }
    if (format === 'SS') {
      return { days, hours, minutes, seconds: Math.floor(remainingMs / 1000) }
    }
    // DD:HH:MM:SS and custom token formats use modular parts.
    return { days, hours, minutes, seconds }
  })

  function pad2(n: number) {
    return pad ? String(n).padStart(2, '0') : String(n)
  }

  /** Split a unit string into chars so only changed digits remount + flip. */
  function unitChars(n: number) {
    return [...pad2(n)]
  }

  const display = $derived.by(() => {
    const { days, hours, minutes, seconds } = parts
    const sep = separator
    if (format === 'DD:HH:MM:SS') return `${pad2(days)}${sep}${pad2(hours)}${sep}${pad2(minutes)}${sep}${pad2(seconds)}`
    if (format === 'HH:MM:SS') return `${pad2(days * 24 + hours)}${sep}${pad2(minutes)}${sep}${pad2(seconds)}`
    if (format === 'MM:SS') return `${pad2(days * 24 * 60 + hours * 60 + minutes)}${sep}${pad2(seconds)}`
    if (format === 'SS') return pad2(Math.floor(remainingMs / 1000))
    // Custom token format: replace DD, HH, MM, SS tokens.
    return format
      .replace('DD', pad2(days))
      .replace('HH', pad2(hours))
      .replace('MM', pad2(minutes))
      .replace('SS', pad2(seconds))
  })

  $effect(() => {
    // Restart the timer when the target or paused flag changes. Everything
    // time-derived is read inside untrack so the 1s tick doesn't re-trigger
    // this effect (which would reset `finished` and recreate the interval).
    const watchedTarget = target
    const watchedPaused = paused
    void watchedTarget
    let alreadyDone = false
    untrack(() => {
      finished = false
      now = Date.now()
      // Fire finish immediately when the target is already past (don't wait for first tick).
      if (remainingMs <= 0) {
        finished = true
        alreadyDone = true
        onfinish?.()
      }
    })
    if (alreadyDone || watchedPaused) return
    const timer = setInterval(() => {
      now = Date.now()
      ontick?.(remainingMs)
      if (remainingMs <= 0) {
        finished = true
        clearInterval(timer)
        onfinish?.()
      }
    }, 1000)
    return () => clearInterval(timer)
  })
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="countdown"
  data-finished={finished}
  data-paused={paused}
  class={cn('inline-flex flex-col gap-1', className)}
  {...restProps}
>
  {#if label}
    <span data-slot="countdown-label" class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
      {label}
    </span>
  {/if}
  <div
    data-slot="countdown-display"
    class="flex items-baseline gap-1 font-mono tabular-nums"
    role="timer"
    aria-live={finished || paused ? 'off' : 'polite'}
    aria-atomic="true"
  >
    {#if children}
      {@render children({ ...parts, display, finished })}
    {:else}
      {#if format.includes('DD')}
        {#if daysSnippet}
          {@render daysSnippet({ days: parts.days })}
        {:else}
          <span data-slot="countdown-days" class="text-foreground inline-flex text-2xl font-semibold">
            {#each unitChars(displayParts.days) as ch, i (`d-${i}-${ch}`)}
              <span class="countdown-digit inline-block tabular-nums">{ch}</span>
            {/each}
          </span>
        {/if}
      {/if}
      {#if format.includes('DD') && format.includes('HH')}
        <span class="text-muted-foreground text-2xl">{separator}</span>
      {/if}
      {#if format.includes('HH')}
        {#if hoursSnippet}
          {@render hoursSnippet({ hours: parts.hours })}
        {:else}
          <span data-slot="countdown-hours" class="text-foreground inline-flex text-2xl font-semibold">
            {#each unitChars(displayParts.hours) as ch, i (`h-${i}-${ch}`)}
              <span class="countdown-digit inline-block tabular-nums">{ch}</span>
            {/each}
          </span>
        {/if}
      {/if}
      {#if format.includes('HH') && format.includes('MM')}
        <span class="text-muted-foreground text-2xl">{separator}</span>
      {/if}
      {#if format.includes('MM')}
        {#if minutesSnippet}
          {@render minutesSnippet({ minutes: parts.minutes })}
        {:else}
          <span data-slot="countdown-minutes" class="text-foreground inline-flex text-2xl font-semibold">
            {#each unitChars(displayParts.minutes) as ch, i (`m-${i}-${ch}`)}
              <span class="countdown-digit inline-block tabular-nums">{ch}</span>
            {/each}
          </span>
        {/if}
      {/if}
      {#if format.includes('MM') && format.includes('SS')}
        <span class="text-muted-foreground text-2xl">{separator}</span>
      {/if}
      {#if format.includes('SS')}
        {#if secondsSnippet}
          {@render secondsSnippet({ seconds: parts.seconds })}
        {:else}
          <span data-slot="countdown-seconds" class="text-foreground inline-flex text-2xl font-semibold">
            {#each unitChars(displayParts.seconds) as ch, i (`s-${i}-${ch}`)}
              <span class="countdown-digit inline-block tabular-nums">{ch}</span>
            {/each}
          </span>
        {/if}
      {/if}
    {/if}
  </div>
</div>

<style>
  @keyframes countdown-digit-flip {
    0% {
      opacity: 0;
      transform: translateY(45%) scale(0.92);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  [data-slot='countdown'] .countdown-digit {
    animation: countdown-digit-flip 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-slot='countdown'] .countdown-digit {
      animation: none !important;
    }
  }
</style>
