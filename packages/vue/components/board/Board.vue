<script setup lang="ts">
import { provide, ref, toRef, type Ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { BOARD_CONTEXT, type BoardAcceptsFn, type BoardDensity, type BoardOrientation } from './context'

interface Props {
  class?: HTMLAttributes['class']
  orientation?: BoardOrientation
  density?: BoardDensity
  /** TransitionGroup name applied by BoardLaneBody. Defaults to `motion-list`. */
  motion?: string
  /** Predicate run per drop. Defaults to always-accept. */
  accepts?: BoardAcceptsFn
  /** Imperative move from a parent's useBoard composable. */
  moveItem?: (itemId: string | string[], toLaneId: string, toIndex?: number) => void
  /** External state — pass `state.draggingId` etc. from useBoard. */
  draggingId?: string | null
  draggingIds?: readonly string[]
  dragOverLaneId?: string | null
  justMovedId?: string | null
  selectedIds?: ReadonlySet<string>
  /** Optional toggle/clearSelection from useBoard so the primitive can
   *  expose selection mutations through context (consumed by BoardCard
   *  click handler). Both default to no-ops, so Board still works with
   *  consumers that don't wire selection. */
  toggleSelection?: (itemId: string, additive?: boolean) => void
  clearSelection?: () => void
  registerAllowedLanes?: (cardId: string, lanes: readonly string[] | undefined) => void
  unregisterAllowedLanes?: (cardId: string) => void
  registerLaneDisabled?: (laneId: string, disabled: boolean) => void
  unregisterLaneDisabled?: (laneId: string) => void
  isLaneAcceptingFor?: (laneId: string) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  density: 'default',
  motion: 'motion-list',
  accepts: () => () => true,
  moveItem: () => () => {},
  draggingIds: () => [] as readonly string[],
  selectedIds: () => new Set<string>() as ReadonlySet<string>,
  toggleSelection: () => () => {},
  clearSelection: () => () => {},
  registerAllowedLanes: () => () => {},
  unregisterAllowedLanes: () => () => {},
  registerLaneDisabled: () => () => {},
  unregisterLaneDisabled: () => () => {},
  isLaneAcceptingFor: () => () => true,
})

const draggingIdRef = toRef(props, 'draggingId')
const draggingIdsRef = toRef(props, 'draggingIds')
const dragOverLaneIdRef = toRef(props, 'dragOverLaneId')
const justMovedIdRef = toRef(props, 'justMovedId')
const selectedIdsRef = toRef(props, 'selectedIds')
const laneIds = ref<symbol[]>([])

provide(BOARD_CONTEXT, {
  orientation: toRef(props, 'orientation'),
  density: toRef(props, 'density'),
  motion: toRef(props, 'motion'),
  draggingId: draggingIdRef as unknown as Ref<string | null>,
  draggingIds: draggingIdsRef as unknown as Ref<readonly string[]>,
  dragOverLaneId: dragOverLaneIdRef as unknown as Ref<string | null>,
  justMovedId: justMovedIdRef as unknown as Ref<string | null>,
  selectedIds: selectedIdsRef as unknown as Ref<ReadonlySet<string>>,
  accepts: toRef(props, 'accepts'),
  moveItem: (...args) => props.moveItem!(...args),
  toggleSelection: (...args) => props.toggleSelection!(...args),
  clearSelection: () => props.clearSelection!(),
  registerAllowedLanes: (...args) => props.registerAllowedLanes!(...args),
  unregisterAllowedLanes: (...args) => props.unregisterAllowedLanes!(...args),
  registerLaneDisabled: (...args) => props.registerLaneDisabled!(...args),
  unregisterLaneDisabled: (...args) => props.unregisterLaneDisabled!(...args),
  isLaneAcceptingFor: (laneId) => props.isLaneAcceptingFor!(laneId),
  laneIds,
  registerLane: (id) => {
    if (!laneIds.value.includes(id)) laneIds.value.push(id)
  },
  unregisterLane: (id) => {
    laneIds.value = laneIds.value.filter((i) => i !== id)
  },
})
</script>

<template>
  <div data-uipkge data-slot="board" :data-orientation="orientation" :class="cn('w-full', props.class)">
    <slot />
  </div>
</template>
