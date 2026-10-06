<script lang="ts" module>
  import type { Component, Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export type IconBoxVariant =
    | 'primary'
    | 'muted'
    | 'outline'
    | 'solid'
    | 'subtle'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'ghost'
    | 'custom'
  export type IconBoxSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  export type IconBoxShape = 'rounded' | 'circle' | 'square'

  export interface IconBoxProps extends HTMLAttributes<HTMLDivElement> {
    icon?: Component
    variant?: IconBoxVariant
    shape?: IconBoxShape
    size?: IconBoxSize
    iconClass?: string
    children?: Snippet
  }

  const variantClasses: Record<IconBoxVariant, string> = {
    primary: 'bg-primary/10 text-primary',
    muted: 'bg-muted text-muted-foreground',
    outline: 'border border-border bg-background text-foreground shadow-xs',
    solid: 'bg-foreground text-background shadow-xs',
    subtle: 'bg-accent text-accent-foreground',
    destructive: 'bg-destructive/10 text-destructive',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    ghost: 'text-muted-foreground hover:bg-accent hover:text-foreground',
    custom: '',
  }

  const shapeClasses: Record<IconBoxShape, string> = {
    rounded: 'rounded-lg',
    circle: 'rounded-full',
    square: 'rounded-none',
  }

  const sizeClasses: Record<IconBoxSize, string> = {
    '2xs': 'size-6 p-1',
    xs: 'size-7 p-1.5',
    sm: 'size-8 p-1.5',
    md: 'size-9 p-2',
    lg: 'size-11 p-2.5',
    xl: 'size-14 p-3.5',
  }

  const iconSizes: Record<IconBoxSize, string> = {
    '2xs': 'size-3',
    xs: 'size-3.5',
    sm: 'size-4',
    md: 'size-4.5',
    lg: 'size-6',
    xl: 'size-7',
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    icon,
    variant = 'primary',
    shape = 'rounded',
    size = 'md',
    iconClass,
    children,
    ...restProps
  }: IconBoxProps = $props()
</script>

<div
  data-uipkge
  data-slot="icon-box"
  data-variant={variant}
  data-size={size}
  data-shape={shape}
  {...restProps}
  class={cn(
    'inline-flex shrink-0 items-center justify-center transition-colors',
    variantClasses[variant],
    shapeClasses[shape],
    sizeClasses[size],
    className,
  )}
>
  {#if children}
    {@render children()}
  {:else if icon}
    {@const Icon = icon}
    <Icon class={cn(iconSizes[size], iconClass)} aria-hidden="true" />
  {/if}
</div>
