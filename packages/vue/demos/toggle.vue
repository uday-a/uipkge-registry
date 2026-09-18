<script setup lang="ts">
import { ref } from 'vue'
import { Toggle } from '@/components/ui/toggle'
import { Bold, Italic, Underline, Star } from 'lucide-vue-next'

const pinned = ref(false)
const starred = ref(true)
</script>

<template>
  <Story title="Default" description="Independent on/off icon button for formatting actions.">
    <div class="flex gap-2">
      <Toggle aria-label="Bold"><Bold class="size-4" /></Toggle>
      <Toggle aria-label="Italic"><Italic class="size-4" /></Toggle>
      <Toggle aria-label="Underline"><Underline class="size-4" /></Toggle>
    </div>
  </Story>

  <Story title="Variants" description="Default has no border; outline adds a visible border and shadow.">
    <div class="flex gap-2">
      <Toggle variant="default" aria-label="Bold default"><Bold class="size-4" /></Toggle>
      <Toggle variant="outline" aria-label="Bold outline"><Bold class="size-4" /></Toggle>
    </div>
  </Story>

  <Story title="Sizes" description="Small, default, and large heights.">
    <div class="flex items-center gap-2">
      <Toggle size="sm" aria-label="Bold sm"><Bold class="size-4" /></Toggle>
      <Toggle size="default" aria-label="Bold default"><Bold class="size-4" /></Toggle>
      <Toggle size="lg" aria-label="Bold lg"><Bold class="size-4" /></Toggle>
    </div>
  </Story>

  <Story title="With label" description="Toggle accepts arbitrary children, including text alongside icons.">
    <div class="flex gap-2">
      <Toggle variant="outline" aria-label="Star this">
        <Star class="size-4" />
        <span>Star</span>
      </Toggle>
    </div>
  </Story>

  <Story title="Controlled" description="Bind state with v-model and observe pressed state externally.">
    <div class="flex items-center gap-3">
      <Toggle v-model="pinned" variant="outline" aria-label="Pin">
        <Star class="size-4" />
        <span>{{ pinned ? 'Pinned' : 'Pin' }}</span>
      </Toggle>
      <span class="text-muted-foreground text-xs"
        >Pressed: <code class="text-foreground">{{ pinned }}</code></span
      >
    </div>
  </Story>

  <Story title="Disabled" description="Non-interactive state respects the current pressed value.">
    <div class="flex gap-2">
      <Toggle disabled aria-label="Off disabled"><Bold class="size-4" /></Toggle>
      <Toggle :model-value="starred" disabled variant="outline" aria-label="On disabled">
        <Star class="size-4" />
      </Toggle>
    </div>
  </Story>
</template>
