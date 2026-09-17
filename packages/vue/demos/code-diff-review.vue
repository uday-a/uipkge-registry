<script setup lang="ts">
import CodeDiffReview from '@/components/blocks/code-diff-review/CodeDiffReview.vue'
// CodeDiffReview is the block file the user installs. Open
// `components/blocks/CodeDiffReview.vue` after install to swap the `hunk`
// array; tone drives the row colour, so no per-line classes are needed.
</script>

<template>
  <Story
    title="Code — Diff Review"
    description="Unified diff with added and removed lines, a file path header, a reviewer note anchored to a line, and a summary bar counting the changes."
  >
    <CodeDiffReview />
  </Story>
</template>
