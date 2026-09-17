<script setup lang="ts">
import type { TagsInputItemDeleteProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { X } from "lucide-vue-next";
import { TagsInputItemDelete, useForwardProps } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps<
  TagsInputItemDeleteProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = reactiveOmit(props, "class");

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <TagsInputItemDelete
    v-bind="forwardedProps"
    data-uipkge
    data-slot="tags-input-item-delete"
    :class="
      cn(
        'hover:text-foreground focus-visible:ring-ring mr-1 flex rounded bg-transparent focus-visible:ring-2 focus-visible:outline-none',
        props.class,
      )
    "
  >
    <slot>
      <X class="h-4 w-4" aria-hidden="true" />
    </slot>
  </TagsInputItemDelete>
</template>
