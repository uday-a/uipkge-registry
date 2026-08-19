<script setup lang="ts">
import { CategoryDistributionChart } from "@/components/ui/charts";

const budget = [
  { label: "Marketing", percentage: 40, value: 4000 },
  { label: "Sales", percentage: 25, value: 2500 },
  { label: "Development", percentage: 20, value: 2000 },
  { label: "Support", percentage: 15, value: 1500 },
];

const traffic = [
  { label: "Organic", percentage: 46 },
  { label: "Paid", percentage: 28 },
  { label: "Referral", percentage: 16 },
  { label: "Other", percentage: 10 },
];
</script>

<template>
  <Story
    title="Budget split"
    description="KPI plus trend pill, share bar, and value legend."
  >
    <CategoryDistributionChart
      primary-value="10,000"
      primary-label="Total spend"
      :trend="{ value: '8.2%', direction: 'up' }"
      :categories="budget"
      height="240"
    />
  </Story>

  <Story
    title="Traffic mix"
    description="Down trend renders in red; shares normalise automatically."
  >
    <CategoryDistributionChart
      primary-value="84k"
      :trend="{ value: '3.1%', direction: 'down' }"
      :categories="traffic"
      height="240"
    />
  </Story>
</template>
