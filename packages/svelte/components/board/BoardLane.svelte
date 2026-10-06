<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { BoardLaneVariantsProps } from './board.variants'

  export interface BoardLaneSlotProps {
    isDragOver: boolean
    isAccepting: boolean
    disabled: boolean
  }

  export interface BoardLaneProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'ondragover' | 'ondrop' | 'ondragleave'> {
    id: string
    tone?: BoardLaneVariantsProps['tone']
    /** Disable drops on this lane. Cards inside still render and stay
     *  draggable; only the drop target is inert + visually dimmed. */
    disabled?: boolean
    children?: Snippet<[BoardLaneSlotProps]>
    /** The lane <div>, via `bind:ref`. */
    ref?: HTMLDivElement | null
    ondragover?: (e: DragEvent) => void
    ondrop?: (e: DragEvent) => void
    ondragleave?: () => void
  }
</script>

<script lang="ts">
  import { getContext, onMount, setContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { BOARD_CONTEXT, BOARD_LANE_CONTEXT, type BoardContext, type BoardLaneContext } from './context'
  import { boardLaneVariants } from './board.variants'

  let {
    class: className,
    id,
    tone = 'default',
    disabled = false,
    children,
    ref = $bindable(null),
    ondragover,
    ondrop,
    ondragleave,
    ...restProps
  }: BoardLaneProps = $props()

  const boardContext = getContext<BoardContext | null>(BOARD_CONTEXT)
  if (!boardContext) {
    throw new Error('<BoardLane> must be a descendant of <Board>.')
  }
  // Non-nullable alias: the throw above proves presence, and a plain const
  // keeps the narrowing inside every closure below.
  const board: BoardContext = boardContext

  const laneSymbol = Symbol('BoardLane')
  onMount(() => {
    board.registerLane(laneSymbol)
    return () => board.unregisterLane(laneSymbol)
  })

  // Keep the disabled registry in sync when the id/disabled props change.
  let prevId = id
  $effect(() => {
    if (prevId !== id) {
      board.unregisterLaneDisabled(prevId)
      prevId = id
    }
    board.registerLaneDisabled(id, disabled)
  })
  onMount(() => {
    return () => board.unregisterLaneDisabled(prevId)
  })

  const isDragOver = $derived(board.dragOverLaneId === id)
  const isAccepting = $derived.by(() => {
    if (!board.draggingId) return false
    if (disabled) return false
    return board.isLaneAcceptingFor(id)
  })

  setContext<BoardLaneContext>(BOARD_LANE_CONTEXT, {
    get laneId() {
      return id
    },
    get isDragOver() {
      return isDragOver
    },
    get isAccepting() {
      return isAccepting
    },
    get disabled() {
      return disabled
    },
  })

  const state = $derived.by<'idle' | 'over' | 'rejecting'>(() => {
    if (!isDragOver) return 'idle'
    return isAccepting ? 'over' : 'rejecting'
  })

  function onDragOver(e: DragEvent) {
    // Call unconditionally so the state helper can set dragOverLaneId
    // (drives the rejecting-ring visual). The helper's isAllowed
    // checks the disabled-lane registry and refuses preventDefault when
    // it should — the browser's own refuse-to-drop semantics + our
    // rejecting visual cover the rest.
    ondragover?.(e)
  }
  function onDrop(e: DragEvent) {
    if (disabled) {
      e.preventDefault()
      return
    }
    ondrop?.(e)
  }
  function onDragLeave() {
    ondragleave?.()
  }
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="board-lane"
  data-board-lane=""
  data-lane-id={id}
  data-state={state}
  data-disabled={disabled || undefined}
  aria-disabled={disabled || undefined}
  class={cn(
    boardLaneVariants({ tone, state }),
    // Disabled lane dims only the lane chrome (border, background,
    // header). Cards inside stay legible — the rejection signal is
    // carried by the no-drop cursor + the missing accept-ring.
    disabled && 'opacity-80 [&>[data-slot=board-lane-header]]:opacity-60',
    className,
  )}
  ondragover={onDragOver}
  ondrop={onDrop}
  ondragleave={onDragLeave}
  {...restProps}
>
  {@render children?.({ isDragOver, isAccepting, disabled })}
</div>
