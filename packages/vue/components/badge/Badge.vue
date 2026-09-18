<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import { badgeVariants } from './badge.variants'

// Inlined unions: SFC compiler can't extract runtime props from
// `BadgeVariants['variant']` or reka-ui's PrimitiveProps.
const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' | null
    /** Allow the label to wrap onto multiple lines instead of clipping. */
    wrap?: boolean
    class?: HTMLAttributes['class']
    asChild?: boolean
    as?: string | object
  }>(),
  {
    // Match React Badge (`span`) so badges stay valid inside paragraphs/inline text.
    as: 'span',
  },
)

const delegatedProps = reactiveOmit(props, 'class', 'wrap')
</script>

<template>
  <Primitive
    data-uipkge
    data-slot="badge"
    :class="cn(badgeVariants({ variant, wrap }), props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </Primitive>
</template>
