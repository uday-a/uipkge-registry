<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

defineProps<{
  canMoveRight: boolean;
  canMoveLeft: boolean;
  oneWay?: boolean;
}>();

defineEmits<{
  (e: "move-right"): void;
  (e: "move-left"): void;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 px-2">
    <Button
      size="icon-sm"
      variant="outline"
      :disabled="!canMoveRight"
      aria-label="Move selected to right"
      @click="$emit('move-right')"
    >
      <ChevronRight aria-hidden="true" />
    </Button>
    <Button
      v-if="!oneWay"
      size="icon-sm"
      variant="outline"
      :disabled="!canMoveLeft"
      aria-label="Move selected to left"
      @click="$emit('move-left')"
    >
      <ChevronLeft aria-hidden="true" />
    </Button>
  </div>
</template>
