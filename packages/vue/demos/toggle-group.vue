<script setup lang="ts">
import { ref } from 'vue'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from 'lucide-vue-next'

const align = ref('center')
const formats = ref<string[]>(['bold'])
const variantValue = ref('left')
const sizeValue = ref('center')
const spacedValue = ref<string[]>(['bold', 'italic'])
const lockedValue = ref('center')
const staticValue = ref('center')
</script>

<template>
  <Story title="Single select" description="Mutually exclusive icon toggles for text alignment.">
    <ToggleGroup v-model="align" type="single">
      <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft class="size-4" /></ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter class="size-4" /></ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right"><AlignRight class="size-4" /></ToggleGroupItem>
    </ToggleGroup>
  </Story>

  <Story title="Multiple select" description="Type='multiple' allows several items to be active at once.">
    <div class="space-y-2">
      <ToggleGroup v-model="formats" type="multiple">
        <ToggleGroupItem value="bold" aria-label="Bold"><Bold class="size-4" /></ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic"><Italic class="size-4" /></ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline"><Underline class="size-4" /></ToggleGroupItem>
      </ToggleGroup>
      <p class="text-muted-foreground text-xs">
        Active: <code class="text-foreground">{{ formats.join(', ') || '—' }}</code>
      </p>
    </div>
  </Story>

  <Story title="Variants" description="Default and outline variants applied at the group level.">
    <div class="space-y-3">
      <ToggleGroup v-model="variantValue" type="single" variant="default">
        <ToggleGroupItem value="left"><AlignLeft class="size-4" /></ToggleGroupItem>
        <ToggleGroupItem value="center"><AlignCenter class="size-4" /></ToggleGroupItem>
        <ToggleGroupItem value="right"><AlignRight class="size-4" /></ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup v-model="variantValue" type="single" variant="outline">
        <ToggleGroupItem value="left"><AlignLeft class="size-4" /></ToggleGroupItem>
        <ToggleGroupItem value="center"><AlignCenter class="size-4" /></ToggleGroupItem>
        <ToggleGroupItem value="right"><AlignRight class="size-4" /></ToggleGroupItem>
      </ToggleGroup>
    </div>
  </Story>

  <Story title="Sizes" description="Small, default, and large heights propagate to all items.">
    <div class="space-y-3">
      <ToggleGroup v-model="sizeValue" type="single" variant="outline" size="sm">
        <ToggleGroupItem value="left"><AlignLeft class="size-4" /></ToggleGroupItem>
        <ToggleGroupItem value="center"><AlignCenter class="size-4" /></ToggleGroupItem>
        <ToggleGroupItem value="right"><AlignRight class="size-4" /></ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup v-model="sizeValue" type="single" variant="outline" size="default">
        <ToggleGroupItem value="left"><AlignLeft class="size-4" /></ToggleGroupItem>
        <ToggleGroupItem value="center"><AlignCenter class="size-4" /></ToggleGroupItem>
        <ToggleGroupItem value="right"><AlignRight class="size-4" /></ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup v-model="sizeValue" type="single" variant="outline" size="lg">
        <ToggleGroupItem value="left"><AlignLeft class="size-4" /></ToggleGroupItem>
        <ToggleGroupItem value="center"><AlignCenter class="size-4" /></ToggleGroupItem>
        <ToggleGroupItem value="right"><AlignRight class="size-4" /></ToggleGroupItem>
      </ToggleGroup>
    </div>
  </Story>

  <Story title="With spacing" description="Pass a numeric spacing prop to gap items apart instead of joining them.">
    <ToggleGroup v-model="spacedValue" type="multiple" variant="outline" :spacing="2">
      <ToggleGroupItem value="bold"><Bold class="size-4" /></ToggleGroupItem>
      <ToggleGroupItem value="italic"><Italic class="size-4" /></ToggleGroupItem>
      <ToggleGroupItem value="underline"><Underline class="size-4" /></ToggleGroupItem>
    </ToggleGroup>
  </Story>

  <Story title="Disabled" description="Disable the entire group or individual items.">
    <div class="space-y-3">
      <ToggleGroup v-model="lockedValue" type="single" variant="outline" disabled>
        <ToggleGroupItem value="left"><AlignLeft class="size-4" /></ToggleGroupItem>
        <ToggleGroupItem value="center"><AlignCenter class="size-4" /></ToggleGroupItem>
        <ToggleGroupItem value="right"><AlignRight class="size-4" /></ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup v-model="lockedValue" type="single" variant="outline">
        <ToggleGroupItem value="left"><AlignLeft class="size-4" /></ToggleGroupItem>
        <ToggleGroupItem value="center" disabled><AlignCenter class="size-4" /></ToggleGroupItem>
        <ToggleGroupItem value="right"><AlignRight class="size-4" /></ToggleGroupItem>
      </ToggleGroup>
    </div>
  </Story>

  <Story title="Static (no indicator)" description="animated=false paints on-state chrome on the item itself.">
    <ToggleGroup v-model="staticValue" type="single" variant="outline" :animated="false">
      <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft class="size-4" /></ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter class="size-4" /></ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right"><AlignRight class="size-4" /></ToggleGroupItem>
    </ToggleGroup>
  </Story>
</template>
