<script setup lang="ts">
import { HeikinAshiChart } from "@/components/ui/charts";

// TPEB spot rate OHLC ($/kg), weekly sample.
const tpeb = [
  { date: "W18", open: 4.1, high: 4.4, low: 3.9, close: 4.3 },
  { date: "W19", open: 4.3, high: 4.6, low: 4.1, close: 4.5 },
  { date: "W20", open: 4.5, high: 4.7, low: 4.2, close: 4.3 },
  { date: "W21", open: 4.3, high: 4.5, low: 4.0, close: 4.1 },
  { date: "W22", open: 4.1, high: 4.3, low: 3.8, close: 3.9 },
  { date: "W23", open: 3.9, high: 4.2, low: 3.7, close: 4.1 },
  { date: "W24", open: 4.1, high: 4.5, low: 4.0, close: 4.4 },
  { date: "W25", open: 4.4, high: 4.8, low: 4.3, close: 4.7 },
  { date: "W26", open: 4.7, high: 5.1, low: 4.5, close: 5.0 },
  { date: "W27", open: 5.0, high: 5.4, low: 4.8, close: 5.2 },
];
</script>

<template>
  <Story
    title="TPEB spot trend"
    description="Averaged candles smear the weekly chop into one clean uptrend into peak."
  >
    <HeikinAshiChart :data="tpeb" height="340" />
  </Story>

  <Story
    title="With zoom"
    description="Slider plus inside-zoom for long rate histories."
  >
    <HeikinAshiChart :data="tpeb" :zoom="true" height="340" />
  </Story>
</template>
