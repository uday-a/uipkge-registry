<script setup lang="ts">
import InvoiceCreatorWizard from '@/components/blocks/invoice-creator-wizard/InvoiceCreatorWizard.vue'

const euroRetainerItems = [
  {
    id: 'ret-1',
    description: 'Monthly Product Design Retainer (Sprint 34)',
    quantity: 1,
    unitPrice: 4500,
  },
  {
    id: 'ret-2',
    description: 'Design System Governance & Token Updates',
    quantity: 12,
    unitPrice: 150,
  },
  {
    id: 'ret-3',
    description: 'Interactive Prototyping Workshop & Team Training',
    quantity: 1,
    unitPrice: 1200,
  },
]
</script>

<template>
  <Story
    title="Default"
    description="Full interactive invoice wizard with itemized table, real-time calculations, client presets, and live printable document preview."
  >
    <InvoiceCreatorWizard />
  </Story>

  <Story
    title="European Agency Retainer"
    description="Pre-configured invoice in EUR with VAT rate, custom discount, and Net 15 payment terms."
  >
    <InvoiceCreatorWizard
      initial-invoice-number="INV-2026-EU-089"
      initial-currency="EUR"
      :initial-tax-rate="20"
      :initial-discount-value="200"
      initial-payment-terms="net15"
      :initial-items="euroRetainerItems"
    />
  </Story>
</template>
