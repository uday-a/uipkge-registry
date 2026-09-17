<script setup lang="ts">
import { AlluvialChart } from "@/components/ui/charts";

// Booking funnel: quotes that survive each stage.
const funnel = [
  { source: "Inquiry", target: "Quote", value: 1200 },
  { source: "Quote", target: "Booking", value: 860 },
  { source: "Quote", target: "Lost", value: 340 },
  { source: "Booking", target: "Flown", value: 790 },
  { source: "Booking", target: "Rolled", value: 70 },
  { source: "Flown", target: "Invoiced", value: 775 },
  { source: "Flown", target: "Claim", value: 15 },
];
</script>

<template>
  <Story
    title="Booking funnel"
    description="Quote-to-cash flowing top to bottom — the rolled and claim trickles stay visible."
  >
    <AlluvialChart :links="funnel" height="440" />
  </Story>

  <Story title="Compact" description="Shorter frame for ops tiles.">
    <AlluvialChart :links="funnel.slice(0, 4)" height="320" />
  </Story>
</template>
