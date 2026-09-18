<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import { sidebarMenuButtonVariants } from './sidebar.variants'

// Inline `as`/`asChild` from PrimitiveProps -- see Button.vue for why
// `extends /* @vue-ignore */ PrimitiveProps` was wrong: the annotation
// drops every interface field from runtime props, not just the
// extended ones, so variant/size/isActive silently become attrs.
//
// Same goes for variant/size: the SFC compiler can't extract them
// from `SidebarMenuButtonVariants['variant']` indexed-access types,
// so the unions are inlined explicitly.
export interface SidebarMenuButtonProps {
  as?: string
  asChild?: boolean
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  isActive?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<SidebarMenuButtonProps>(), {
  as: 'button',
  variant: 'default',
  size: 'default',
})
</script>

<template>
  <Primitive
    data-uipkge
    data-slot="sidebar-menu-button"
    data-sidebar="menu-button"
    :data-size="size"
    :data-active="isActive"
    :class="cn(sidebarMenuButtonVariants({ variant, size }), props.class)"
    :as="as"
    :as-child="asChild"
    v-bind="$attrs"
  >
    <slot />
  </Primitive>
</template>
