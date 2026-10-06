<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * Max visible slots including the +N badge. Svelte can't slice snippet
     * children like Vue can slice VNodes, so when overflowing render at most
     * `max - 1` avatars and let `total` drive the badge count.
     */
    max?: number
    overlap?: boolean
    size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'
    /** Override the total used for +N when only a subset of avatars is rendered. */
    total?: number
    overflow?: Snippet<[{ count: number }]>
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    max,
    overlap = true,
    size = 'default',
    total,
    children,
    overflow,
    ref = $bindable(null),
    ...restProps
  }: AvatarGroupProps = $props()

  // When overflowing, reserve one slot for the +N chip so max includes the badge.
  const isOverflowing = $derived(max != null && total != null && total > max)
  const overflowCount = $derived(isOverflowing ? total! - (max! - 1) : 0)

  const overflowSizeClass = $derived.by(() => {
    switch (size) {
      case 'xs':
        return 'size-4 text-xs'
      case 'sm':
        return 'size-6 text-xs'
      case 'lg':
        return 'size-12 text-base'
      case 'xl':
        return 'size-16 text-lg'
      case '2xl':
        return 'size-20 text-xl'
      default:
        return 'size-8 text-sm'
    }
  })
</script>

<div
  bind:this={ref}
  class={cn('flex items-center', overlap ? '-space-x-2' : 'gap-1', className)}
  data-uipkge=""
  data-slot="avatar-group"
  {...restProps}
>
  {@render children?.()}
  {#if isOverflowing}
    <div class={cn('bg-muted ring-background relative flex shrink-0 overflow-hidden rounded-full ring-2', overflowSizeClass)}>
      {#if overflow}
        {@render overflow({ count: overflowCount })}
      {:else}
        <span class="flex size-full items-center justify-center font-medium">+{overflowCount}</span>
      {/if}
    </div>
  {/if}
</div>
