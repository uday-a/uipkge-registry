<script setup lang="ts">
import CodeTerminalSession from '@/components/blocks/code-terminal-session/CodeTerminalSession.vue'
// CodeTerminalSession is the block file the user installs. Open
// `components/blocks/CodeTerminalSession.vue` after install to edit the
// `lines` array. Typing starts on mount, so server and client agree on the
// first paint.
</script>

<template>
  <Story
    title="Code — Terminal Session"
    description="A terminal transcript that types itself out line by line, showing prompts, output, and a success summary. Under reduced-motion the full transcript renders at once."
  >
    <CodeTerminalSession />
  </Story>
</template>
