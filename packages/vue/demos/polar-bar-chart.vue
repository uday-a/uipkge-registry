<script setup lang="ts">
import { PolarBarChart } from "@/components/ui/charts";

const traffic = [
  { category: "Organic", value: 42 },
  { category: "Paid", value: 28 },
  { category: "Referral", value: 18 },
  { category: "Social", value: 24 },
  { category: "Email", value: 12 },
];

const skills = [
  { category: "Speed", value: 85 },
  { category: "Reliability", value: 72 },
  { category: "Comfort", value: 64 },
  { category: "Safety", value: 91 },
  { category: "Efficiency", value: 58 },
];
</script>

<template>
  <Story
    title="Channel mix"
    description="Categories around the radius axis with rounded caps."
  >
    <PolarBarChart :data="traffic" height="320" />
  </Story>

  <Story title="Scores" description="Same wrapper for 0-100 score shapes.">
    <PolarBarChart :data="skills" height="320" />
  </Story>
</template>
