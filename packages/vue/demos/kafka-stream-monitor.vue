<script setup lang="ts">
import KafkaStreamMonitor from '@/components/blocks/kafka-stream-monitor/KafkaStreamMonitor.vue'
</script>

<template>
  <Story
    title="Default"
    description="Apache Kafka & Redpanda topic stream telemetry dashboard with partition offset monitor, consumer group lag tracking, and real-time message payload inspector."
  >
    <KafkaStreamMonitor />
  </Story>
</template>
