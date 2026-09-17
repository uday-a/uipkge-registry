<script setup lang="ts">
import { SunburstChart } from "@/components/ui/charts";
const revenue = [
  {
    name: "Revenue",
    children: [
      {
        name: "Subscription",
        value: 64,
        children: [
          { name: "Pro", value: 38 },
          { name: "Team", value: 18 },
          { name: "Enterprise", value: 8 },
        ],
      },
      {
        name: "Usage",
        value: 22,
        children: [
          { name: "API", value: 14 },
          { name: "Storage", value: 8 },
        ],
      },
      {
        name: "Services",
        value: 14,
        children: [
          { name: "Onboarding", value: 9 },
          { name: "Training", value: 5 },
        ],
      },
    ],
  },
];

const orgChart = [
  {
    name: "Company",
    children: [
      {
        name: "Engineering",
        children: [
          { name: "Backend", value: 22 },
          { name: "Frontend", value: 18 },
          { name: "Mobile", value: 8 },
          { name: "Infra", value: 8 },
        ],
      },
      {
        name: "GTM",
        children: [
          { name: "Sales", value: 16 },
          { name: "Marketing", value: 10 },
          { name: "CS", value: 8 },
        ],
      },
      { name: "Ops", value: 12 },
    ],
  },
];

// Air cargo network: region, then airport, sized by weekly tonnage.
const cargoNetwork = [
  {
    name: "Air cargo",
    children: [
      {
        name: "Transpacific",
        children: [
          { name: "PVG", value: 520 },
          { name: "ICN", value: 410 },
          { name: "NRT", value: 350 },
        ],
      },
      {
        name: "Intra-Asia",
        children: [
          { name: "SIN", value: 570 },
          { name: "HKG", value: 290 },
        ],
      },
      {
        name: "Europe & ME",
        children: [
          { name: "FRA", value: 360 },
          { name: "DXB", value: 280 },
        ],
      },
    ],
  },
];

// Polar / tangential label layout for the small inner rings.
const tangentialOption = {
  series: [
    {
      label: { rotate: "tangential" as const },
      levels: [
        {},
        { r0: "12%", r: "40%", label: { rotate: "tangential" as const } },
        { r0: "40%", r: "70%", label: { align: "right" as const } },
        { r0: "70%", r: "90%", label: { position: "outside" as const } },
      ],
    },
  ],
};

// Drop rotation entirely — labels read left-to-right on every ring.
// Lifts the cognitive load when the audience is non-technical.
const horizontalLabelsOption = {
  series: [
    {
      label: { rotate: 0 as const, fontSize: 10 },
    },
  ],
};
</script>

<template>
  <Story
    title="Revenue breakdown"
    description="Three-tier hierarchical share. Centre is the total; rings drill down by category."
  >
    <SunburstChart :data="revenue" height="400" />
  </Story>

  <Story
    title="Org chart"
    description="Same component shape works for organisational structure — department → team → headcount. The size of each ring segment is proportional to the team's value."
  >
    <SunburstChart :data="orgChart" height="380" />
  </Story>

  <Story
    title="Tangential labels"
    description="Rotate inner-ring labels tangentially and push the outermost ring's labels outside the disc. Worth it when the inner ring text is being clipped."
  >
    <SunburstChart :data="revenue" :option="tangentialOption" height="400" />
  </Story>

  <Story
    title="Horizontal labels"
    description="Drop the radial rotation. Labels read left-to-right on every ring — easier for non-technical audiences when the values aren't extreme."
  >
    <SunburstChart
      :data="revenue"
      :option="horizontalLabelsOption"
      height="400"
    />
  </Story>

  <Story
    title="Solid (pie-style)"
    description="Use radius starting at 0 to close the centre hole. Reads more like a stacked pie than a donut — useful when there's no headline KPI to anchor the middle."
  >
    <SunburstChart :data="revenue" :radius="['0%', '90%']" height="320" />
  </Story>

  <Story
    title="Cargo network"
    description="Air cargo tonnage: region, then airport. Transpacific dominates the disc."
  >
    <SunburstChart :data="cargoNetwork" height="380" />
  </Story>
</template>
