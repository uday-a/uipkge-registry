<script setup lang="ts">
import { computed } from "vue";
import {
  ChevronDown,
  Monitor,
  Moon,
  Palette,
  Sparkles,
  Sun,
} from "lucide-vue-next";
import { SectionCard } from "@/components/ui/section-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "light" | "dark" | "system" | "black";
type Variant =
  "cards" | "icons" | "icon-only" | "dropdown" | "pill" | "pill-4" | "switch";

const ICONS: Record<Theme, any> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
  black: Sparkles,
};

const LABELS: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
  black: "Black",
};

const VARIANT_OPTIONS: Record<Variant, Theme[]> = {
  cards: ["light", "dark", "system"],
  icons: ["light", "dark", "system"],
  "icon-only": ["light", "dark"],
  dropdown: ["light", "dark", "system"],
  pill: ["light", "dark", "system"],
  "pill-4": ["system", "light", "dark", "black"],
  switch: ["light", "dark"],
};

const props = withDefaults(
  defineProps<{
    modelValue: Theme;
    variant?: Variant;
    title?: string;
    description?: string;
    class?: string;
  }>(),
  { variant: "cards" },
);

const emit = defineEmits<{ "update:modelValue": [Theme] }>();

const options = computed(() => VARIANT_OPTIONS[props.variant]);
const activeIndex = computed(() => {
  const i = options.value.indexOf(props.modelValue);
  return i === -1 ? 0 : i;
});

const indicatorStyle = computed(() => ({
  width: `calc((100% - 4px) / ${options.value.length})`,
  transform: `translateX(calc(${activeIndex.value} * 100%))`,
}));

const switchThumbStyle = computed(() => ({
  transform: `translateX(${props.modelValue === "dark" ? "36px" : "4px"})`,
}));

function set(t: Theme) {
  emit("update:modelValue", t);
}
function cycle() {
  const next = options.value[(activeIndex.value + 1) % options.value.length];
  if (next) emit("update:modelValue", next);
}
</script>

