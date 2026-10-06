<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { KanbanMoveEvent } from './context'

  export interface KanbanProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
    /** Fired when a card moves within or across columns (pointer drop or keyboard move). */
    oncardmove?: (event: KanbanMoveEvent) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { setKanbanContext } from './context'

  let { class: className, children, oncardmove, ref = $bindable(null), ...restProps }: KanbanProps = $props()

  let draggingCardId = $state<string | null>(null)
  let draggingColumnId = $state<string | null>(null)
  let overColumnId = $state<string | null>(null)
  let grabbedCardId = $state<string | null>(null)
  // Keyboard moves are silent to a screen reader — the card just appears
  // somewhere else. This region narrates pick up / move / drop / cancel.
  let announcement = $state('')

  setKanbanContext({
    get draggingCardId() {
      return draggingCardId
    },
    get draggingColumnId() {
      return draggingColumnId
    },
    get overColumnId() {
      return overColumnId
    },
    get grabbedCardId() {
      return grabbedCardId
    },
    setDraggingCard(cardId, columnId) {
      draggingCardId = cardId
      draggingColumnId = columnId
    },
    setOverColumn(columnId) {
      overColumnId = columnId
    },
    setGrabbedCard(cardId) {
      grabbedCardId = cardId
    },
    emitMove(event) {
      oncardmove?.(event)
    },
    announce(message) {
      // Re-assigning the same string would not re-trigger the live region.
      announcement = announcement === message ? `${message} ` : message
    },
  })
</script>

<div bind:this={ref} data-uipkge="" data-slot="kanban" class={cn('w-full', className)} {...restProps}>
  {@render children?.()}
  <div data-slot="kanban-live-region" class="sr-only" role="status" aria-live="polite" aria-atomic="true">
    {announcement}
  </div>
</div>
