<script setup lang="ts">
import { provide, ref, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { KanbanContextKey, type KanbanMoveEvent } from "./context";

interface Props {
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "card-move": [event: KanbanMoveEvent];
}>();

const draggingCardId = ref<string | null>(null);
const draggingColumnId = ref<string | null>(null);
const overColumnId = ref<string | null>(null);
const grabbedCardId = ref<string | null>(null);
// Keyboard moves are silent to a screen reader — the card just appears
// somewhere else. This region narrates pick up / move / drop / cancel.
const announcement = ref("");

function setDraggingCard(cardId: string | null, columnId: string | null) {
  draggingCardId.value = cardId;
  draggingColumnId.value = columnId;
}

function setOverColumn(columnId: string | null) {
  overColumnId.value = columnId;
}

function setGrabbedCard(cardId: string | null) {
  grabbedCardId.value = cardId;
}

function emitMove(event: KanbanMoveEvent) {
  emit("card-move", event);
}

function announce(message: string) {
  // Re-assigning the same string would not re-trigger the live region.
  announcement.value = announcement.value === message ? `${message} ` : message;
}

provide(KanbanContextKey, {
  draggingCardId,
  draggingColumnId,
  overColumnId,
  grabbedCardId,
  setDraggingCard,
  setOverColumn,
  setGrabbedCard,
  emitMove,
  announce,
});
</script>

<template>
  <div data-uipkge data-slot="kanban" :class="cn('w-full', props.class)">
    <slot />
    <div
      data-slot="kanban-live-region"
      class="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ announcement }}
    </div>
  </div>
</template>
