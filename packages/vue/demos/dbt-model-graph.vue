<script setup lang="ts">
import DbtModelGraph from '@/components/blocks/dbt-model-graph/DbtModelGraph.vue'
</script>

<template>
  <Story
    title="Default"
    description="dbt Cloud style data modeling DAG dependency graph, compiled SQL view, and model documentation with lineage tree, Jinja/SQL source editor, compiled warehouse query, and column contract test suite."
  >
    <DbtModelGraph />
  </Story>
</template>
