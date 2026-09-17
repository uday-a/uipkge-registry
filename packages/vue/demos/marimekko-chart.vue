<script setup lang="ts">
import { MarimekkoChart } from '@/components/ui/charts'

// Weekly tonnage: columns are trade regions (width = share), segments are carriers.
const regions = [
  {
    name: 'Transpacific',
    values: [
      { name: 'SQ', value: 320 },
      { name: 'CX', value: 410 },
      { name: 'KE', value: 300 },
      { name: 'Other', value: 250 },
    ],
  },
  {
    name: 'Intra-Asia',
    values: [
      { name: 'SQ', value: 380 },
      { name: 'CX', value: 290 },
      { name: 'KE', value: 120 },
      { name: 'Other', value: 70 },
    ],
  },
  {
    name: 'Europe',
    values: [
      { name: 'SQ', value: 140 },
      { name: 'CX', value: 90 },
      { name: 'KE', value: 60 },
      { name: 'Other', value: 350 },
    ],
  },
]
</script>

<template>
  <Story
    title="Carrier mix by region"
    description="Column width is regional tonnage; segments are carrier shares within it."
  >
    <MarimekkoChart :columns="regions" height="360" />
  </Story>

  <Story title="Two regions" description="Narrower view for quarter reviews.">
    <MarimekkoChart :columns="regions.slice(0, 2)" height="320" />
  </Story>
</template>
