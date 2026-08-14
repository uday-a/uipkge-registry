<script setup lang="ts">
import { CommercialInvoiceGenerator } from '@/components/blocks/commercial-invoice-generator'
</script>

<template>
  <Story
    title="Default"
    description="B2B cross-border commercial customs invoice generator with HTS codes and CIF valuation."
  >
    <div class="p-4">
      <CommercialInvoiceGenerator />
    </div>
  </Story>
</template>
