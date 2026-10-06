<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface BorderBeamProps extends HTMLAttributes<HTMLSpanElement> {
    /** Ring thickness in px. */
    size?: number
    /** Seconds per revolution. */
    duration?: number
    /** Seconds; negative values offset the beam's starting position around the ring. */
    delay?: number
    /** Any CSS color for the beam highlight. */
    color?: string
    /** Freeze the beam in place (animation-play-state: paused). */
    paused?: boolean
    /** The overlay <span>, via `bind:ref`. */
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    size = 2,
    duration = 6,
    delay = 0,
    color = 'var(--primary)',
    paused = false,
    children,
    ref = $bindable(null),
    ...restProps
  }: BorderBeamProps = $props()

  // Destructured (not rendered): the beam is a pure overlay with no slot —
  // this keeps a stray `children` prop out of the span's spread attributes.
  void children

  // Honor prefers-reduced-motion by rendering a static beam at a fixed angle.
  let reducedMotion = $state(false)

  $effect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches
    }
    reducedMotion = query.matches
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  })

  const beamStyle = $derived.by(() => {
    const background = reducedMotion
      ? `conic-gradient(from 45deg, transparent 0deg, transparent 290deg, ${color} 330deg, transparent 360deg)`
      : `conic-gradient(from var(--uipkge-border-angle), transparent 0deg, transparent 290deg, ${color} 330deg, transparent 360deg)`
    const animation = reducedMotion ? 'none' : `uipkge-border-beam ${duration}s linear infinite ${delay}s`
    const playState = !reducedMotion && paused ? 'paused' : undefined
    // -webkit fallbacks first so the standard properties below win where both exist.
    return [
      `padding: ${size}px`,
      `background: ${background}`,
      `animation: ${animation}`,
      ...(playState ? [`animation-play-state: ${playState}`] : []),
      '-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      '-webkit-mask-composite: xor',
      'mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      'mask-composite: exclude',
    ].join('; ')
  })
</script>

<span
  bind:this={ref}
  data-uipkge=""
  data-slot="border-beam"
  aria-hidden="true"
  class={cn('pointer-events-none absolute inset-0 rounded-[inherit]', className)}
  style={beamStyle}
  {...restProps}
></span>