<template>
  <!-- Cards: full SectionCard with 3-button grid (default) -->
  <SectionCard
    v-if="variant === 'cards'"
    :title="title ?? 'Appearance'"
    :description="description ?? 'Choose your interface theme.'"
    :class="$props.class"
  >
    <template #header-action>
      <Palette class="text-muted-foreground size-5" />
    </template>
    <div
      class="grid grid-cols-3 gap-2"
      role="radiogroup"
      :aria-label="title ?? 'Theme'"
    >
      <button
        type="button"
        v-for="t in options"
        :key="t"
        role="radio"
        :aria-checked="modelValue === t"
        class="focus-visible:ring-ring rounded-md border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:outline-none"
        :class="
          modelValue === t
            ? 'border-primary ring-primary bg-primary/5 ring-1'
            : 'border-border hover:bg-muted/50'
        "
        @click="set(t)"
      >
        <component
          :is="ICONS[t]"
          class="text-muted-foreground mb-2 size-4"
          aria-hidden="true"
        />
        <p class="text-xs font-medium">{{ LABELS[t] }}</p>
      </button>
    </div>
  </SectionCard>

  <!-- Icons: compact 3-icon segmented row, no labels -->
  <div
    v-else-if="variant === 'icons'"
    role="radiogroup"
    :aria-label="title ?? 'Theme'"
    :class="[
      'border-border bg-card inline-flex items-center gap-0.5 rounded-md border p-0.5',
      $props.class,
    ]"
  >
    <button
      type="button"
      v-for="t in options"
      :key="t"
      role="radio"
      :aria-checked="modelValue === t"
      :aria-label="LABELS[t]"
      class="focus-visible:ring-ring grid size-7 place-items-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
      :class="
        modelValue === t
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      "
      @click="set(t)"
    >
      <component :is="ICONS[t]" class="size-4" aria-hidden="true" />
    </button>
  </div>

  <!-- Icon-only: header-grade icon button. No border, ghost background,
       rounded-lg to match adjacent header affordances (notification
       bell, profile avatar). The previous `rounded-full border bg-card`
       coin-shape stood out from typical icon-button row layouts; if you
       need that look, pass `class="rounded-full border border-border bg-card"`
       and it'll override.

       Dropped the rotate+fade Transition that the previous version
       wrapped the icon in. `mode="out-in"` with opacity-0 on both the
       enter-from and leave-to states left a frame where the button was
       empty -- visible as a flicker that occasionally rendered as "no
       icon at all" on slower devices. A direct swap reads cleaner. -->
  <button
    type="button"
    v-else-if="variant === 'icon-only'"
    :aria-label="LABELS[modelValue]"
    :class="[
      'text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring inline-flex size-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none',
      $props.class,
    ]"
    @click="cycle"
  >
    <component :is="ICONS[modelValue]" class="size-4" aria-hidden="true" />
  </button>

  <!-- Dropdown: trigger button → menu of states -->
  <DropdownMenu v-else-if="variant === 'dropdown'">
    <DropdownMenuTrigger as-child>
      <button
        type="button"
        :class="[
          'border-border bg-card hover:bg-muted focus-visible:ring-ring inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none',
          $props.class,
        ]"
      >
        <component :is="ICONS[modelValue]" class="size-4" aria-hidden="true" />
        <span>{{ LABELS[modelValue] }}</span>
        <ChevronDown class="size-3 opacity-60" aria-hidden="true" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="min-w-[140px]">
      <DropdownMenuItem
        v-for="t in options"
        :key="t"
        @select="set(t)"
        @click="set(t)"
      >
        <component :is="ICONS[t]" class="mr-2 size-4" aria-hidden="true" />
        <span>{{ LABELS[t] }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- Pill / Pill-4: equal segments with sliding indicator -->
  <div
    v-else-if="variant === 'pill' || variant === 'pill-4'"
    role="radiogroup"
    :aria-label="title ?? 'Theme'"
    :class="[
      'border-border bg-card relative inline-flex w-full max-w-md rounded-full border p-0.5',
      $props.class,
    ]"
  >
    <span
      aria-hidden
      class="bg-primary pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 rounded-full transition-transform duration-300 ease-out"
      :style="indicatorStyle"
    />
    <button
      type="button"
      v-for="t in options"
      :key="t"
      role="radio"
      :aria-checked="modelValue === t"
      :aria-label="LABELS[t]"
      class="focus-visible:ring-ring relative z-[1] inline-flex h-7 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
      :class="
        modelValue === t
          ? 'text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground'
      "
      @click="set(t)"
    >
      <component :is="ICONS[t]" class="size-3.5" aria-hidden="true" />
      <span>{{ LABELS[t] }}</span>
    </button>
  </div>

  <!-- Switch: iOS-style 2-state toggle with thumb that slides -->
  <button
    type="button"
    v-else-if="variant === 'switch'"
    role="switch"
    :aria-checked="modelValue === 'dark'"
    :aria-label="LABELS[modelValue]"
    :class="[
      'border-border focus-visible:ring-ring relative inline-flex h-8 w-16 items-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none',
      modelValue === 'dark' ? 'bg-primary' : 'bg-muted',
      $props.class,
    ]"
    @click="set(modelValue === 'dark' ? 'light' : 'dark')"
  >
    <Sun
      class="text-warning absolute left-1.5 size-4 transition-opacity"
      :class="modelValue === 'dark' ? 'opacity-30' : 'opacity-100'"
      aria-hidden="true"
    />
    <Moon
      class="text-muted-foreground absolute right-1.5 size-4 transition-opacity"
      :class="modelValue === 'light' ? 'opacity-30' : 'opacity-100'"
      aria-hidden="true"
    />
    <span
      aria-hidden
      class="bg-card border-border absolute size-6 rounded-full border shadow transition-transform duration-300 ease-out"
      :style="switchThumbStyle"
    />
  </button>
</template>
