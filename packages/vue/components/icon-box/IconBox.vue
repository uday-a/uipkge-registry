<script setup lang="ts">
import type { Component } from 'vue'
import { cn } from '@/lib/utils'

type Variant =
  'primary' | 'muted' | 'outline' | 'solid' | 'subtle' | 'destructive' | 'success' | 'warning' | 'ghost' | 'custom'
type Size = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Shape = 'rounded' | 'circle' | 'square'

const props = withDefaults(
  defineProps<{
    icon?: Component
    variant?: Variant
    shape?: Shape
    size?: Size
    class?: string
    iconClass?: string
  }>(),
  {
    variant: 'primary',
    shape: 'rounded',
    size: 'md',
  },
)

const variantClasses: Record<Variant, string> = {
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

const shapeClasses: Record<Shape, string> = {
  rounded: 'rounded-lg',
  circle: 'rounded-full',
  square: 'rounded-none',
}

const sizeClasses: Record<Size, string> = {
  '2xs': 'size-6 p-1',
  xs: 'size-7 p-1.5',
  sm: 'size-8 p-1.5',
  md: 'size-9 p-2',
  lg: 'size-11 p-2.5',
  xl: 'size-14 p-3.5',
}

const iconSizes: Record<Size, string> = {
  '2xs': 'size-3',
  xs: 'size-3.5',
  sm: 'size-4',
  md: 'size-4.5',
  lg: 'size-6',
  xl: 'size-7',
}
</script>

<template>
  <div
    data-uipkge
    data-slot="icon-box"
    :data-variant="variant"
    :data-size="size"
    :data-shape="shape"
    :class="
      cn(
        'inline-flex shrink-0 items-center justify-center transition-colors',
        variantClasses[variant],
        shapeClasses[shape],
        sizeClasses[size],
        props.class,
      )
    "
  >
    <slot>
      <component :is="icon" v-if="icon" :class="cn(iconSizes[size], props.iconClass)" aria-hidden="true" />
    </slot>
  </div>
</template>
