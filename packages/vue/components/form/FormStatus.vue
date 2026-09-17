<script setup lang="ts">
import type { HTMLAttributes, Component } from "vue";
import { CircleAlert, TriangleAlert, CircleCheck } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import type { FormStatus } from "./types";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  status: FormStatus;
  message: string;
}>();

const statusConfig: Record<
  NonNullable<FormStatus>,
  { icon: Component; container: string }
> = {
  error: {
    icon: CircleAlert,
    container: "bg-destructive/10 text-destructive border-destructive/20",
  },
  warning: {
    icon: TriangleAlert,
    container: "bg-warning/10 text-warning border-warning/30",
  },
  success: {
    icon: CircleCheck,
    container: "bg-success/10 text-success border-success/30",
  },
};
</script>

<template>
  <div
    v-if="status"
    data-uipkge
    data-slot="form-status"
    :role="status === 'error' ? 'alert' : 'status'"
    :class="
      cn(
        'flex items-center gap-2 rounded-md border px-3 py-2 text-sm',
        statusConfig[status].container,
        props.class,
      )
    "
  >
    <component
      :is="statusConfig[status].icon"
      class="size-4 shrink-0"
      aria-hidden="true"
    />
    <span>{{ message }}</span>
  </div>
</template>
