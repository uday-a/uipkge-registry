<script setup lang="ts">
import ProgressBreakdown from '@/components/blocks/progress-breakdown/ProgressBreakdown.vue'
import { TrendingUp } from 'lucide-vue-next'

const items = [
  { name: 'Engineering', value: 35, secondaryLabel: '42 people' },
  { name: 'Product', value: 18, secondaryLabel: '22 people' },
  { name: 'Design', value: 12, secondaryLabel: '15 people' },
  { name: 'Sales', value: 15, secondaryLabel: '18 people' },
  { name: 'Marketing', value: 10, secondaryLabel: '12 people' },
  { name: 'Other', value: 10, secondaryLabel: '12 people' },
]
</script>

<template>
  <Story
    title="Default"
    description="Card with header icon and a stacked list of progress rows, each labeled with a secondary count."
  >
    <ProgressBreakdown
      title="Department Breakdown"
      description="Headcount distribution."
      :items="items"
      :header-icon="TrendingUp"
    />
  </Story>
</template>
