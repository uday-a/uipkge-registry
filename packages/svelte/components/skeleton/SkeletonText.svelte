<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SkeletonTextProps extends HTMLAttributes<HTMLDivElement> {
    lines?: number
    lastLineWidth?: string
    firstLineWidth?: string
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    lines = 3,
    lastLineWidth = '80%',
    firstLineWidth = '100%',
    ref = $bindable(null),
    ...restProps
  }: SkeletonTextProps = $props()

  const lineWidths = $derived(
    Array.from({ length: lines }, (_, i) => {
      if (i === 0) return firstLineWidth
      if (i === lines - 1) return lastLineWidth
      return '100%'
    }),
  )
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="skeleton-text"
  aria-hidden="true"
  class={cn('space-y-2', className)}
  {...restProps}
>
  {#each lineWidths as width, i (i)}
    <div class="skeleton-shimmer h-4 rounded" style="width:{width}"></div>
  {/each}
</div>

<style>
  /* Match Skeleton.svelte shimmer so text lines don't flash a different motion language. */
  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--muted) 100%, transparent) 0%,
      color-mix(in srgb, var(--muted) 60%, var(--foreground) 8%) 50%,
      color-mix(in srgb, var(--muted) 100%, transparent) 100%
    );
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.8s linear infinite;
  }
  @keyframes skeleton-shimmer {
    from {
      background-position: 200% 0;
    }
    to {
      background-position: -200% 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .skeleton-shimmer {
      animation: none;
      background: var(--muted);
    }
  }
</style>
