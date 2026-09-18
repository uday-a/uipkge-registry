<script setup lang="ts">
import type { CollapsibleTriggerProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { CollapsibleTrigger } from 'reka-ui'

// CLAUDE.md mandate: intersection form delegates type extraction to TS.
const props = defineProps<CollapsibleTriggerProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <CollapsibleTrigger data-uipkge data-slot="collapsible-trigger" v-bind="props">
    <slot />
  </CollapsibleTrigger>
</template>
