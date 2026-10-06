<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface KanbanColumnProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    id: string
    /** Accessible name for the column, also used in keyboard move
     *  announcements ("moved to In progress"). Falls back to the id. */
    label?: string
    children?: Snippet<[{ isOver: boolean }]>
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getKanbanContext, setKanbanColumnContext } from './context'
  import { kanbanColumnVariants } from './kanban.variants'

  let { class: className, id, label, children, ref = $bindable(null), ...restProps }: KanbanColumnProps = $props()

  const kanban = getKanbanContext()

  const isOver = $derived(kanban?.overColumnId === id)

  setKanbanColumnContext({
    // svelte-ignore state_referenced_locally: column ids are static for the board's lifetime.
    columnId: id,
    get isOver() {
      return isOver
    },
    get label() {
      return label
    },
  })

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move'
    }
    if (kanban && kanban.overColumnId !== id) {
      kanban.setOverColumn(id)
    }
  }

  function handleDragLeave(e: DragEvent & { currentTarget: HTMLElement }) {
    const currentTarget = e.currentTarget
    const relatedTarget = e.relatedTarget as HTMLElement | null
    if (currentTarget?.contains(relatedTarget)) return
    if (kanban && kanban.overColumnId === id) {
      kanban.setOverColumn(null)
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    if (kanban && kanban.draggingCardId && kanban.draggingColumnId) {
      kanban.emitMove({
        cardId: kanban.draggingCardId,
        fromColumnId: kanban.draggingColumnId,
        toColumnId: id,
      })
    }
    kanban?.setDraggingCard(null, null)
    kanban?.setOverColumn(null)
  }
</script>

<div
  bind:this={ref}
  data-uipkge=""
  data-slot="kanban-column"
  role="group"
  aria-label={label ?? id}
  data-column-id={id}
  data-over={isOver ? '' : undefined}
  class={cn(kanbanColumnVariants({ isOver }), className)}
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
  {...restProps}
>
  {@render children?.({ isOver })}
</div>
