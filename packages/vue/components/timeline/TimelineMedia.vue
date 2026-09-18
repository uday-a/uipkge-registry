<script setup lang="ts">
import { computed, inject } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { TIMELINE_ITEM_CONTEXT, type TimelineStatus } from './context'
import { timelineMediaVariants, type TimelineMediaVariant } from './timeline.variants'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    variant?: TimelineMediaVariant
    status?: TimelineStatus
    /** Manually hide the connector line. */
    hideConnector?: boolean
    /**
     * Color the connector line using the item's status
     * (success → green, error → red, etc.) instead of the neutral border.
     */
    coloredConnector?: boolean
    /** Line style for the connector. */
    lineStyle?: 'solid' | 'dashed' | 'dotted'
  }>(),
  {
    variant: 'dot',
    lineStyle: 'solid',
  },
)

const item = inject(TIMELINE_ITEM_CONTEXT, null)

const direction = computed(() => item?.direction.value ?? 'vertical')
const isLast = computed(() => item?.isLast.value ?? true)
const effectiveStatus = computed<TimelineStatus>(() => props.status ?? item?.status.value ?? 'default')
const showConnector = computed(() => !props.hideConnector && !isLast.value)

const connectorBgClass = computed(() => {
  if (props.lineStyle === 'dashed') {
    return direction.value === 'vertical'
      ? 'border-l-2 border-dashed border-border bg-transparent w-0'
      : 'border-t-2 border-dashed border-border bg-transparent h-0'
  }
  if (props.lineStyle === 'dotted') {
    return direction.value === 'vertical'
      ? 'border-l-2 border-dotted border-border bg-transparent w-0'
      : 'border-t-2 border-dotted border-border bg-transparent h-0'
  }
  if (!props.coloredConnector) return 'bg-border'
  return {
    default: 'bg-primary',
    current: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-destructive',
    info: 'bg-info',
    muted: 'bg-muted-foreground/40',
  }[effectiveStatus.value]
})
</script>

<template>
  <div
    data-uipkge
    data-slot="timeline-media"
    :data-variant="variant"
    :class="
      cn(
        'relative flex shrink-0 items-center',
        direction === 'vertical' ? 'flex-col self-stretch' : 'flex-row items-center self-stretch',
        props.class,
      )
    "
  >
    <!-- Marker -->
    <div
      data-uipkge
      data-slot="timeline-media-marker"
      :class="
        cn(
          timelineMediaVariants({ variant, status: effectiveStatus }),
          direction === 'vertical' && variant === 'dot' && 'mt-1',
        )
      "
    >
      <slot />
    </div>

    <!-- Connector line -->
    <div
      v-if="showConnector"
      data-uipkge
      data-slot="timeline-media-connector"
      aria-hidden="true"
      :class="cn(direction === 'vertical' ? 'my-1 w-px flex-1' : 'mx-1 h-px flex-1', connectorBgClass)"
    />
  </div>
</template>
