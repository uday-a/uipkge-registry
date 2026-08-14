<script setup lang="ts">
import BeforeAfterSideBySide from '@/components/blocks/before-after-side-by-side/BeforeAfterSideBySide.vue'
// BeforeAfterSideBySide is the block file the user installs. Open
// `components/blocks/BeforeAfterSideBySide.vue` after install to replace the
// panels; the annotation row is what makes the difference legible.
</script>

<template>
  <Story
    title="Before & After — Side by Side"
    description="Two labelled panels at equal height with a shared annotation row beneath — for comparisons where a drag slider hides half the evidence."
  >
    <BeforeAfterSideBySide />
  </Story>
</template>
