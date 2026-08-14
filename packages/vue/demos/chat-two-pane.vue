<script setup lang="ts">
import ChatTwoPane from '@/components/blocks/chat-two-pane/ChatTwoPane.vue'
// ChatTwoPane is fully self-contained. The conversations + messages
// dictionaries are stubbed inline — replace them with your data layer
// after installing into `components/blocks/ChatTwoPane.vue`.
</script>

<template>
  <Story
    title="Chat Two Pane"
    description="Slack/iMessage-style two-pane messaging. Left rail: searchable conversation list with avatars, online dots, pinned section, unread badges, mute icons, smart timestamps. Right pane: active thread with day separators, own/peer bubbles, read ticks, typing indicator, attach/emoji/send composer."
  >
    <ChatTwoPane />
  </Story>
</template>
