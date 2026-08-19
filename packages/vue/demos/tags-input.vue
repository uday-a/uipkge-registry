<script setup lang="ts">
import { ref } from "vue";
import { Label } from "@/components/ui/label";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/components/ui/tags-input";
const tags = ref(["vue", "nuxt", "tailwind"]);
const pasteTags = ref<string[]>([]);
const csvTags = ref<string[]>(["design", "systems"]);
const maxTags = ref<string[]>(["alpha", "beta"]);
const lockedTags = ref(["read-only", "locked"]);
</script>

<template>
  <Story
    title="Default"
    description="Free-text input that converts entries into removable tag chips."
  >
    <div class="max-w-md space-y-2">
      <Label>Tags</Label>
      <TagsInput v-model="tags">
        <TagsInputItem v-for="t in tags" :key="t" :value="t">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
        <TagsInputInput placeholder="Add a tag..." />
      </TagsInput>
      <p class="text-muted-foreground text-xs">
        Value: <code class="text-foreground">{{ tags.join(", ") || "—" }}</code>
      </p>
    </div>
  </Story>

  <Story
    title="Add on paste"
    description="Pasting splits on whitespace and adds each token as a tag."
  >
    <div class="max-w-md space-y-2">
      <Label>Paste a list</Label>
      <TagsInput v-model="pasteTags" add-on-paste>
        <TagsInputItem v-for="t in pasteTags" :key="t" :value="t">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
        <TagsInputInput placeholder="Try pasting: red green blue" />
      </TagsInput>
    </div>
  </Story>

  <Story
    title="Custom delimiter"
    description="Use the delimiter prop to split on commas instead of Enter."
  >
    <div class="max-w-md space-y-2">
      <Label>Comma-separated tags</Label>
      <TagsInput v-model="csvTags" :delimiter="','">
        <TagsInputItem v-for="t in csvTags" :key="t" :value="t">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
        <TagsInputInput placeholder="Type and press comma..." />
      </TagsInput>
    </div>
  </Story>

  <Story
    title="Max length"
    description="Cap the total number of tags via the maxLength prop."
  >
    <div class="max-w-md space-y-2">
      <Label>Up to 3 tags</Label>
      <TagsInput v-model="maxTags" :max="3">
        <TagsInputItem v-for="t in maxTags" :key="t" :value="t">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
        <TagsInputInput placeholder="Add another..." />
      </TagsInput>
      <p class="text-muted-foreground text-xs">{{ maxTags.length }} / 3 tags</p>
    </div>
  </Story>

  <Story
    title="Disabled"
    description="Disabled state hides the input and prevents tag removal."
  >
    <div class="max-w-md space-y-2">
      <Label>Locked tags</Label>
      <TagsInput v-model="lockedTags" disabled>
        <TagsInputItem v-for="t in lockedTags" :key="t" :value="t">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
        <TagsInputInput placeholder="Cannot edit" />
      </TagsInput>
    </div>
  </Story>
</template>
