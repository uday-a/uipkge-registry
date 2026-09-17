<script setup lang="ts">
import AiLlmChat from '@/components/blocks/ai-llm-chat/AiLlmChat.vue'
// AiLlmChat ships as a single self-contained file. The demo `send()`
// pushes a placeholder assistant turn on a timer — wire it to your
// streaming endpoint after installing into `components/blocks/AiLlmChat.vue`.
</script>

<template>
  <Story
    title="AI LLM Chat"
    description="ChatGPT/Claude-style LLM chat surface. Collapsible left sidebar with New chat, searchable thread history grouped by Today/Yesterday/Previous 7 days/Earlier. Centered conversation: empty state with suggested-prompt tiles, user/assistant turns with code-block rendering and copy/regenerate/feedback actions, streaming dots, stop button. Composer with model picker, attach, Enter-to-send."
  >
    <AiLlmChat />
  </Story>
</template>
