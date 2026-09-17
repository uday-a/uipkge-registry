<script setup lang="ts">
import type { CollapsibleRootEmits, CollapsibleRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { CollapsibleRoot, useForwardPropsEmits } from 'reka-ui'

// CLAUDE.md mandate: bare `defineProps<RekaUiX>()` can bail under Vue 3.5+
// because reka-ui has no exports.types. The intersection form delegates
// type extraction to TS via the installed typescript package.
const props = defineProps<CollapsibleRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<CollapsibleRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <CollapsibleRoot v-slot="slotProps" data-uipkge data-slot="collapsible" v-bind="forwarded">
    <slot v-bind="slotProps" />
  </CollapsibleRoot>
</template>
