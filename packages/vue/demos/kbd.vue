<script setup lang="ts">
import { Button } from "@vue-registry/button";
import { Kbd } from "@vue-registry/kbd";
</script>

<template>
  <Story
    title="Default"
    description="Inline keyboard hint styled with muted surface and mono font."
  >
    <p class="text-sm">
      Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette.
    </p>
  </Story>

  <Story
    title="Single key"
    description="One-letter shortcuts for arrow keys and modifiers."
  >
    <div class="flex flex-wrap items-center gap-2 text-sm">
      <Kbd>↑</Kbd>
      <Kbd>↓</Kbd>
      <Kbd>←</Kbd>
      <Kbd>→</Kbd>
      <Kbd>Esc</Kbd>
      <Kbd>Enter</Kbd>
    </div>
  </Story>

  <Story
    title="Modifier combos"
    description="Group related keys inline — each key is its own chip."
  >
    <p class="text-sm">
      Save with <Kbd>⌘</Kbd> <Kbd>S</Kbd> or <Kbd>Ctrl</Kbd> <Kbd>S</Kbd> on
      Windows.
    </p>
  </Story>

  <Story
    title="In a button row"
    description="Pair with Button for shortcut affordances on toolbars."
  >
    <div class="flex items-center gap-2">
      <Button variant="outline" size="sm">
        Search
        <Kbd class="ml-2">⌘K</Kbd>
      </Button>
      <Button variant="ghost" size="sm">
        New
        <Kbd class="ml-2">N</Kbd>
      </Button>
    </div>
  </Story>

  <Story
    title="Long label"
    description="Chips grow with content — no truncation on wider labels."
  >
    <Kbd>Shift</Kbd>
  </Story>
</template>
