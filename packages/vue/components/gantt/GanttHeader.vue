<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { inject } from "vue";
import { Calendar } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { Button, ButtonGroup } from "@/components/ui/button";
import type { GanttScale } from "./types";

interface Props {
  title?: string;
  showScaleSwitcher?: boolean;
  showNavigation?: boolean;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  title: "Project Timeline",
  showScaleSwitcher: true,
  showNavigation: false,
});

const context = inject<any>("ganttContext");

function setScale(scale: GanttScale) {
  if (context?.scale) {
    context.scale.value = scale;
  }
}
</script>

<template>
  <div
    data-uipkge
    data-slot="gantt-header"
    :class="
      cn(
        'border-border bg-muted/30 flex items-center justify-between border-b px-4 py-2.5',
        props.class,
      )
    "
  >
    <div class="flex items-center gap-2">
      <Calendar class="text-primary size-4" />
      <span class="text-foreground text-sm font-semibold">{{ title }}</span>
    </div>

    <div class="flex items-center gap-3">
      <slot name="actions" />

      <ButtonGroup v-if="showScaleSwitcher && context">
        <Button
          size="xs"
          :variant="context.scale.value === 'day' ? 'default' : 'outline'"
          @click="setScale('day')"
        >
          Day
        </Button>
        <Button
          size="xs"
          :variant="context.scale.value === 'week' ? 'default' : 'outline'"
          @click="setScale('week')"
        >
          Week
        </Button>
        <Button
          size="xs"
          :variant="context.scale.value === 'month' ? 'default' : 'outline'"
          @click="setScale('month')"
        >
          Month
        </Button>
        <Button
          size="xs"
          :variant="context.scale.value === 'year' ? 'default' : 'outline'"
          @click="setScale('year')"
        >
          Year
        </Button>
      </ButtonGroup>
    </div>
  </div>
</template>
