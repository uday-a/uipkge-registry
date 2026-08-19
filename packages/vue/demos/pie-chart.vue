<script setup lang="ts">
import { PieChart } from "@/components/ui/charts";
const devices = [
  { name: "Desktop", value: 45 },
  { name: "Mobile", value: 35 },
  { name: "Tablet", value: 15 },
  { name: "Other", value: 5 },
];

// Air cargo: weekly freighter capacity share by carrier.
const capacityShare = [
  { name: "SQ", value: 22 },
  { name: "CX", value: 19 },
  { name: "LH", value: 15 },
  { name: "EK", value: 13 },
  { name: "QR", value: 11 },
  { name: "KE", value: 10 },
  { name: "Other", value: 10 },
];

const traffic = [
  { name: "Organic", value: 4200 },
  { name: "Paid", value: 2800 },
  { name: "Referral", value: 1900 },
  { name: "Direct", value: 1400 },
  { name: "Email", value: 900 },
];

// Outside labels with leader lines.
const labeledOption = {
  series: [
    {
      label: {
        show: true,
        formatter: "{b}\n{d}%",
        fontSize: 11,
        color: "var(--foreground)",
      },
      labelLine: { show: true, length: 8, length2: 12 },
    },
  ],
};

// Rose (Nightingale) — radius scales with value.
const roseOption = {
  series: [{ roseType: "radius", radius: ["20%", "70%"] }],
};

// Center-label donut: bigger inner ring + percentage in the hole.
const centerLabelOption = {
  series: [
    {
      radius: ["55%", "75%"],
      label: {
        show: true,
        position: "center",
        formatter: "45%\nDesktop",
        fontSize: 16,
        fontWeight: 700,
        color: "var(--foreground)",
      },
    },
  ],
};
</script>

<template>
  <Story
    title="Basic pie"
    description="Solid pie with bottom legend. Tooltip shows value and percentage."
  >
    <PieChart :data="devices" height="320" />
  </Story>

  <Story
    title="Donut"
    description="Hollow center via the `donut` prop. Use it when a KPI fits in the middle, or when you want a lighter visual weight."
  >
    <PieChart :data="devices" :donut="true" height="320" />
  </Story>

  <Story
    title="Donut with center label"
    description="Combine `donut` with an option override that paints a label inside the hole — popular for share/percent KPIs."
  >
    <PieChart
      :data="devices"
      :donut="true"
      :option="centerLabelOption"
      height="320"
    />
  </Story>

  <Story
    title="Rose (Nightingale)"
    description="Slice radius scales with value instead of angle. Better than a pie for highly-skewed distributions."
  >
    <PieChart :data="traffic" :option="roseOption" height="340" />
  </Story>

  <Story
    title="Outside labels"
    description="Slice labels with leader lines. Use when the legend is too far away or when categories have long names."
  >
    <PieChart :data="traffic" :option="labeledOption" height="340" />
  </Story>

  <Story
    title="Carrier capacity"
    description="Air cargo freighter share — SQ leads the week on Transpacific lift."
  >
    <PieChart
      :data="capacityShare"
      name-field="name"
      value-field="value"
      :donut="true"
      height="320"
    />
  </Story>
</template>
