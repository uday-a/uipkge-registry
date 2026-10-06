<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
    /** Scroll axis. */
    orientation?: 'horizontal' | 'vertical'
    /** Travel direction. */
    direction?: 'left' | 'right' | 'up' | 'down'
    /** Animation duration in seconds. Lower = faster. */
    speed?: number
    /** Pause the animation on hover. */
    pauseOnHover?: boolean
    /** Gap between repeated content groups (px). */
    gap?: number
    /** Number of times the slot content is duplicated for a seamless loop. */
    repeat?: number
    /** Hard pause the animation. */
    paused?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    orientation = 'horizontal',
    direction = 'left',
    speed = 20,
    pauseOnHover = false,
    gap = 16,
    repeat = 2,
    paused = false,
    children,
    ref = $bindable(null),
    ...restProps
  }: MarqueeProps = $props()

  const isVertical = $derived(orientation === 'vertical')
  const reverse = $derived(direction === 'right' || direction === 'down')

  const containerClass = $derived(
    cn(
      'group flex overflow-hidden',
      isVertical ? 'flex-col' : 'flex-row',
      pauseOnHover ? 'hover:[&>[data-slot=marquee-track]]:[animation-play-state:paused]' : '',
      className,
    ),
  )

  const trackClass = $derived(
    cn('flex shrink-0', isVertical ? 'flex-col' : 'flex-row', paused ? '![animation-play-state:paused]' : ''),
  )
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="marquee"
  data-orientation={orientation}
  data-direction={direction}
  class={containerClass}
  style:--marquee-gap="{gap}px"
  role="region"
  aria-roledescription="marquee"
  {...restProps}
>
  {#each Array.from({ length: repeat }, (_, i) => i + 1), i (i)}
    <div
      data-slot="marquee-track"
      class={trackClass}
      style:gap="var(--marquee-gap)"
      style:animation-name={isVertical ? 'uipkge-marquee-y' : 'uipkge-marquee-x'}
      style:animation-duration="{speed}s"
      style:animation-timing-function="linear"
      style:animation-iteration-count="infinite"
      style:animation-direction={reverse ? 'reverse' : 'normal'}
      aria-hidden={i > 1 ? 'true' : undefined}
    >
      {@render children?.()}
    </div>
  {/each}
</div>

<style>
  /* Global keyframes — must NOT be scoped so the inline animation-name can find them */
  :global {
    @keyframes uipkge-marquee-x {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-100%);
      }
    }

    @keyframes uipkge-marquee-y {
      from {
        transform: translateY(0);
      }
      to {
        transform: translateY(-100%);
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global([data-slot='marquee-track']) {
      animation: none !important;
    }
  }
</style>
