<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Primitive } from "reka-ui";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button.variants";

// Why inline these unions instead of `ButtonVariants['variant']` /
// `ButtonVariants['size']`:
//
// `ButtonVariants` is `VariantProps<typeof buttonVariants>`. cva's
// type machinery wraps the variant keys in a conditional + indexed
// access (`{ [K in keyof Variants]?: ... }`), which Vue 3.5+'s SFC
// compiler can't resolve. Result: defineProps<> silently drops
// `variant`/`size` from the runtime declarations, every <Button
// variant="ghost"> falls back to `default`, and SidebarTrigger
// renders as a filled primary block.
//
// Inline the unions and Vue extracts them cleanly. The cva runtime
// still validates against the same option set at runtime; we just
// give the SFC compiler a type it can handle.
type Variant =
  "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type Size =
  | "default"
  | "sm"
  | "lg"
  | "xs"
  | "icon"
  | "icon-sm"
  | "icon-lg"
  | "icon-xs"
  | "icon-2xs";

interface Props {
  as?: string;
  asChild?: boolean;
  variant?: Variant;
  size?: Size;
  /** Native button type. Defaults to `button` so forms are not submitted accidentally. */
  type?: "button" | "submit" | "reset";
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
  type: "button",
});
</script>

<template>
  <Primitive
    data-uipkge
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :as="as"
    :as-child="asChild"
    :type="as === 'button' && !asChild ? type : undefined"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
