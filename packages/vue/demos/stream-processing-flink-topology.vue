<script setup lang="ts">
import StreamProcessingFlinkTopology from '@/components/blocks/stream-processing-flink-topology/StreamProcessingFlinkTopology.vue'
</script>

<template>
  <Story
    title="Default"
    description="Apache Flink & RisingWave stateful streaming graph: real-time DAG topology, window throughput, checkpointing duration, RocksDB state inspector, and backpressure heat monitor."
  >
    <StreamProcessingFlinkTopology />
  </Story>
</template>
