<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div
    data-uipkge
    data-slot="list-item-media"
    :class="cn('flex shrink-0 items-center justify-center self-center', props.class)"
  >
    <slot />
  </div>
</template>
