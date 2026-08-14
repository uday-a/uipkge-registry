<script setup lang="ts">
import AgentMemoryInspector from '@/components/blocks/agent-memory-inspector/AgentMemoryInspector.vue'
</script>

<template>
  <Story
    title="Default"
    description="Mem0/LangGraph-style autonomous AI agent memory store inspector featuring short-term context buffer utilization, long-term episodic memories with confidence scoring, and entity relationship knowledge graph."
  >
    <AgentMemoryInspector />
  </Story>
</template>
