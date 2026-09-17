<script setup lang="ts">
import WholesaleB2bQuickOrder from '@/components/blocks/wholesale-b2b-quick-order/WholesaleB2bQuickOrder.vue'
</script>

<template>
  <Story
    title="Wholesale Bulk Order Matrix (Default)"
    description="Interactive wholesale B2B order matrix featuring tier 3 wholesale pricing, case pack multipliers, SKU paste bulk input, real-time freight threshold calculation, and sticky order checkout."
  >
    <WholesaleB2bQuickOrder />
  </Story>

  <Story
    title="Enterprise Partner & Custom Terms"
    description="B2B matrix configured for custom enterprise partner with Tier 4 volume discount, Net 60 invoicing terms, and customized PO reference."
  >
    <WholesaleB2bQuickOrder
      account-name="Apex Global Distribution"
      account-tier="Tier 4 Platinum Partner"
      :tier-discount-percent="42"
      payment-terms="Net 60 Invoicing"
      po-number="PO-2026-APEX-992"
    />
  </Story>
</template>
