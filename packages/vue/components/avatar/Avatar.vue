<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, provide, ref } from 'vue'
import { cn } from '@/lib/utils'
import { avatarVariants } from './avatar.variants'
import { AVATAR_INJECTION_KEY, type AvatarImageStatus } from './context'

// Inlined unions: SFC compiler can't extract runtime props from
// `AvatarVariants['size']` etc. indexed-access types.
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'
    rounded?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
    color?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'error' | 'muted'
    variant?: 'default' | 'outlined' | 'soft'
    tile?: boolean
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    tile: false,
    disabled: false,
    loading: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event)
  }
}

const imageStatus = ref<AvatarImageStatus>('idle')

provide(AVATAR_INJECTION_KEY, {
  imageStatus,
  setImageStatus: (status) => {
    imageStatus.value = status
  },
})

const rootClasses = computed(() =>
  cn(
    avatarVariants({ size: props.size, rounded: props.rounded, color: props.color, variant: props.variant }),
    props.tile ? 'rounded-none' : '',
    props.disabled ? 'cursor-not-allowed opacity-50' : '',
    props.loading ? 'animate-pulse' : '',
    props.class,
  ),
)
</script>

<template>
  <span :class="rootClasses" data-uipkge data-slot="avatar" @click="handleClick">
    <slot />
  </span>
</template>
