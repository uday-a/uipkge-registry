<script lang="ts" module>
  import type { Component } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
    icon?: Component
    title?: string
    description?: string
    role?: 'status' | 'alert'
    headingTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    icon,
    title,
    description,
    role = 'status',
    headingTag = 'h3',
    children,
    ref = $bindable(null),
    ...restProps
  }: EmptyStateProps = $props()

  const Icon = $derived(icon)
</script>

<div
  bind:this={ref}
  class={cn('flex flex-col items-center py-12 text-center', className)}
  {role}
  aria-live={role === 'alert' ? 'assertive' : 'polite'}
  {...restProps}
>
  {#if Icon}
    <Icon class="text-muted-foreground mx-auto mb-3 size-10" aria-hidden="true" />
  {/if}
  {#if title}
    <svelte:element this={headingTag} class="text-foreground font-medium">
      {title}
    </svelte:element>
  {/if}
  {#if description}
    <p class="text-muted-foreground mt-1 max-w-sm text-sm">{description}</p>
  {/if}
  {@render children?.()}
</div>
