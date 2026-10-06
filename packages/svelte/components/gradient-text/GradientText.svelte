<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { GradientPreset } from './gradient-text.variants'

  export type GradientDirection =
    | 'to right'
    | 'to left'
    | 'to top'
    | 'to bottom'
    | 'to top right'
    | 'to top left'
    | 'to bottom right'
    | 'to bottom left'

  export interface GradientTextProps extends HTMLAttributes<HTMLElement> {
    /** Rendered element tag. */
    as?: string
    /** Preset gradient name. Overrides from/to when set. */
    preset?: GradientPreset
    /** Start color of a custom two-stop gradient. */
    from?: string
    /** End color of a custom two-stop gradient. */
    to?: string
    /** Gradient direction. */
    direction?: GradientDirection
    /** Fully custom CSS gradient (e.g. 'linear-gradient(45deg, #f00, #00f, #0f0)'). Overrides preset/from/to. */
    gradient?: string
    /** Animate the gradient (subtle background-position shift). */
    animated?: boolean
    /** Animation duration in seconds. Default 4. */
    animationDuration?: number
    /** Render your own element with the gradient styles instead of emitting
     *  the `as` tag — the Svelte counterpart of React's `asChild`. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { gradientTextPresets } from './gradient-text.variants'

  let {
    class: className,
    as = 'span',
    preset,
    from,
    to,
    direction = 'to right',
    gradient,
    animated = false,
    animationDuration = 4,
    child,
    children,
    ref = $bindable(null),
    ...restProps
  }: GradientTextProps = $props()

  const gradientValue = $derived.by(() => {
    if (gradient) return gradient
    if (preset) return gradientTextPresets[preset] ?? ''
    if (from && to) {
      return `linear-gradient(${direction}, ${from}, ${to})`
    }
    // Default fallback: primary token gradient.
    return 'linear-gradient(to right, var(--primary), var(--primary))'
  })

  const style = $derived(
    [
      `background-image: ${gradientValue}`,
      'background-clip: text',
      '-webkit-background-clip: text',
      'color: transparent',
      '-webkit-text-fill-color: transparent',
      animated ? 'background-size: 200% 200%' : '',
    ]
      .filter(Boolean)
      .join('; '),
  )

  const mergedProps = $derived({
    'data-uipkge': '',
    'data-slot': 'gradient-text',
    'data-preset': preset,
    'data-animated': animated ? 'true' : undefined,
    class: cn(
      'inline-block',
      animated ? `motion-safe:animate-[gradient-text-shift_${animationDuration}s_ease_infinite]` : '',
      className,
    ),
    style,
    ...restProps,
  })
</script>

{#if child}
  {@render child({ props: mergedProps })}
{:else}
  <svelte:element this={as} bind:this={ref} {...mergedProps}>{@render children?.()}</svelte:element>
{/if}

<!-- Unscoped: Tailwind arbitrary `animate-[gradient-text-shift_…]` looks up
     this name globally. Svelte leaves `@keyframes` names unscoped, so the
     animation class resolves against this global definition. -->
<style>
  @media (prefers-reduced-motion: no-preference) {
    @keyframes gradient-text-shift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  }
</style>
