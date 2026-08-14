<script setup lang="ts">
import MultimodalVisionPlayground from '@/components/blocks/multimodal-vision-playground/MultimodalVisionPlayground.vue'
</script>

<template>
  <Story
    title="Multimodal Vision & Document Intelligence"
    description="Visual reasoning, layout parsing & entity extraction studio with bounding box highlights, OCR extraction, tabular line item parsing, and structured RFC-8259 JSON schema generation."
  >
    <MultimodalVisionPlayground />
  </Story>

  <Story
    title="Responsive Container"
    description="Compact layout testing multi-column stack and spatial canvas scaling."
  >
    <div class="mx-auto max-w-3xl">
      <MultimodalVisionPlayground />
    </div>
  </Story>
</template>
