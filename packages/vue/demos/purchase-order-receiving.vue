<script setup lang="ts">
import { PurchaseOrderReceiving } from '@/components/blocks/purchase-order-receiving'
</script>

<template>
  <Story
    title="Default"
    description="Inbound dock receiving workbench with PO line item matching, QA discrepancy logging, and GRN generation."
  >
    <div class="p-4">
      <PurchaseOrderReceiving />
    </div>
  </Story>
</template>
