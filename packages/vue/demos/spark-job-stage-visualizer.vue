<script setup lang="ts">
import SparkJobStageVisualizer from '@/components/blocks/spark-job-stage-visualizer/SparkJobStageVisualizer.vue'
</script>

<template>
  <Story
    title="Default"
    description="Databricks and Apache Spark distributed job execution DAG visualizer with stage performance metrics, task skew distribution quantiles, and executor JVM GC telemetry."
  >
    <SparkJobStageVisualizer />
  </Story>
</template>
