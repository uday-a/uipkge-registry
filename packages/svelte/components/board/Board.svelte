<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { BoardAcceptsFn, BoardDensity, BoardOrientation, BoardState } from './context'

  export interface BoardProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * External state snapshot (`draggingId` / `draggingIds` / `dragOverLaneId` /
     * `justMovedId` / `selectedIds`) — the Svelte equivalent of spreading
     * React `useBoard`'s `state` into `<Board>`. Read-only: the board never
     * writes back (mutations flow through `moveItem` / `toggleSelection`).
     * When both are given, `state` fields win over the individual props below.
     */
    state?: BoardState
    orientation?: BoardOrientation
    density?: BoardDensity
    /** Transition name applied by BoardLaneBody. Defaults to `motion-list`. */
    motion?: string
    /** Predicate run per drop. Defaults to always-accept. */
    accepts?: BoardAcceptsFn
    /** Imperative move from a parent's board state helper. */
    moveItem?: (itemId: string | string[], toLaneId: string, toIndex?: number) => void
    /** External state — pass `state.draggingId` etc. from the board state helper. */
    draggingId?: string | null
    draggingIds?: readonly string[]
    dragOverLaneId?: string | null
    justMovedId?: string | null
    selectedIds?: ReadonlySet<string>
    /** Optional toggle/clearSelection from the board state helper so the
     *  primitive can expose selection mutations through context (consumed
     *  by the BoardCard click handler). Both default to no-ops, so Board
     *  still works with consumers that don't wire selection. */
    toggleSelection?: (itemId: string, additive?: boolean) => void
    clearSelection?: () => void
    registerAllowedLanes?: (cardId: string, lanes: readonly string[] | undefined) => void
    unregisterAllowedLanes?: (cardId: string) => void
    registerLaneDisabled?: (laneId: string, disabled: boolean) => void
    unregisterLaneDisabled?: (laneId: string) => void
    isLaneAcceptingFor?: (laneId: string) => boolean
    /** The root <div>, via `bind:ref`. */
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { BOARD_CONTEXT, type BoardContext } from './context'

  // NOTE: the public prop is `state`, but it is destructured as `boardState`
  // — a local named `state` would shadow the `$state` rune used below.
  let {
    class: className,
    state: boardState,
    orientation = 'horizontal',
    density = 'default',
    motion = 'motion-list',
    accepts = () => true,
    moveItem = () => {},
    draggingId = null,
    draggingIds = [],
    dragOverLaneId = null,
    justMovedId = null,
    selectedIds = new Set<string>(),
    toggleSelection = () => {},
    clearSelection = () => {},
    registerAllowedLanes = () => {},
    unregisterAllowedLanes = () => {},
    registerLaneDisabled = () => {},
    unregisterLaneDisabled = () => {},
    isLaneAcceptingFor = () => true,
    children,
    ref = $bindable(null),
    ...restProps
  }: BoardProps = $props()

  let laneIds = $state<symbol[]>([])

  // Getters keep the context reactive: children reading these inside
  // `$derived` re-run when the parent's props change.
  setContext<BoardContext>(BOARD_CONTEXT, {
    get orientation() {
      return orientation
    },
    get density() {
      return density
    },
    get motion() {
      return motion
    },
    get draggingId() {
      return boardState?.draggingId ?? draggingId
    },
    get draggingIds() {
      return boardState?.draggingIds ?? draggingIds
    },
    get dragOverLaneId() {
      return boardState?.dragOverLaneId ?? dragOverLaneId
    },
    get justMovedId() {
      return boardState?.justMovedId ?? justMovedId
    },
    get selectedIds() {
      return boardState?.selectedIds ?? selectedIds
    },
    get accepts() {
      return accepts
    },
    moveItem: (...args) => moveItem(...args),
    toggleSelection: (...args) => toggleSelection(...args),
    clearSelection: () => clearSelection(),
    registerAllowedLanes: (...args) => registerAllowedLanes(...args),
    unregisterAllowedLanes: (...args) => unregisterAllowedLanes(...args),
    registerLaneDisabled: (...args) => registerLaneDisabled(...args),
    unregisterLaneDisabled: (...args) => unregisterLaneDisabled(...args),
    isLaneAcceptingFor: (laneId) => isLaneAcceptingFor(laneId),
    get laneIds() {
      return laneIds
    },
    registerLane: (id) => {
      if (!laneIds.includes(id)) laneIds.push(id)
    },
    unregisterLane: (id) => {
      laneIds = laneIds.filter((i) => i !== id)
    },
  })
</script>

<div bind:this={ref} data-uipkge="" data-slot="board" data-orientation={orientation} class={cn('w-full', className)} {...restProps}>
  {@render children?.()}
</div>
