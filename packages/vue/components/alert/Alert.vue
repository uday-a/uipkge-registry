<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AlertCircle, CheckCircle, Info, TriangleAlert } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { alertVariants } from './alert.variants'

// Inlined union: SFC compiler can't extract runtime props from
// `AlertVariants['variant']`.
const props = defineProps<{
  class?: HTMLAttributes['class']
  variant?: 'default' | 'destructive'
  icon?: 'info' | 'warning' | 'error' | 'success'
  title?: string
  text?: string
}>()
</script>

<template>
  <div role="alert" data-uipkge data-slot="alert" :class="cn(alertVariants({ variant }), props.class)">
    <!--
      Icons and composition children must be direct root descendants so the
      `[&>svg]` absolute layout in alertVariants can position and pad correctly.
    -->
    <AlertCircle v-if="icon === 'error'" class="size-4" aria-hidden="true" />
    <CheckCircle v-else-if="icon === 'success'" class="size-4" aria-hidden="true" />
    <TriangleAlert v-else-if="icon === 'warning'" class="size-4" aria-hidden="true" />
    <Info v-else-if="icon === 'info'" class="size-4" aria-hidden="true" />

    <p v-if="title" data-uipkge data-slot="alert-title" class="mb-1 text-sm leading-none font-medium tracking-tight">
      {{ title }}
    </p>
    <div
      v-if="text"
      data-uipkge
      data-slot="alert-description"
      class="text-muted-foreground text-sm leading-relaxed [&_p]:leading-relaxed"
    >
      {{ text }}
    </div>
    <slot />
  </div>
</template>
