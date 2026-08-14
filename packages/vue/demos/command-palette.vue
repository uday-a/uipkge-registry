<script setup lang="ts">
import CommandPalette from '@/components/blocks/command-palette/CommandPalette.vue'
// CommandPalette wires its own global ⌘K / Ctrl-K shortcut on mount,
// so the demo just drops it once. The default `groups` prop ships a
// Navigate + Settings starter set; consumers override via :groups.
</script>

<template>
  <Story
    title="Command Palette"
    description="Slim trigger button (with platform-aware ⌘K/Ctrl-K kbd hint) plus the modal CommandDialog. Drop it once and the global keyboard shortcut wires itself. Click the trigger or press ⌘K / Ctrl-K to open."
  >
    <div class="flex max-w-md flex-col gap-2">
      <p class="text-muted-foreground text-xs">
        Click the trigger or press <kbd class="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">⌘K</kbd> /
        <kbd class="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">Ctrl K</kbd>
      </p>
      <CommandPalette />
    </div>
  </Story>
</template>
