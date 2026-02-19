<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, inject } from 'vue'
import { cn } from '@/lib/utils'
import { avatarFallbackVariants } from './avatar.variants'
import { AVATAR_INJECTION_KEY } from './context'

// Inlined unions: SFC compiler can't extract runtime props from
// indexed-access types.
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'
    color?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'error' | 'muted'
    text?: string
  }>(),
  {
    size: 'default',
    color: 'default',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  emit('click', event)
}

// Show fallback until a sibling AvatarImage reports loaded (Radix composition).
const ctx = inject(AVATAR_INJECTION_KEY, null)
const visible = computed(() => !ctx || ctx.imageStatus.value !== 'loaded')

const rootClasses = computed(() => cn(avatarFallbackVariants({ size: props.size, color: props.color }), props.class))
</script>

<template>
  <span v-if="visible" :class="rootClasses" data-uipkge data-slot="avatar-fallback" @click="handleClick">
    <template v-if="text">{{ text }}</template>
    <slot v-else />
  </span>
</template>
