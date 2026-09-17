<script setup lang="ts">
import Inbox from '@/components/blocks/inbox/Inbox.vue'
// Inbox is a single-file three-pane mail surface. The `mails` ref is
// stubbed inline — swap it for your data source after installing into
// `components/blocks/Inbox.vue`.
</script>

<template>
  <Story
    title="Inbox"
    description="Three-pane mail surface. Left rail: Compose button, folders with unread counts, colour-coded labels. Middle: searchable message list with sender/subject/preview/labels/attachment glyphs/star toggle/smart timestamps. Right: reader pane with subject, from/to, body, attachment chip, reply/forward/archive actions."
  >
    <Inbox />
  </Story>
</template>
