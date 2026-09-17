<script setup lang="ts">
import { ref } from "vue";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
const empty = ref("");
const filled = ref(
  "<p>Hello <strong>world</strong></p><p>This is a <em>rich text editor</em> demo.</p>",
);
const tall = ref(
  "<p>This editor has a taller minimum height for longer-form writing.</p>",
);
const left = ref("<p>Left pane content.</p>");
const right = ref("<p>Right pane content.</p>");
</script>

<template>
  <Story
    title="Empty with placeholder"
    description="No initial content — placeholder text shows until the user starts typing."
  >
    <div class="space-y-2">
      <RichTextEditor
        v-model="empty"
        placeholder="Write a description..."
        min-height="120px"
      />
      <p class="text-muted-foreground text-xs">
        Length: <code class="text-foreground">{{ empty.length }}</code> chars
      </p>
    </div>
  </Story>

  <Story
    title="Pre-filled content"
    description="Initial HTML rendered into the editor — try selecting text and toggling the toolbar."
  >
    <RichTextEditor v-model="filled" min-height="150px" />
  </Story>

  <Story
    title="Custom min-height"
    description="Taller editor surface for long-form content."
  >
    <RichTextEditor
      v-model="tall"
      placeholder="Draft your post..."
      min-height="280px"
    />
  </Story>

  <Story
    title="Side-by-side editing"
    description="Two independent editor instances — useful for translations or before/after diffs."
  >
    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-1">
        <p class="text-sm font-medium">English</p>
        <RichTextEditor
          v-model="left"
          placeholder="Source..."
          min-height="160px"
        />
      </div>
      <div class="space-y-1">
        <p class="text-sm font-medium">Japanese</p>
        <RichTextEditor
          v-model="right"
          placeholder="Translation..."
          min-height="160px"
        />
      </div>
    </div>
  </Story>
</template>
