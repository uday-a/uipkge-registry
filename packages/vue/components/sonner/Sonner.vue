<script lang="ts" setup>
import type { ToasterProps } from 'vue-sonner'
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon, XIcon } from 'lucide-vue-next'
import { Toaster as Sonner } from 'vue-sonner'
import { cn } from '@/lib/utils'

// Sonner cadence — UX_MICROINTERACTIONS.md research:
// 4000ms default, bottom-right position so swipe-right dismiss reads
// naturally, max 3 visible (older stack with scale offset), rich colors
// so success/error/info/warning each get distinct variants.
const props = withDefaults(defineProps<ToasterProps>(), {
  position: 'bottom-right',
  duration: 4000,
  visibleToasts: 3,
  richColors: true,
  closeButton: false,
  expand: false,
})
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
    }"
    v-bind="props"
  >
    <template #success-icon>
      <CircleCheckIcon class="size-4" aria-hidden="true" />
    </template>
    <template #info-icon>
      <InfoIcon class="size-4" aria-hidden="true" />
    </template>
    <template #warning-icon>
      <TriangleAlertIcon class="size-4" aria-hidden="true" />
    </template>
    <template #error-icon>
      <OctagonXIcon class="size-4" aria-hidden="true" />
    </template>
    <template #loading-icon>
      <div>
        <Loader2Icon class="size-4 motion-safe:animate-spin" aria-hidden="true" />
      </div>
    </template>
    <template #close-icon>
      <XIcon class="size-4" aria-hidden="true" />
    </template>
  </Sonner>
</template>
