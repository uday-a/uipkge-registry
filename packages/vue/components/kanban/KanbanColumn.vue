<script setup lang="ts">
import { computed, inject, provide, toRef, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { KanbanColumnContextKey, KanbanContextKey } from "./context";
import { kanbanColumnVariants } from "./kanban.variants";

interface Props {
  id: string;
  /** Accessible name for the column, also used in keyboard move
   *  announcements ("moved to In progress"). Falls back to the id. */
  label?: string;
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
const kanban = inject(KanbanContextKey);

provide(KanbanColumnContextKey, {
  columnId: props.id,
  label: toRef(props, "label"),
});

const isOver = computed(() => kanban?.overColumnId.value === props.id);

function handleDragOver(e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "move";
  }
  if (kanban && kanban.overColumnId.value !== props.id) {
    kanban.setOverColumn(props.id);
  }
}

function handleDragLeave(e: DragEvent) {
  const currentTarget = e.currentTarget as HTMLElement | null;
  const relatedTarget = e.relatedTarget as HTMLElement | null;
  if (currentTarget?.contains(relatedTarget)) return;
  if (kanban && kanban.overColumnId.value === props.id) {
    kanban.setOverColumn(null);
  }
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  if (kanban && kanban.draggingCardId.value && kanban.draggingColumnId.value) {
    kanban.emitMove({
      cardId: kanban.draggingCardId.value,
      fromColumnId: kanban.draggingColumnId.value,
      toColumnId: props.id,
    });
  }
  kanban?.setDraggingCard(null, null);
  kanban?.setOverColumn(null);
}
</script>

<template>
  <div
    data-uipkge
    data-slot="kanban-column"
    role="group"
    :aria-label="label ?? id"
    :data-column-id="id"
    :data-over="isOver ? '' : undefined"
    :class="cn(kanbanColumnVariants({ isOver }), props.class)"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <slot :is-over="isOver" />
  </div>
</template>
