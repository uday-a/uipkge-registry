<script setup lang="ts">
import type { ContextMenuItemEmits, ContextMenuItemProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { ContextMenuItem, useForwardPropsEmits } from "reka-ui";
import { cn } from "@/lib/utils";
import {
  contextMenuItemVariants,
  type ContextMenuItemVariants,
} from "./context-menu-item.variants";

const props = withDefaults(
  defineProps<
    ContextMenuItemProps & {
      class?: HTMLAttributes["class"];
      inset?: boolean;
      variant?: ContextMenuItemVariants["variant"];
    }
  >(),
  {
    variant: "default",
  },
);
const emits = defineEmits<ContextMenuItemEmits>();

const delegatedProps = reactiveOmit(props, "class");

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <ContextMenuItem
    data-uipkge
    data-slot="context-menu-item"
    :data-inset="inset ? '' : undefined"
    :data-variant="variant"
    v-bind="forwarded"
    :class="cn(contextMenuItemVariants({ variant, inset }), props.class)"
  >
    <slot />
  </ContextMenuItem>
</template>
