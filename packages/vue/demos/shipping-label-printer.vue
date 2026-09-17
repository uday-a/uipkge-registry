<script setup lang="ts">
import ShippingLabelPrinter from '@/components/blocks/shipping-label-printer/ShippingLabelPrinter.vue'
</script>

<template>
  <Story
    title="Shipping Label Creation & Dispatch Station"
    description="Multi-carrier shipping label workstation (FedEx, UPS, USPS, DHL) with live digital scale sync, package dimensional weight calculator, delivery accessorials, and realistic 4×6 high-contrast thermal printable label preview."
  >
    <ShippingLabelPrinter />
  </Story>

  <Story
    title="UPS Ground Preset"
    description="Pre-configured dispatch workstation preset for UPS Ground shipping with tracked guaranteed transit."
  >
    <ShippingLabelPrinter initial-carrier="ups" initial-order-ref="#ORD-94102" />
  </Story>

  <Story
    title="USPS Priority Mail Preset"
    description="Pre-configured dispatch workstation preset for USPS Priority Mail commercial rate dispatch."
  >
    <ShippingLabelPrinter initial-carrier="usps" initial-order-ref="#ORD-88231" />
  </Story>

  <Story
    title="DHL Express International Preset"
    description="Pre-configured dispatch workstation preset for DHL Express time-definite worldwide air transit."
  >
    <ShippingLabelPrinter initial-carrier="dhl" initial-order-ref="#ORD-77190" />
  </Story>
</template>
