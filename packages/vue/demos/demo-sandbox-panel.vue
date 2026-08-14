<script setup lang="ts">
import DemoSandboxPanel from '@/components/blocks/demo-sandbox-panel/DemoSandboxPanel.vue'
// DemoSandboxPanel is the block file the user installs. Open\n// `components/blocks/DemoSandboxPanel.vue` after install to point the\n// preview at a real endpoint; the stub recomputes locally.
</script>

<template>
  <Story
    title="Demo — Sandbox Panel"
    description="Editing a definition field updates the rendered result and the generated query side by side, with a reset back to the starting state."
  >
    <DemoSandboxPanel />
  </Story>
</template>
