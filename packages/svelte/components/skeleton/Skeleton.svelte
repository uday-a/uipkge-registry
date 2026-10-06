<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'rectangular' | 'rounded' | 'circular' | 'text' | 'avatar' | 'image' | 'card' | 'table-row'
    width?: string
    height?: string
    loading?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  const variantClasses: Record<NonNullable<SkeletonProps['variant']>, string> = {
    rectangular: '',
    rounded: 'rounded-md',
    circular: 'rounded-full',
    text: 'rounded h-4 w-full',
    avatar: 'rounded-full size-10',
    image: 'rounded-lg size-24',
    card: 'rounded-xl size-full min-h-30',
    'table-row': 'rounded h-10 w-full',
  }

  let {
    class: className,
    variant = 'rectangular',
    width,
    height,
    loading = true,
    children,
    ref = $bindable(null),
    ...restProps
  }: SkeletonProps = $props()

  const variantStyle = $derived(
    width || height ? `${width ? `width:${width};` : ''}${height ? `height:${height};` : ''}` : undefined,
  )
</script>

{#if loading}
  <div
    bind:this={ref}
    data-uipkge=""
    data-slot="skeleton"
    aria-hidden="true"
    class={cn('skeleton-shimmer', variantClasses[variant ?? 'rectangular'], className)}
    style={variantStyle}
    {...restProps}
  ></div>
{:else}
  {@render children?.()}
{/if}

<style>
  /* Slow left-to-right gradient sweep. Per NN/g, slow shimmer reads as
     faster loading than a pulse. 1.8s loop is the documented sweet spot. */
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
