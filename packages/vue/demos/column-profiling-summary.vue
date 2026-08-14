<script setup lang="ts">
import ColumnProfilingSummary from '@/components/blocks/column-profiling-summary/ColumnProfilingSummary.vue'
</script>

<template>
  <Story
    title="Default"
    description="Pandas Profiling and ydata style exploratory data analysis (EDA) distribution dashboard with dataset overview cards, 10-bar SVG histogram, categorical proportion breakdown, quantile box plot, and boolean churn ratio."
  >
    <ColumnProfilingSummary />
  </Story>

  <Story
    title="Custom Dataset Scope"
    description="Custom table view with configured dataset title, row volume, column count, and memory footprint."
  >
    <ColumnProfilingSummary
      tableName="warehouse_telemetry_events_2026"
      totalRows="2,419,800"
      :total-columns="24"
      memory-footprint="384.6 MB"
      dataset-version="v3.1.0-prod"
    />
  </Story>
</template>
