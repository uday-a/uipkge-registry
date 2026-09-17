<script setup lang="ts">
import ChatThread from '@/components/blocks/chat-thread/ChatThread.vue'
// ChatThread ships as a single file; the demo `messages` ref is stubbed
// inline. Replace it with your transport (WebSocket, polling, etc.) after
// installing into `components/blocks/ChatThread.vue`.
</script>

<template>
  <Story
    title="Chat Thread"
    description="Single-pane conversation surface. Peer header with online dot, grouped messages with day separators (Today/Yesterday/date), own vs. peer bubbles, read/delivered/sent ticks, typing indicator, composer with attach/emoji and Enter-to-send."
  >
    <ChatThread />
  </Story>
</template>
