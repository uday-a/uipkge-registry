<script setup lang="ts">
import type { HTMLAttributes, VNode } from 'vue'
import { Comment, Fragment, Text, computed, defineComponent, useSlots } from 'vue'
import { cn } from '@/lib/utils'

export interface AvatarGroupProps {
  class?: HTMLAttributes['class']
  max?: number
  overlap?: boolean
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'
  /** Override the total used for +N when only a subset of avatars is rendered. */
  total?: number
}

const props = withDefaults(defineProps<AvatarGroupProps>(), {
  overlap: true,
  size: 'default',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  emit('click', event)
}

const slots = useSlots()

function flattenVNodes(nodes: VNode[] | undefined): VNode[] {
  const out: VNode[] = []
  for (const node of nodes ?? []) {
    if (!node) continue
    if (node.type === Comment) continue
    if (node.type === Text && !String(node.children ?? '').trim()) continue
    if (node.type === Fragment) {
      out.push(...flattenVNodes(node.children as VNode[]))
    } else {
      out.push(node)
    }
  }
  return out
}

const allChildren = computed(() => flattenVNodes(slots.default?.() as VNode[] | undefined))
const totalCount = computed(() => props.total ?? allChildren.value.length)
// When overflowing, reserve one slot for the +N chip so max includes the badge.
const isOverflowing = computed(() => props.max != null && totalCount.value > props.max)
const visibleLimit = computed(() =>
  isOverflowing.value ? Math.max((props.max ?? 0) - 1, 0) : allChildren.value.length,
)
const overflowCount = computed(() => (isOverflowing.value ? totalCount.value - visibleLimit.value : 0))
const visibleChildren = computed(() => allChildren.value.slice(0, visibleLimit.value))

const overflowSizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'size-4 text-xs'
    case 'sm':
      return 'size-6 text-xs'
    case 'lg':
      return 'size-12 text-base'
    case 'xl':
      return 'size-16 text-lg'
    case '2xl':
      return 'size-20 text-xl'
    default:
      return 'size-8 text-sm'
  }
})

// Render pre-flattened VNodes from the default slot.
const VisibleAvatars = defineComponent({
  name: 'AvatarGroupVisible',
  setup() {
    return () => visibleChildren.value
  },
})
</script>

<template>
  <div
    :class="cn('flex items-center', overlap ? '-space-x-2' : 'gap-1', props.class)"
    data-uipkge
    data-slot="avatar-group"
    @click="handleClick"
  >
    <VisibleAvatars />
    <div
      v-if="isOverflowing"
      :class="
        cn('bg-muted ring-background relative flex shrink-0 overflow-hidden rounded-full ring-2', overflowSizeClass)
      "
    >
      <slot name="overflow" :count="overflowCount">
        <span class="flex size-full items-center justify-center font-medium">+{{ overflowCount }}</span>
      </slot>
    </div>
  </div>
</template>
