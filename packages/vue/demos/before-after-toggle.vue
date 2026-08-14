<script setup lang="ts">
import BeforeAfterToggle from '@/components/blocks/before-after-toggle/BeforeAfterToggle.vue'
// BeforeAfterToggle is the block file the user installs. Open
// `components/blocks/BeforeAfterToggle.vue` after install to swap the two
// states for real screenshots; the panel holds a fixed height between them.
</script>

<template>
  <Story
    title="Before & After — Toggle"
    description="One panel toggling between the old and new state of the same screen, captioned with what changed. The control keeps its position across switches."
  >
    <BeforeAfterToggle />
  </Story>
</template>
