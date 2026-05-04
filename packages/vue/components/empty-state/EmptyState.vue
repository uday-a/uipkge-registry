<script setup lang="ts">
import type { Component } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  icon?: Component
  title?: string
  description?: string
  role?: 'status' | 'alert'
  headingTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  class?: string
}>()
</script>

<template>
  <div
    :class="cn('flex flex-col items-center py-12 text-center', props.class)"
    :role="props.role ?? 'status'"
    :aria-live="(props.role ?? 'status') === 'alert' ? 'assertive' : 'polite'"
  >
    <component :is="icon" v-if="icon" class="text-muted-foreground mx-auto mb-3 size-10" aria-hidden="true" />
    <component :is="props.headingTag ?? 'h3'" v-if="title" class="text-foreground font-medium">
      {{ title }}
    </component>
    <p v-if="description" class="text-muted-foreground mt-1 max-w-sm text-sm">{{ description }}</p>
    <slot />
  </div>
</template>
