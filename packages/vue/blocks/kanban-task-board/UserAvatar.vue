<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/composables/useKanban'
import { cn } from '@/lib/utils'

defineProps<{
  name: string
  color: string
  size?: 'xs' | 'sm' | 'md'
  class?: string
}>()

const sizeMap = {
  xs: { avatar: 'size-6', text: 'text-xs' },
  sm: { avatar: 'size-7', text: 'text-xs' },
  md: { avatar: 'size-8', text: 'text-xs' },
}
</script>

<template>
  <Avatar data-slot="kanban-board" :class="cn(sizeMap[size ?? 'sm'].avatar, 'shrink-0', $props.class)">
    <AvatarFallback :class="[sizeMap[size ?? 'sm'].text, 'font-bold', color]">
      {{ getInitials(name) }}
    </AvatarFallback>
  </Avatar>
</template>
