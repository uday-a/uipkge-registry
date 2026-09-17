<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue";
import { computed, ref } from "vue";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Fab } from "@/components/ui/fab";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-vue-next";

export interface SpeedDialAction {
  icon: Component;
  label: string;
  handler?: () => void;
  disabled?: boolean;
  class?: HTMLAttributes["class"];
}

type Direction = "up" | "down" | "left" | "right";
type Trigger = "click" | "hover";

interface Props {
  actions: SpeedDialAction[];
  /** Main FAB icon. */
  icon?: Component;
  /** Accessible label for the main FAB. */
  label?: string;
  direction?: Direction;
  trigger?: Trigger;
  /** Close the dial after an action is triggered. */
  closeOnAction?: boolean;
  variant?: "default" | "secondary" | "destructive" | "outline";
  position?:
    | "bottom-right"
    | "bottom-left"
    | "top-right"
    | "top-left"
    | "bottom-center"
    | "inline";
  absolute?: boolean;
  disabled?: boolean;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  direction: "up",
  trigger: "click",
  closeOnAction: true,
  variant: "default",
  position: "bottom-right",
  absolute: false,
});

const open = ref(false);
let hoverTimer: ReturnType<typeof setTimeout> | null = null;

function onTriggerEnter() {
  if (props.disabled || props.trigger !== "hover") return;
  if (hoverTimer) clearTimeout(hoverTimer);
  open.value = true;
}

function onTriggerLeave() {
  if (props.trigger !== "hover") return;
  if (hoverTimer) clearTimeout(hoverTimer);
  hoverTimer = setTimeout(() => (open.value = false), 150);
}

function onContentEnter() {
  if (props.trigger !== "hover") return;
  if (hoverTimer) clearTimeout(hoverTimer);
}

function onContentLeave() {
  if (props.trigger !== "hover") return;
  if (hoverTimer) clearTimeout(hoverTimer);
  hoverTimer = setTimeout(() => (open.value = false), 150);
}

function onOpenChange(next: boolean) {
  // Trigger is a wrapper div (as-child); Fab disabled alone does not block Popover.
  if (props.disabled) {
    open.value = false;
    return;
  }
  open.value = next;
}

function runAction(action: SpeedDialAction) {
  if (action.disabled) return;
  action.handler?.();
  if (props.closeOnAction) open.value = false;
}

const side = computed(() => {
  switch (props.direction) {
    case "up":
      return "top";
    case "down":
      return "bottom";
    case "left":
      return "left";
    case "right":
      return "right";
  }
});

const listClass = computed(() => {
  const base = "flex items-center gap-3";
  return props.direction === "up" || props.direction === "down"
    ? `${base} flex-col`
    : `${base} flex-row`;
});
</script>

<template>
  <Popover :open="open" @update:open="onOpenChange">
    <PopoverTrigger as-child>
      <div
        data-uipkge
        data-slot="speed-dial"
        :class="cn(props.class)"
        @mouseenter="onTriggerEnter"
        @mouseleave="onTriggerLeave"
      >
        <Fab
          :variant="variant"
          :position="position"
          :absolute="absolute"
          :disabled="disabled"
          :aria-label="label || 'Quick actions'"
          :aria-expanded="open"
          aria-haspopup="menu"
          :class="
            cn(
              'transition-[color,background-color,box-shadow,transform,scale,translate,rotate] duration-200',
              open && 'rotate-45',
            )
          "
          @click="trigger === 'hover' ? $event.stopPropagation() : undefined"
        >
          <component :is="icon" v-if="icon" />
          <Plus v-else />
        </Fab>
      </div>
    </PopoverTrigger>

    <PopoverContent
      :side="side"
      align="center"
      :side-offset="12"
      :class="
        cn(
          'w-auto border-0 bg-transparent p-0 shadow-none',
          trigger === 'hover' && 'pointer-events-auto',
        )
      "
      @mouseenter="onContentEnter"
      @mouseleave="onContentLeave"
    >
      <div :class="listClass">
        <button
          v-for="(action, i) in actions"
          :key="i"
          type="button"
          data-slot="speed-dial-action"
          :disabled="action.disabled"
          :aria-label="action.label"
          :style="{ animationDelay: `${i * 40}ms` }"
          class="group/speed-dial-item bg-background text-foreground hover:bg-accent hover:text-accent-foreground motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 focus-visible:ring-ring/50 inline-flex size-12 items-center justify-center rounded-full border shadow-md transition-colors outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5"
          :class="action.class"
          @click="runAction(action)"
        >
          <component :is="action.icon" />
          <span class="sr-only">{{ action.label }}</span>
        </button>
      </div>
    </PopoverContent>
  </Popover>
</template>
