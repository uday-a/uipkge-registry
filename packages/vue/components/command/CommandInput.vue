<script setup lang="ts">
import type { ListboxFilterProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { Search } from "lucide-vue-next";
import { ListboxFilter, useForwardProps } from "reka-ui";
import { cn } from "@/lib/utils";
import { useCommand } from ".";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<
    ListboxFilterProps & {
      class?: HTMLAttributes["class"];
    }
  >(),
  // Default false so inline Command embeds don't steal focus / scroll the page.
  // CommandDialog consumers can pass :auto-focus="true" for palette behavior.
  { autoFocus: false },
);

const delegatedProps = reactiveOmit(props, "class");

const forwardedProps = useForwardProps(delegatedProps);

const { filterState } = useCommand();
</script>

<template>
  <div
    data-uipkge
    data-slot="command-input-wrapper"
    class="flex h-9 items-center gap-2 border-b px-3"
  >
    <Search class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
    <ListboxFilter
      v-bind="{ ...forwardedProps, ...$attrs }"
      v-model="filterState.search"
      data-uipkge
      data-slot="command-input"
      :class="
        cn(
          'placeholder:text-muted-foreground focus-visible:ring-ring/40 flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          props.class,
        )
      "
    />
  </div>
</template>
