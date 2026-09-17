<script setup lang="ts">
import { ref } from 'vue'
import { Chip, ChipGroup } from '@/components/ui/chip'
import { Hash } from 'lucide-vue-next'

const tags = ref(['design', 'engineering', 'product', 'marketing'])

function removeTag(tag: string) {
  tags.value = tags.value.filter((t) => t !== tag)
}
</script>

<template>
  <Story
    title="Variants"
    description="Seven visual styles. default / filled / outlined / elevated for visual weight; success / warning / destructive for tone."
  >
    <div class="flex flex-wrap gap-2">
      <Chip>Default</Chip>
      <Chip variant="filled">Filled</Chip>
      <Chip variant="outlined">Outlined</Chip>
      <Chip variant="elevated">Elevated</Chip>
      <Chip variant="success">Success</Chip>
      <Chip variant="warning">Warning</Chip>
      <Chip variant="destructive">Destructive</Chip>
    </div>
  </Story>

  <Story title="Sizes" description="Three sizes — sm, default, lg — pair naturally with surrounding text scale.">
    <div class="flex flex-wrap items-center gap-2">
      <Chip size="sm">Small</Chip>
      <Chip>Default</Chip>
      <Chip size="lg">Large</Chip>
    </div>
  </Story>

  <Story
    title="With leading icon"
    description="Slot any icon before the label — common for hashtag and category chips."
  >
    <div class="flex flex-wrap gap-2">
      <Chip><Hash class="size-3" /> design</Chip>
      <Chip><Hash class="size-3" /> engineering</Chip>
      <Chip><Hash class="size-3" /> product</Chip>
    </div>
  </Story>

  <Story
    title="Closable"
    description="closable renders a built-in dismiss button and emits close. Listen for @close to remove the chip from your list."
  >
    <div class="flex flex-wrap gap-2">
      <Chip closable>tag-one</Chip>
      <Chip closable variant="elevated">tag-two</Chip>
      <Chip closable variant="outlined">tag-three</Chip>
    </div>
  </Story>

  <Story
    title="ChipGroup with reactive removal"
    description="Combine ChipGroup with v-for and closable chips — handle @close to update the list."
  >
    <div class="space-y-3">
      <ChipGroup>
        <Chip v-for="tag in tags" :key="tag" variant="elevated" closable @close="removeTag(tag)"> #{{ tag }} </Chip>
      </ChipGroup>
      <button
        v-if="tags.length === 0"
        class="text-muted-foreground text-xs underline"
        @click="tags = ['design', 'engineering', 'product', 'marketing']"
      >
        Reset chips
      </button>
    </div>
  </Story>

  <Story
    title="Status filters"
    description="Tone variants are useful for filter-bar status chips that double as legend items."
  >
    <ChipGroup>
      <Chip variant="success">2 passing</Chip>
      <Chip variant="warning">3 pending</Chip>
      <Chip variant="destructive">1 failed</Chip>
    </ChipGroup>
  </Story>
</template>
