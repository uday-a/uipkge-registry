<script setup lang="ts">
import EtlPipelineDag from '@/components/blocks/etl-pipeline-dag/EtlPipelineDag.vue'
</script>

<template>
  <Story
    title="Default"
    description="Airflow/Dagster style directed acyclic graph (DAG) pipeline visualizer with node run statuses, pipeline health metrics, and interactive stdout log inspector."
  >
    <EtlPipelineDag />
  </Story>
</template>
