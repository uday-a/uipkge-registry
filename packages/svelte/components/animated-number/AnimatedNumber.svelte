<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface AnimatedNumberProps extends HTMLAttributes<HTMLSpanElement> {
    value: number
    /** Value the first animation starts from. */
    from?: number
    /** ms per tween. */
    duration?: number
    /** ms before the first tween starts. */
    delay?: number
    format?: (value: number) => string
    /** Render the target value instantly, no tween. */
    disabled?: boolean
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import { onDestroy, onMount, untrack } from 'svelte'
  import { cn } from '$lib/utils'

  /**
   * Tweened number display. Counts up on mount, then smoothly retargets
   * from the currently displayed value whenever `value` changes.
   * Server render outputs the final value so hydration always matches.
   */
  let {
    value,
    from = 0,
    duration = 900,
    delay = 0,
    format,
    disabled = false,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: AnimatedNumberProps = $props()

  const defaultFormat = (v: number) => String(Math.round(v))

  // Snapshot once: the server render outputs the final value so hydration
  // matches; the mount tween below takes over from there.
  const getInitialDisplay = () => value
  let display = $state(getInitialDisplay())

  let raf = 0
  let startTimer: number | undefined

  function cancel() {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    if (startTimer !== undefined) {
      clearTimeout(startTimer)
      startTimer = undefined
    }
  }

  function tweenTo(target: number, animateFrom: number, withDelay: boolean) {
    cancel()
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (disabled || reduce) {
      display = target
      return
    }
    const startTime = performance.now()
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
    const run = () => {
      const t = Math.min(1, (performance.now() - startTime) / duration)
      display = animateFrom + (target - animateFrom) * easeOutCubic(t)
      raf = t < 1 ? requestAnimationFrame(run) : 0
    }
    if (withDelay && delay > 0) {
      startTimer = window.setTimeout(() => {
        startTimer = undefined
        run()
      }, delay)
    } else {
      run()
    }
  }

  onMount(() => {
    // First paint showed the final value (SSR-safe); snap to `from`, then animate.
    tweenTo(value, from, true)
  })

  let firstRun = true
  $effect(() => {
    const next = value
    // The mount tween above owns the first run; this effect only retargets
    // on later changes. `display` is read untracked so tween frames don't
    // resubscribe and restart the tween.
    if (firstRun) {
      firstRun = false
      return
    }
    const animateFrom = untrack(() => display)
    tweenTo(next, animateFrom, false)
  })

  onDestroy(cancel)

  const formatted = $derived((format ?? defaultFormat)(display))
</script>

<span bind:this={ref} data-uipkge="" data-slot="animated-number" class={cn('tabular-nums', className)} {...restProps}>
  {formatted}
</span>
