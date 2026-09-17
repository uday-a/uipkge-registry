<script setup lang="ts">
import { FeatureCodePreviewSplit } from '@/components/blocks/feature-code-preview-split'
import Story from '@/components/story/Story.vue'
</script>

<template>
  <Story title="Default" description="Dual-pane developer sandbox with live code generation and interactive preview">
    <div class="w-full">
      <FeatureCodePreviewSplit />
    </div>
  </Story>
</template>
