<script setup lang="ts">
import { StackedAreaChart } from "@/components/ui/charts";

const traffic = [
  { m: "Jan", organic: 120, paid: 80, referral: 40 },
  { m: "Feb", organic: 150, paid: 95, referral: 52 },
  { m: "Mar", organic: 135, paid: 88, referral: 48 },
  { m: "Apr", organic: 180, paid: 110, referral: 64 },
  { m: "May", organic: 210, paid: 128, referral: 72 },
];
</script>

<template>
  <Story
    title="Traffic streams"
    description="Absolute stacking with series focus on hover."
  >
    <StackedAreaChart
      :data="traffic"
      x-field="m"
      :y-fields="['organic', 'paid', 'referral']"
      height="320"
    />
  </Story>

  <Story
    title="100% share"
    description="Percent mode turns streams into share bands."
  >
    <StackedAreaChart
      :data="traffic"
      x-field="m"
      :y-fields="['organic', 'paid', 'referral']"
      :percent="true"
      height="320"
    />
  </Story>
</template>
