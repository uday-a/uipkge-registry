<script setup lang="ts">
import LlmEvalBenchmarkMatrix from '@/components/blocks/llm-eval-benchmark-matrix/LlmEvalBenchmarkMatrix.vue'
</script>

<template>
  <Story
    title="Default"
    description="LangSmith and DeepEval style LLM evaluation scorecard, automated golden dataset assertions, and multi-model benchmark matrix with faithfulness, answer relevancy, context recall metrics, and evaluator judge reasoning inspection."
  >
    <LlmEvalBenchmarkMatrix />
  </Story>
</template>
