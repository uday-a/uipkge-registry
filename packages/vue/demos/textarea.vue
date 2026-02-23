<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
const text = ref('')
const autoSizeText = ref('')
const minMaxText = ref('')
const countText = ref('')
const formatterText = ref('')
const clearText = ref('Type something…')
const maxLengthText = ref('')
const disabledText = ref('Disabled value')
const readonlyText = ref('Read-only value')
</script>

<template>
  <Story title="Default" description="Multi-line text input. Two-way bound with v-model.">
    <div class="grid max-w-md gap-2">
      <Label for="msg">Message</Label>
      <Textarea id="msg" v-model="text" placeholder="Type your message here…" />
      <p class="text-muted-foreground text-xs">{{ text.length }} chars</p>
    </div>
  </Story>

  <Story title="Auto size" description="Automatically grows and shrinks with content.">
    <div class="grid max-w-md gap-3">
      <Textarea v-model="autoSizeText" :auto-size="true" placeholder="Type multiple lines…" />
    </div>
  </Story>

  <Story title="Auto size with min & max rows" description="Limits the height to a range.">
    <div class="grid max-w-md gap-3">
      <Textarea
        v-model="minMaxText"
        :auto-size="{ minRows: 2, maxRows: 6 }"
        placeholder="Type to see height clamping…"
      />
    </div>
  </Story>

  <Story title="Show count" description="Displays character count below the textarea.">
    <div class="grid max-w-md gap-3">
      <Textarea v-model="countText" show-count placeholder="Type to see count…" />
    </div>
  </Story>

  <Story title="Show count with formatter" description="Custom count formatting using a function.">
    <div class="grid max-w-md gap-3">
      <Textarea
        v-model="formatterText"
        :show-count="{ formatter: (count: number, max?: number) => `${count}${max ? ' / ' + max : ''} characters` }"
        :max-length="100"
        placeholder="Custom formatter…"
      />
    </div>
  </Story>

  <Story title="Allow clear" description="Click the X to clear the value.">
    <div class="grid max-w-md gap-3">
      <Textarea v-model="clearText" allow-clear placeholder="Type something…" />
    </div>
  </Story>

  <Story title="Max length with show count" description="Native maxlength combined with visual counter.">
    <div class="grid max-w-md gap-3">
      <Textarea v-model="maxLengthText" show-count :max-length="100" placeholder="Limited to 100 characters…" />
    </div>
  </Story>

  <Story title="Disabled & Readonly" description="Disabled prevents interaction; readonly shows value without editing.">
    <div class="grid max-w-md gap-3">
      <Textarea v-model="disabledText" disabled />
      <Textarea v-model="readonlyText" readonly />
    </div>
  </Story>

  <Story
    title="Variants with new features"
    description="Outlined, filled, solo, underlined, and plain variants combined with allowClear and showCount."
  >
    <div class="grid max-w-md gap-3">
      <Textarea variant="outlined" model-value="Outlined with clear" allow-clear show-count :max-length="50" />
      <Textarea variant="filled" model-value="Filled with clear" allow-clear show-count :max-length="50" />
      <Textarea variant="solo" model-value="Solo with clear" allow-clear show-count :max-length="50" />
      <Textarea variant="underlined" model-value="Underlined with clear" allow-clear show-count :max-length="50" />
      <Textarea variant="plain" model-value="Plain with clear" allow-clear show-count :max-length="50" />
    </div>
  </Story>
</template>
