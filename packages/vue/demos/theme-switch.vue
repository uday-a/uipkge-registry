<script setup lang="ts">
import { ref } from "vue";
import { ThemeSwitch } from "@/components/ui/theme-switch";

const cards = ref<"light" | "dark" | "system">("system");
const icons = ref<"light" | "dark" | "system">("system");
const iconOnly = ref<"light" | "dark">("light");
const dropdown = ref<"light" | "dark" | "system">("system");
const pill = ref<"light" | "dark" | "system">("system");
const pill4 = ref<"light" | "dark" | "system" | "black">("system");
const sw = ref<"light" | "dark">("light");
</script>

<template>
  <Story
    title="Cards"
    description="Default — full SectionCard with three labeled buttons. Best for settings pages."
  >
    <ThemeSwitch v-model="cards" variant="cards" class="max-w-md" />
  </Story>

  <Story
    title="Icons"
    description="Compact 3-icon segmented row, no labels. Fits in toolbars."
  >
    <ThemeSwitch v-model="icons" variant="icons" />
  </Story>

  <Story
    title="Icon only"
    description="Single icon button cycling Light ⇆ Dark — header-grade, no chrome."
  >
    <ThemeSwitch v-model="iconOnly" variant="icon-only" />
  </Story>

  <Story
    title="Dropdown"
    description="Trigger button opening a DropdownMenu with the state list. Header-friendly."
  >
    <ThemeSwitch v-model="dropdown" variant="dropdown" />
  </Story>

  <Story
    title="Pill"
    description="Equal-width segments under a sliding primary indicator. Smooth 300ms translate."
  >
    <ThemeSwitch v-model="pill" variant="pill" class="max-w-sm" />
  </Story>

  <Story
    title="Pill — 4 states"
    description="Same sliding indicator, four states (system / light / dark / black-OLED)."
  >
    <ThemeSwitch v-model="pill4" variant="pill-4" class="max-w-md" />
  </Story>

  <Story
    title="Switch"
    description="iOS-style toggle with sun/moon glyphs at the ends. The thumb slides; idle glyph dims."
  >
    <ThemeSwitch v-model="sw" variant="switch" />
  </Story>
</template>
