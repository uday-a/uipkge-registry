<script setup lang="ts">
import Hero3dTiltInteractiveCanvas from '@/components/blocks/hero-3d-tilt-interactive-canvas/Hero3dTiltInteractiveCanvas.vue'
import Story from '@/components/story/Story.vue'
</script>

<template>
  <Story
    title="Default"
    description="Hardware-accelerated 3D perspective hero with dynamic specular reflection and layered z-depth cards."
  >
    <Hero3dTiltInteractiveCanvas />
  </Story>
</template>
