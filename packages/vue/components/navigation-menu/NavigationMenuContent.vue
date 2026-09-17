<script setup lang="ts">
import type {
  NavigationMenuContentEmits,
  NavigationMenuContentProps,
} from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { NavigationMenuContent, useForwardPropsEmits } from "reka-ui";
import { cn } from "@/lib/utils";
import { navigationMenuContentVariants } from "./navigation-menu-content.variants";

const props = defineProps<
  NavigationMenuContentProps & { class?: HTMLAttributes["class"] }
>();
const emits = defineEmits<NavigationMenuContentEmits>();

const delegatedProps = reactiveOmit(props, "class");

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <NavigationMenuContent
    data-uipkge
    data-slot="navigation-menu-content"
    v-bind="forwarded"
    :class="
      cn(
        navigationMenuContentVariants(),
        'group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:motion-safe:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:motion-safe:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:motion-safe:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:motion-safe:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:motion-safe:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:motion-safe:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none',
        props.class,
      )
    "
  >
    <slot />
  </NavigationMenuContent>
</template>
