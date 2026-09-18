<script setup lang="ts">
import { ComboChart } from '@/components/ui/charts'

const monthly = [
  { m: 'Jan', orders: 320, conversion: 2.1 },
  { m: 'Feb', orders: 410, conversion: 2.4 },
  { m: 'Mar', orders: 380, conversion: 2.2 },
  { m: 'Apr', orders: 520, conversion: 2.9 },
  { m: 'May', orders: 480, conversion: 2.7 },
  { m: 'Jun', orders: 610, conversion: 3.4 },
]

// Air cargo: monthly flown tonnage with average yield.
const laneMonths = [
  { m: 'Jan', tonnes: 18200, rate: 4.1 },
  { m: 'Feb', tonnes: 16400, rate: 5.9 },
  { m: 'Mar', tonnes: 19800, rate: 4.4 },
  { m: 'Apr', tonnes: 20500, rate: 4.0 },
  { m: 'May', tonnes: 21300, rate: 4.3 },
  { m: 'Jun', tonnes: 22100, rate: 4.7 },
]

const revenue = [
  { m: 'Q1', revenue: 42000, margin: 18 },
  { m: 'Q2', revenue: 51000, margin: 21 },
  { m: 'Q3', revenue: 47000, margin: 19 },
  { m: 'Q4', revenue: 68000, margin: 26 },
]
</script>

<template>
  <Story title="Orders + conversion" description="Bars on the left axis, smooth line on the right axis.">
    <ComboChart :data="monthly" x-field="m" bar-field="orders" line-field="conversion" height="320" />
  </Story>

  <Story title="Revenue + margin" description="Same shape for finance: absolute bars with a percent line.">
    <ComboChart :data="revenue" x-field="m" bar-field="revenue" line-field="margin" height="320" />
  </Story>

  <Story title="Multi-bar + line" description="Pass arrays to render grouped bars beside the trend line.">
    <ComboChart
      :data="[
        { m: 'Jan', a: 120, b: 90, t: 200 },
        { m: 'Feb', a: 150, b: 110, t: 240 },
        { m: 'Mar', a: 130, b: 100, t: 220 },
      ]"
      x-field="m"
      :bar-field="['a', 'b']"
      line-field="t"
      height="300"
    />
  </Story>

  <Story
    title="Bookings vs rate"
    description="Air cargo dual axis: flown tonnage bars with the average $/kg line — the app's externalDataset pattern."
  >
    <ComboChart :data="laneMonths" x-field="m" bar-field="tonnes" line-field="rate" height="320" />
  </Story>
</template>
