<script lang="ts" module>
  import type { Component, Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export type IconStackVariant = 'primary' | 'muted' | 'destructive' | 'success' | 'warning'
  export type IconStackSize = 'sm' | 'md' | 'lg' | 'xl'

  export interface IconStackProps extends HTMLAttributes<HTMLDivElement> {
    icon?: Component
    variant?: IconStackVariant
    size?: IconStackSize
    iconClass?: string
    children?: Snippet
  }

  const sizeMap: Record<IconStackSize, { root: string; base: string; icon: string }> = {
    sm: { root: 'size-10', base: 'size-8 rounded-lg', icon: 'size-4' },
    md: { root: 'size-14', base: 'size-11 rounded-xl', icon: 'size-5' },
    lg: { root: 'size-18', base: 'size-14 rounded-2xl', icon: 'size-7' },
    xl: { root: 'size-24', base: 'size-18 rounded-3xl', icon: 'size-9' },
  }

  const variantMap: Record<IconStackVariant, { back: string; front: string; text: string }> = {
    primary: {
      back: 'bg-primary/20 border-primary/30',
      front: 'bg-background border-primary/20 shadow-primary/10',
      text: 'text-primary',
    },
    muted: {
      back: 'bg-muted border-border',
      front: 'bg-card border-border shadow-black/5',
      text: 'text-muted-foreground',
    },
    destructive: {
      back: 'bg-destructive/20 border-destructive/30',
      front: 'bg-background border-destructive/20 shadow-destructive/10',
      text: 'text-destructive',
    },
    success: {
      back: 'bg-success/20 border-success/30',
      front: 'bg-background border-success/20 shadow-success/10',
      text: 'text-success',
    },
    warning: {
      back: 'bg-warning/20 border-warning/30',
      front: 'bg-background border-warning/20 shadow-warning/10',
      text: 'text-warning',
    },
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    icon,
    variant = 'primary',
    size = 'md',
    iconClass,
    children,
    ...restProps
  }: IconStackProps = $props()
</script>

<div
  data-uipkge
  data-slot="icon-stack"
  data-variant={variant}
  data-size={size}
  {...restProps}
  class={cn('relative inline-flex items-center justify-center select-none', sizeMap[size].root, className)}
>
  <!-- Background offset sheet -->
  <div
    aria-hidden="true"
    class={cn(
      'absolute inset-0 m-auto rotate-6 border transition-transform duration-300',
      sizeMap[size].base,
      variantMap[variant].back,
    )}
  ></div>
  <!-- Top elevated card -->
  <div
    class={cn(
      'relative z-10 flex items-center justify-center border shadow-md transition-transform duration-300 group-hover:-translate-y-0.5',
      sizeMap[size].base,
      variantMap[variant].front,
      variantMap[variant].text,
    )}
  >
    {#if children}
      {@render children()}
    {:else if icon}
      {@const Icon = icon}
      <Icon class={cn(sizeMap[size].icon, iconClass)} aria-hidden="true" />
    {/if}
  </div>
</div>
