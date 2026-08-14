<script setup lang="ts">
import FreightQuoteCalculator from '@/components/blocks/freight-quote-calculator/FreightQuoteCalculator.vue'
</script>

<template>
  <Story
    title="Interactive Freight Rate & Cargo Quote Calculator"
    description="Multimodal Air, Ocean, and Ground freight rate estimator with CBM volumetric weight calculation, interactive dimensions, value-added services, and live sticky quote comparison."
  >
    <FreightQuoteCalculator />
  </Story>

  <Story
    title="Transatlantic Freight Lane (Rotterdam to New York)"
    description="Preconfigured European trade route with EUR currency, 12 pallets volume, and dynamic container capacity estimation."
  >
    <FreightQuoteCalculator
      initial-origin="NLRTM"
      initial-destination="USNYC"
      :initial-pallets="12"
      :initial-length-cm="120"
      :initial-width-cm="100"
      :initial-height-cm="180"
      :initial-gross-weight-kg="450"
      initial-currency="EUR"
    />
  </Story>

  <Story
    title="Express Air Cargo Consignment (Singapore to Felixstowe)"
    description="High-priority air cargo configuration with Singapore hub origin, GBP currency, and 4 high-density pallets."
  >
    <FreightQuoteCalculator
      initial-origin="SGSIN"
      initial-destination="GBFXT"
      :initial-pallets="4"
      :initial-length-cm="120"
      :initial-width-cm="80"
      :initial-height-cm="140"
      :initial-gross-weight-kg="220"
      initial-currency="GBP"
    />
  </Story>
</template>
