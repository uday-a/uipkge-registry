<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <main
    data-uipkge
    data-slot="sidebar-inset"
    :class="
      cn(
        // min-w-0 is load-bearing: a flex-1 child without it inherits min-width: auto,
        // which means any single wide descendant (chart, table, code block) blows the
        // inset's width past its grid track. The upstream shadcn-ui sidebar omits this.
        'bg-background relative flex w-full min-w-0 flex-1 flex-col',
        'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
        props.class,
      )
    "
  >
    <slot />
  </main>
</template>
