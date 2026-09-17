<script setup lang="ts">
import AiCodeReviewAssistant from '@/components/blocks/ai-code-review-assistant/AiCodeReviewAssistant.vue'
</script>

<template>
  <Story
    title="Default"
    description="GitHub PR automated AI code review assistant with AST syntax diff annotations, performance suggestions, and 1-click patch application."
  >
    <AiCodeReviewAssistant />
  </Story>

  <Story
    title="Custom PR Context"
    description="AI code review assistant configured with custom repository branch targets and author metadata."
  >
    <AiCodeReviewAssistant
      :pr-number="528"
      pr-title="feat(engine): stream AST node transforms via Web Workers"
      author-name="Marcus Vance"
      author-handle="marcus-vance"
      author-role="Lead Compiler Architect"
      source-branch="feat/worker-ast-stream"
      target-branch="main"
    />
  </Story>
</template>
