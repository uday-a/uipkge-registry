<script setup lang="ts">
import ReturnsPortal from '@/components/blocks/returns-portal/ReturnsPortal.vue'
</script>

<template>
  <Story title="Default" description="Initial order lookup step with order number and email inputs.">
    <ReturnsPortal />
  </Story>

  <Story
    title="Select Items"
    description="Order items list with selection checkboxes, return reason selectors, and quantities."
  >
    <ReturnsPortal :initial-step="2" />
  </Story>

  <Story
    title="Choose Resolution"
    description="Resolution selector with exchange sizing, +10% bonus store credit, and original payment refund."
  >
    <ReturnsPortal :initial-step="3" />
  </Story>

  <Story
    title="Confirmation & Label"
    description="Success screen with instant prepaid return label download, QR code drop-off pass, and return summary."
  >
    <ReturnsPortal :initial-step="4" />
  </Story>

  <Story title="Compact" description="Self-serve returns wizard at mobile container width.">
    <div class="mx-auto max-w-md">
      <ReturnsPortal :initial-step="2" />
    </div>
  </Story>
</template>
