<script setup lang="ts">
import { StackedBarChart } from "@/components/ui/charts";

const mix = [
  { q: "Q1", organic: 240, paid: 180, referral: 120 },
  { q: "Q2", organic: 310, paid: 220, referral: 150 },
  { q: "Q3", organic: 380, paid: 280, referral: 170 },
  { q: "Q4", organic: 450, paid: 340, referral: 210 },
];

const likert = [
  { q: "Speed", sd: -8, d: -12, n: 10, a: 34, sa: 36 },
  { q: "Support", sd: -5, d: -9, n: 14, a: 38, sa: 34 },
  { q: "Pricing", sd: -14, d: -18, n: 16, a: 28, sa: 24 },
];
</script>

<template>
  <Story
    title="Channel mix"
    description="Absolute stacking with a shared legend."
  >
    <StackedBarChart
      :data="mix"
      x-field="q"
      :y-fields="['organic', 'paid', 'referral']"
      height="320"
    />
  </Story>

  <Story title="100% share" description="Percent mode normalises every column.">
    <StackedBarChart
      :data="mix"
      x-field="q"
      :y-fields="['organic', 'paid', 'referral']"
      :percent="true"
      height="320"
    />
  </Story>

  <Story
    title="Likert diverging"
    description="Negative stacks diverge left for survey scales."
  >
    <StackedBarChart
      :data="likert"
      x-field="q"
      :y-fields="['sd', 'd', 'n', 'a', 'sa']"
      height="300"
    />
  </Story>
</template>
