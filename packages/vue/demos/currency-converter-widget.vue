<script setup lang="ts">
import CurrencyConverterWidget from '@/components/blocks/currency-converter-widget/CurrencyConverterWidget.vue'
</script>

<template>
  <Story
    title="Currency Converter & International Transfer"
    description="Wise and Revolut-style real-time multi-currency exchange calculator and transfer fee estimator with live mid-market rates, transparent fee breakdown rail, bank savings comparison, and quick-rate ticker."
  >
    <CurrencyConverterWidget />
  </Story>

  <Story
    title="Transatlantic Corridor (GBP to EUR)"
    description="Pre-configured currency corridor for British Pound to Euro transfers with real-time fee breakdown and bank savings estimate."
  >
    <CurrencyConverterWidget :initial-send-amount="2500" initial-from-currency="GBP" initial-to-currency="EUR" />
  </Story>

  <Story
    title="Asia-Pacific Corridor (USD to JPY)"
    description="High-volume international transfer from US Dollar to Japanese Yen with zero-decimal formatting and Zengin settlement speed."
  >
    <CurrencyConverterWidget :initial-send-amount="5000" initial-from-currency="USD" initial-to-currency="JPY" />
  </Story>
</template>
