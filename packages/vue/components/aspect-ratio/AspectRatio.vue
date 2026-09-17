<script setup lang="ts">
import type { AspectRatioProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { AspectRatio } from 'reka-ui'

// CLAUDE.md mandate: bare `defineProps<RekaUiX>()` can bail under Vue 3.5+
// because reka-ui has no exports.types. The intersection form delegates
// type extraction to TS via the installed typescript package.
const props = defineProps<AspectRatioProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AspectRatio v-slot="slotProps" data-uipkge data-slot="aspect-ratio" v-bind="props">
    <slot v-bind="slotProps" />
  </AspectRatio>
</template>
