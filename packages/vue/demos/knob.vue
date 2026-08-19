<script setup lang="ts">
import { Knob } from "@/components/ui/knob";
import { ref } from "vue";

const v1 = ref(40);
const v2 = ref(7);
const v3 = ref(60);
const v4 = ref(20);
const v5 = ref(75);
const v6 = ref(50);
</script>

<template>
  <Story
    title="Default"
    description="A 100px knob with 0-100 range and step 1. Drag, arrow keys, or wheel to change."
  >
    <div class="flex items-center gap-6">
      <Knob v-model="v1" />
      <span class="text-muted-foreground text-sm">value: {{ v1 }}</span>
    </div>
  </Story>

  <Story
    title="Custom range and step"
    description="0-10 with step 1. Use any numeric domain."
  >
    <div class="flex items-center gap-6">
      <Knob v-model="v2" :min="0" :max="10" :step="1" />
      <span class="text-muted-foreground text-sm">value: {{ v2 }}</span>
    </div>
  </Story>

  <Story
    title="Sized"
    description="Pass size in pixels. The dial is square; text scales with the SVG viewBox."
  >
    <div class="flex items-end gap-6">
      <Knob v-model="v3" :size="60" />
      <Knob v-model="v3" :size="100" />
      <Knob v-model="v3" :size="160" />
    </div>
  </Story>

  <Story
    title="Custom colors"
    description="valueColor and rangeColor accept any CSS color or var."
  >
    <div class="flex items-center gap-6">
      <Knob
        v-model="v4"
        value-color="var(--chart-1)"
        range-color="var(--muted)"
      />
      <Knob v-model="v4" value-color="var(--destructive)" />
    </div>
  </Story>

  <Story
    title="Readonly and disabled"
    description="Readonly displays the value but blocks input. Disabled also greys out and removes focus."
  >
    <div class="flex items-center gap-6">
      <Knob v-model="v5" readonly />
      <Knob v-model="v5" disabled />
    </div>
  </Story>

  <Story
    title="Custom value template"
    description="Override the centered text via the value slot."
  >
    <div class="flex items-center gap-6">
      <Knob v-model="v6">
        <template #value="{ value }">
          <tspan>{{ value }}%</tspan>
        </template>
      </Knob>
    </div>
  </Story>
</template>
