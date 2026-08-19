<script setup lang="ts">
import { FunnelChart } from "@/components/ui/charts";
const acquisition = [
  { name: "Visitors", value: 24850 },
  { name: "Sign-ups", value: 14910 },
  { name: "Activated", value: 5964 },
  { name: "Paid", value: 1789 },
  { name: "Retained 30d", value: 447 },
];

const checkout = [
  { name: "Cart", value: 8200 },
  { name: "Checkout", value: 4900 },
  { name: "Payment", value: 3100 },
  { name: "Confirmed", value: 2700 },
];

// Inverted funnel — narrow at top, wide at bottom. Useful when the
// process *expands* (lead-gen -> opportunities -> deals -> renewals).
const invertedOption = {
  series: [{ sort: "ascending" as const }],
};

// Show conversion % between consecutive stages by overriding the label.
const conversionOption = {
  series: [
    {
      label: {
        show: true,
        position: "inside" as const,
        color: "#fff",
        fontSize: 11,
        fontWeight: 600,
        formatter: (p: any) =>
          `${p.name}\n${p.value.toLocaleString()} (${p.percent}%)`,
      },
    },
  ],
};
</script>

<template>
  <Story
    title="Basic funnel"
    description="Stage-by-stage drop-off. Default sort is descending — biggest stage at top."
  >
    <FunnelChart :data="acquisition" height="340" />
  </Story>

  <Story
    title="With legend"
    description="Toggle the bottom legend with `show-legend`. Lets users isolate / toggle stages on click."
  >
    <FunnelChart :data="acquisition" :show-legend="true" height="360" />
  </Story>

  <Story
    title="Inverted"
    description="`sort: ascending` inverts the funnel for processes that broaden over time (lead-gen, growth flows)."
  >
    <FunnelChart :data="acquisition" :option="invertedOption" height="340" />
  </Story>

  <Story
    title="With conversion %"
    description="Custom label includes stage-to-total percentage. Quick to read drop-off without doing the math."
  >
    <FunnelChart :data="checkout" :option="conversionOption" height="320" />
  </Story>

  <Story
    title="Compact dashboard tile"
    description="Shorter height for in-card placement. Drop the labels via option.label.show=false so the tile reads as a sparkline-style funnel."
  >
    <FunnelChart
      :data="checkout"
      :option="{ series: [{ label: { show: false } }] }"
      height="180"
    />
  </Story>
</template>
