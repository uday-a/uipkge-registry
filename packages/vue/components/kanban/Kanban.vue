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

function setDraggingCard(cardId: string | null, columnId: string | null) {
  draggingCardId.value = cardId;
  draggingColumnId.value = columnId;
}

function setOverColumn(columnId: string | null) {
  overColumnId.value = columnId;
}

function emitMove(event: KanbanMoveEvent) {
  emit("card-move", event);
}

provide(KanbanContextKey, {
  draggingCardId,
  draggingColumnId,
  overColumnId,
  setDraggingCard,
  setOverColumn,
  emitMove,
});
</script>

<template>
  <div data-slot="kanban" :class="cn('w-full', props.class)">
    <slot />
  </div>
</template>
