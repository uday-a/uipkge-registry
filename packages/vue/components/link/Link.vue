<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { cn } from "@/lib/utils";
import { linkVariants } from "./link.variants";

type Underline = "none" | "always" | "hover";
type Color = "default" | "primary" | "muted";
type Size = "sm" | "default" | "lg";

interface Props {
  /** External URL — renders an <a> with target/rel handling. */
  href?: string;
  /** Router destination — renders a router-link when vue-router is present. */
  to?: string | object;
  as?: string;
  asChild?: boolean;
  underline?: Underline;
  color?: Color;
  size?: Size;
  disabled?: boolean;
  /** Open external href in a new tab. Defaults to true for http(s) hrefs. */
  external?: boolean;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  as: "a",
  underline: "hover",
  color: "primary",
  size: "default",
  external: undefined,
});

const isExternal = computed(() => {
  if (props.external !== undefined) return props.external;
  return typeof props.href === "string" && /^https?:\/\//.test(props.href);
});

const resolvedTag = computed(() => {
  if (props.asChild) return Primitive;
  if (props.to) return "router-link";
  return props.as;
});

const resolvedHref = computed(() => props.to ?? props.href);

const externalAttrs = computed(() =>
  isExternal.value ? { target: "_blank", rel: "noopener noreferrer" } : {},
);
</script>

<template>
  <component
    :is="resolvedTag"
    data-uipkge
    data-slot="link"
    :data-underline="underline"
    :data-color="color"
    :data-size="size"
    :data-disabled="disabled ? '' : undefined"
    :as="asChild ? as : undefined"
    :as-child="asChild"
    :to="disabled ? undefined : to"
    :href="disabled ? undefined : resolvedHref"
    :aria-disabled="disabled ? 'true' : undefined"
    :tabindex="disabled ? -1 : undefined"
    v-bind="disabled ? {} : externalAttrs"
    :class="
      cn(
        linkVariants({ underline, color, size }),
        disabled && 'pointer-events-none opacity-50',
        props.class,
      )
    "
    @click="
      (e: MouseEvent) => {
        if (disabled) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    "
  >
    <slot name="left" />
    <slot />
    <slot name="right" />
  </component>
</template>
