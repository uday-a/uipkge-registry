<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, toRef, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { BOARD_CONTEXT, BOARD_LANE_CONTEXT } from './context'
import { boardLaneVariants } from './board.variants'

interface Props {
  id: string
  class?: HTMLAttributes['class']
  tone?: 'default' | 'plain'
  /** Disable drops on this lane. Cards inside still render and stay
   *  draggable; only the drop target is inert + visually dimmed. */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { tone: 'default', disabled: false })

const board = inject(BOARD_CONTEXT, null)
if (!board) {
  throw new Error('<BoardLane> must be a descendant of <Board>.')
}

const _laneSymbol = Symbol('BoardLane')
onMounted(() => {
  board.registerLane(_laneSymbol)
  board.registerLaneDisabled(props.id, props.disabled)
})
onBeforeUnmount(() => {
  board.unregisterLane(_laneSymbol)
  board.unregisterLaneDisabled(props.id)
})

// Keep the disabled registry in sync when the prop changes mid-flight.
watch(
  () => props.disabled,
  (v) => board.registerLaneDisabled(props.id, v),
)
watch(
  () => props.id,
  (newId, oldId) => {
    board.unregisterLaneDisabled(oldId)
    board.registerLaneDisabled(newId, props.disabled)
  },
)

const isDragOver = computed(() => board.dragOverLaneId.value === props.id)
const isAccepting = computed(() => {
  if (!board.draggingId.value) return false
  if (props.disabled) return false
  return board.isLaneAcceptingFor(props.id)
})

provide(BOARD_LANE_CONTEXT, {
  laneId: toRef(props, 'id'),
  isDragOver,
  isAccepting,
  disabled: toRef(props, 'disabled'),
})

const state = computed<'idle' | 'over' | 'rejecting'>(() => {
  if (!isDragOver.value) return 'idle'
  return isAccepting.value ? 'over' : 'rejecting'
})

const emits = defineEmits<{
  dragover: [e: DragEvent]
  drop: [e: DragEvent]
  dragleave: []
}>()

function onDragOver(e: DragEvent) {
  // Emit unconditionally so the composable can set dragOverLaneId
  // (drives the rejecting-ring visual). The composable's isAllowed
  // checks the disabled-lane registry and refuses preventDefault when
  // it should — the browser's own refuse-to-drop semantics + our
  // rejecting visual cover the rest.
  emits('dragover', e)
}
function onDrop(e: DragEvent) {
  if (props.disabled) {
    e.preventDefault()
    return
  }
  emits('drop', e)
}
function onDragLeave() {
  emits('dragleave')
}
</script>

<template>
  <div
    data-uipkge
    data-slot="board-lane"
    data-board-lane
    :data-lane-id="id"
    :data-state="state"
    :data-disabled="disabled || undefined"
    :aria-disabled="disabled || undefined"
    :class="
      cn(
        boardLaneVariants({ tone, state }),
        // Disabled lane dims only the lane chrome (border, background,
        // header). Cards inside stay legible — the rejection signal is
        // carried by the no-drop cursor + the missing accept-ring.
        disabled && 'opacity-80 [&>[data-slot=board-lane-header]]:opacity-60',
        props.class,
      )
    "
    @dragover="onDragOver"
    @drop="onDrop"
    @dragleave="onDragLeave"
  >
    <slot :is-drag-over="isDragOver" :is-accepting="isAccepting" :disabled="disabled" />
  </div>
</template>
