<script setup lang="ts">
import PromptAbTestingComparator from '@/components/blocks/prompt-ab-testing-comparator/PromptAbTestingComparator.vue'
</script>

<template>
  <Story
    title="Default"
    description="Side-by-side prompt variation comparison shootout with automated LLM judge scoring, win rates, and token diffs for AI code generation prompts."
  >
    <PromptAbTestingComparator />
  </Story>

  <Story
    title="Custom Benchmark Scope"
    description="Prompt comparator configured for specialized AST transformer prompt evaluation."
  >
    <PromptAbTestingComparator
      experiment-title="AST Optimization: TypeScript Interface Transformer"
      test-sample-count="100 Evaluation Prompts"
    />
  </Story>
</template>
