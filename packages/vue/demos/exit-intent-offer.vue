<script setup lang="ts">
import ExitIntentOffer from '@/components/blocks/exit-intent-offer/ExitIntentOffer.vue'
// ExitIntentOffer is the block file the user installs. Open
// `components/blocks/ExitIntentOffer.vue` after install to change the offer.
// The listener watches for the pointer leaving through the top edge only.
</script>

<template>
  <Story
    title="Exit Intent — Offer"
    description="Fires once per session when the pointer leaves toward the browser chrome, offering an extended trial. Move the cursor above the frame to trigger it."
  >
    <ExitIntentOffer />
  </Story>
</template>
