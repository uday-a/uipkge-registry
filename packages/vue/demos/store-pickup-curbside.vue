<script setup lang="ts">
import StorePickupCurbside from '@/components/blocks/store-pickup-curbside/StorePickupCurbside.vue'
</script>

<template>
  <Story
    title="Store Pickup & Curbside Coordination"
    description="Buy Online Pick Up in Store (BOPIS) & curbside pickup coordination board with customer arrival parking check-in, real-time staging bin tracking, runner fulfillment dispatch, and SLA monitoring."
  >
    <StorePickupCurbside />
  </Story>

  <Story
    title="Curbside Bay Filtered"
    description="Curbside pickup mode view showing parking bays #1-#6 with live vehicle arrival status and hazard light alerts."
  >
    <StorePickupCurbside initial-mode-filter="curbside" />
  </Story>

  <Story
    title="In-Store Pickup Desk"
    description="In-store customer desk staging view with secure smart locker PINs and counter bays."
  >
    <StorePickupCurbside initial-mode-filter="in_store" />
  </Story>

  <Story
    title="Mobile Viewport"
    description="Responsive coordination board stacked at compact viewport container width."
  >
    <div class="mx-auto max-w-sm">
      <StorePickupCurbside />
    </div>
  </Story>
</template>
