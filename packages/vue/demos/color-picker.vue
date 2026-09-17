<script setup lang="ts">
import { ref } from "vue";
import { ColorPicker } from "@/components/ui/color-picker";
import { Label } from "@/components/ui/label";
const color = ref("#3b82f6");
const primary = ref("#22c55e");
const accent = ref("#ec4899");
const surface = ref("#171717");
const locked = ref("#8b5cf6");
const brand = ref("#f97316");
</script>

<template>
  <Story
    title="Default"
    description="Color picker bound to a hex string with the current value displayed below."
  >
    <div class="space-y-3">
      <ColorPicker v-model="color" />
      <p class="text-muted-foreground text-xs">
        Value: <code class="text-foreground">{{ color }}</code>
      </p>
    </div>
  </Story>

  <Story
    title="Side by side"
    description="Multiple independent pickers driving distinct theme tokens."
  >
    <div class="grid gap-6 sm:grid-cols-3">
      <div class="space-y-2">
        <p class="text-sm font-medium">Primary</p>
        <ColorPicker v-model="primary" />
        <div
          class="h-8 rounded-md border"
          :style="{ backgroundColor: primary }"
        />
      </div>
      <div class="space-y-2">
        <p class="text-sm font-medium">Accent</p>
        <ColorPicker v-model="accent" />
        <div
          class="h-8 rounded-md border"
          :style="{ backgroundColor: accent }"
        />
      </div>
      <div class="space-y-2">
        <p class="text-sm font-medium">Surface</p>
        <ColorPicker v-model="surface" />
        <div
          class="h-8 rounded-md border"
          :style="{ backgroundColor: surface }"
        />
      </div>
    </div>
  </Story>

  <Story
    title="Disabled"
    description="Both the color trigger and the hex field become non-interactive."
  >
    <ColorPicker v-model="locked" disabled />
  </Story>

  <Story
    title="Custom presets"
    description="Pass a presets array to override the default swatch palette — pair with hide-hex-input for a swatch-only picker."
  >
    <div class="space-y-3">
      <ColorPicker
        v-model="color"
        :presets="['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']"
        hide-hex-input
      />
      <p class="text-muted-foreground text-xs">
        Value: <code class="text-foreground">{{ color }}</code>
      </p>
    </div>
  </Story>

  <Story
    title="In a form"
    description="Wrapped in a labeled card with a helper sentence — the typical setting layout."
  >
    <div
      class="bg-card text-card-foreground max-w-sm space-y-3 rounded-lg border p-4"
    >
      <div class="space-y-1">
        <Label for="brand-color">Brand color</Label>
        <p class="text-muted-foreground text-xs">
          Used on primary buttons, links, and active tabs.
        </p>
      </div>
      <ColorPicker id="brand-color" v-model="brand" />
      <div class="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
        <span class="size-4 rounded" :style="{ backgroundColor: brand }" />
        <span
          >Preview: this button uses <code>{{ brand }}</code></span
        >
      </div>
    </div>
  </Story>
</template>
