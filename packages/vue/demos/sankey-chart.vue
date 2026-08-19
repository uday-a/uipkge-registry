<script setup lang="ts">
import { SankeyChart } from "@/components/ui/charts";

// Air cargo weekly tonnage: origin gateways to destination ramps.
const laneFlows = [
  { source: "PVG", target: "LAX", value: 520 },
  { source: "ICN", target: "ORD", value: 410 },
  { source: "NRT", target: "DFW", value: 350 },
  { source: "FRA", target: "JFK", value: 360 },
  { source: "SIN", target: "HKG", value: 380 },
  { source: "HKG", target: "ANC", value: 290 },
  { source: "DXB", target: "SIN", value: 280 },
  { source: "SIN", target: "ICN", value: 190 },
];
const acquisition = [
  { source: "Organic", target: "Landing", value: 480 },
  { source: "Organic", target: "Blog", value: 220 },
  { source: "Paid", target: "Landing", value: 360 },
  { source: "Paid", target: "Pricing", value: 140 },
  { source: "Referral", target: "Pricing", value: 180 },
  { source: "Referral", target: "Landing", value: 60 },
  { source: "Landing", target: "Sign-up", value: 420 },
  { source: "Landing", target: "Bounce", value: 480 },
  { source: "Pricing", target: "Sign-up", value: 240 },
  { source: "Pricing", target: "Bounce", value: 80 },
  { source: "Blog", target: "Sign-up", value: 90 },
  { source: "Blog", target: "Bounce", value: 130 },
];

const energy = [
  { source: "Coal", target: "Electricity", value: 380 },
  { source: "Gas", target: "Electricity", value: 220 },
  { source: "Solar", target: "Electricity", value: 60 },
  { source: "Wind", target: "Electricity", value: 80 },
  { source: "Electricity", target: "Residential", value: 280 },
  { source: "Electricity", target: "Industrial", value: 320 },
  { source: "Electricity", target: "Commercial", value: 140 },
];

const budget = [
  { source: "Revenue", target: "Engineering", value: 4200 },
  { source: "Revenue", target: "Sales", value: 2800 },
  { source: "Revenue", target: "Marketing", value: 1800 },
  { source: "Revenue", target: "Ops", value: 1200 },
  { source: "Engineering", target: "Salaries", value: 3000 },
  { source: "Engineering", target: "Infra", value: 900 },
  { source: "Engineering", target: "Tools", value: 300 },
  { source: "Sales", target: "Salaries", value: 2200 },
  { source: "Sales", target: "Commission", value: 600 },
];

const straightOption = {
  series: [{ lineStyle: { color: "gradient", curveness: 0 } }],
};
</script>

<template>
  <Story
    title="Acquisition funnel"
    description="Marketing channel → page → outcome. Link widths track value flow; hover highlights adjacency."
  >
    <SankeyChart :links="acquisition" height="380" />
  </Story>

  <Story
    title="Energy mix"
    description="Source → carrier → end-use. Same shape as a Sankey diagram in an annual report."
  >
    <SankeyChart :links="energy" height="340" />
  </Story>

  <Story
    title="Budget allocation"
    description="Revenue → department → line item. Sankey reads as 'where does the money go' at a glance."
  >
    <SankeyChart :links="budget" height="380" />
  </Story>

  <Story
    title="Straight ribbons"
    description="Drop the curveness for a strict left-to-right read. Useful for very wide diagrams where curves create visual noise."
  >
    <SankeyChart :links="acquisition" :option="straightOption" height="380" />
  </Story>

  <Story
    title="Compact flow"
    description="Shorter height for in-card placement — works when the diagram has ≤8 nodes and the focus is on the dominant flow paths, not the small ones."
  >
    <SankeyChart :links="energy" height="200" />
  </Story>

  <Story
    title="Lane flows"
    description="Air cargo tonnage from origin gateways to destination ramps."
  >
    <SankeyChart :links="laneFlows" height="380" />
  </Story>
</template>
