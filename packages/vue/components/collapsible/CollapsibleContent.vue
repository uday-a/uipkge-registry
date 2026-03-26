<script setup lang="ts">
import type { CollapsibleContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { CollapsibleContent } from 'reka-ui'

// CLAUDE.md mandate: intersection form delegates type extraction to TS.
const props = defineProps<CollapsibleContentProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <CollapsibleContent data-uipkge data-slot="collapsible-content" v-bind="props">
    <slot />
  </CollapsibleContent>
</template>
