<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { SkeletonLoaderVariants } from './skeleton.variants'

  export interface SkeletonLoaderProps extends HTMLAttributes<HTMLDivElement> {
    variant?: SkeletonLoaderVariants['variant']
    loading?: boolean
    rows?: number
    boilerplate?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { skeletonLoaderVariants } from './skeleton.variants'

  let {
    class: className,
    variant = 'text',
    loading = true,
    rows = 1,
    boilerplate = false,
    children,
    ref = $bindable(null),
    ...restProps
  }: SkeletonLoaderProps = $props()

  const rowIndexes = $derived(Array.from({ length: rows }, (_, i) => i))
</script>

<div bind:this={ref} data-uipkge="" data-slot="skeleton-loader" class="space-y-2" {...restProps}>
  {#if rows === 1}
    {#if loading}
      <div class={cn(skeletonLoaderVariants({ variant }), className)}></div>
    {:else}
      {@render children?.()}
    {/if}
  {:else if loading}
    {#if variant === 'article'}
      <div class={cn(skeletonLoaderVariants({ variant: 'heading' }), 'mb-4')}></div>
      <div class={cn(skeletonLoaderVariants({ variant: 'text' }), 'mb-2')}></div>
      <div class={cn(skeletonLoaderVariants({ variant: 'text' }), 'mb-2')}></div>
      <div class={cn(skeletonLoaderVariants({ variant: 'text' }), 'w-3/4')}></div>
    {:else if variant === 'card'}
      <div class={cn(skeletonLoaderVariants({ variant: 'image-large' }), 'mb-4')}></div>
      <div class={cn(skeletonLoaderVariants({ variant: 'heading-small' }), 'mb-2')}></div>
      <div class={cn(skeletonLoaderVariants({ variant: 'text' }), 'mb-2')}></div>
      <div class={cn(skeletonLoaderVariants({ variant: 'text' }), 'w-1/2')}></div>
    {:else if variant === 'card-avatar'}
      <div class="mb-4 flex items-center gap-4">
        <div class={cn(skeletonLoaderVariants({ variant: 'avatar-large' }))}></div>
        <div class="flex-1 space-y-2">
          <div class={cn(skeletonLoaderVariants({ variant: 'heading-small' }))}></div>
          <div class={cn(skeletonLoaderVariants({ variant: 'text' }), 'w-1/2')}></div>
        </div>
      </div>
    {:else if variant === 'actions'}
      <div class="flex gap-2">
        <div class={cn(skeletonLoaderVariants({ variant: 'button' }))}></div>
        <div class={cn(skeletonLoaderVariants({ variant: 'button' }))}></div>
      </div>
    {:else if variant === 'table'}
      {#each rowIndexes as i (i)}
        <div class={cn(skeletonLoaderVariants({ variant: 'table-row' }), 'mb-2')}></div>
      {/each}
    {:else if variant === 'list-item'}
      {#each rowIndexes as i (i)}
        <div class="mb-2 flex items-center gap-3">
          <div class={cn(skeletonLoaderVariants({ variant: 'avatar-small' }))}></div>
          <div class="flex-1">
            <div class={cn(skeletonLoaderVariants({ variant: 'text' }))}></div>
          </div>
        </div>
      {/each}
    {:else if variant === 'list-item-two-line'}
      {#each rowIndexes as i (i)}
        <div class="mb-2 flex items-center gap-3">
          <div class={cn(skeletonLoaderVariants({ variant: 'avatar' }))}></div>
          <div class="flex-1 space-y-2">
            <div class={cn(skeletonLoaderVariants({ variant: 'text' }))}></div>
            <div class={cn(skeletonLoaderVariants({ variant: 'text' }), 'w-3/4')}></div>
          </div>
        </div>
      {/each}
    {:else if variant === 'list-item-three-line'}
      {#each rowIndexes as i (i)}
        <div class="mb-2 flex items-start gap-3">
          <div class={cn(skeletonLoaderVariants({ variant: 'avatar' }))}></div>
          <div class="flex-1 space-y-2">
            <div class={cn(skeletonLoaderVariants({ variant: 'text' }))}></div>
            <div class={cn(skeletonLoaderVariants({ variant: 'text' }))}></div>
            <div class={cn(skeletonLoaderVariants({ variant: 'text' }), 'w-2/3')}></div>
          </div>
        </div>
      {/each}
    {:else}
      {#each rowIndexes as i (i)}
        <div class={cn(skeletonLoaderVariants({ variant }), 'mb-2')}></div>
      {/each}
    {/if}
  {:else}
    {@render children?.()}
  {/if}

  {#if boilerplate && !loading}
    <div class="bg-muted/50 absolute inset-0"></div>
  {/if}
</div>
