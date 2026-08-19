<script setup lang="ts">
import type { TabsRootEmits, TabsRootProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { TabsRoot, useForwardPropsEmits } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps<
  TabsRootProps & {
    class?: HTMLAttributes["class"];
  }
>();
const emits = defineEmits<TabsRootEmits>();

const delegated = reactiveOmit(props, "class", "orientation");
const forwarded = useForwardPropsEmits(delegated, emits);
</script>

<template>
  <TabsRoot
    data-uipkge=""
    v-bind="{
      'data-slot': 'vertical-tabs',
      orientation: 'vertical',
      ...forwarded,
    }"
    :class="cn('flex w-full gap-6', props.class)"
  >
    <slot />
  </TabsRoot>
</template>
