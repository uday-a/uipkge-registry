<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type {
    RelativeTimeDisplay,
    RelativeTimeNumeric,
    RelativeTimeParseAs,
    RelativeTimeStyle,
  } from './format-relative-time'

  // Omit `children`: the snippet carries label/absolute strings, which narrows the base `Snippet` type.
  export interface RelativeTimeProps extends Omit<HTMLAttributes<HTMLTimeElement>, 'children'> {
    /** Instant to display. Accepts a Date, ISO string, or epoch ms. */
    date: Date | string | number
    /** Clock used for the delta. Pass in tests and SSR to keep output stable. */
    now?: Date | string | number
    /** Intl relative style. Named `formatStyle` so it does not collide with the HTML style attribute. */
    formatStyle?: RelativeTimeStyle
    /** `auto` yields "yesterday"; `always` yields "1 day ago". */
    numeric?: RelativeTimeNumeric
    /** BCP 47 locale. Defaults to the runtime locale. */
    locale?: string
    /** Visible label: relative (default), absolute clock, or both. */
    display?: RelativeTimeDisplay
    /** IANA zone for absolute text and the title tooltip. Omit for the browser local zone. Pass `UTC` for UTC. */
    timeZone?: string
    /** How to parse date strings with no offset. `local` is JS default; `utc` treats naive ISO as UTC. */
    parseAs?: RelativeTimeParseAs
    /** Tick interval in ms. `0` freezes the clock. */
    updateInterval?: number
    /** Override the rendered label. Receives the computed `label` and `absolute` strings. */
    children?: Snippet<[{ label: string; absolute: string }]>
    ref?: HTMLTimeElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import {
    formatAbsoluteTime,
    formatVisibleTime,
    toDate,
  } from './format-relative-time'

  let {
    class: className,
    date,
    now = undefined,
    formatStyle = 'long',
    numeric = 'auto',
    locale = undefined,
    display = 'relative',
    timeZone = undefined,
    parseAs = 'local',
    updateInterval = 30_000,
    children,
    ref = $bindable(null),
    ...restProps
  }: RelativeTimeProps = $props()

  let tick = $state(0)

  $effect(() => {
    if (updateInterval <= 0 || now !== undefined) return
    const timer = setInterval(() => {
      tick += 1
    }, updateInterval)
    return () => clearInterval(timer)
  })

  const resolvedNow = $derived.by(() => {
    tick
    return now === undefined ? new Date() : toDate(now, parseAs)
  })

  const resolvedDate = $derived(toDate(date, parseAs))

  const label = $derived(
    formatVisibleTime(resolvedDate, resolvedNow, {
      display,
      style: formatStyle,
      numeric,
      locale,
      timeZone,
    }),
  )

  const absolute = $derived(formatAbsoluteTime(resolvedDate, locale, timeZone))
  const iso = $derived(resolvedDate.toISOString())
</script>

<time
  bind:this={ref}
  data-uipkge=""
  data-slot="relative-time"
  datetime={iso}
  title={absolute}
  data-display={display}
  data-timezone={timeZone || 'local'}
  data-parse-as={parseAs}
  class={cn('text-muted-foreground text-sm tabular-nums', className)}
  {...restProps}
>
  {#if children}
    {@render children({ label, absolute })}
  {:else}
    {label}
  {/if}
</time>
