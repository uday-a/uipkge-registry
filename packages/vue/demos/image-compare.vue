<script setup lang="ts">
import { ref } from "vue";
import { ImageCompare } from "@/components/ui/image-compare";
import { GripHorizontal } from "lucide-vue-next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const pos = ref(50);

// Photo editing: original vs color-graded (warm graded retouch)
const photoBefore =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80&sat=-60&con=-20";
const photoAfter =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80&sat=40&con=20";

// Architecture / Cityscape: raw blueprint/monochrome vs full color
const uiBefore =
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop&q=80&sat=-80";
const uiAfter =
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop&q=80";
</script>

<template>
  <Story
    title="Photo edit before / after"
    description="Drag the slider to compare an original photo with its color-graded version — the classic retouching reveal."
  >
    <ImageCompare
      :before-src="photoBefore"
      :after-src="photoAfter"
      before-label="Original"
      after-label="Edited"
      class="h-72 w-full max-w-2xl"
    />
  </Story>

  <Story
    title="UI redesign"
    description="Show stakeholders the old dashboard vs the new layout in one interactive frame."
  >
    <ImageCompare
      :before-src="uiBefore"
      :after-src="uiAfter"
      before-label="v1.0"
      after-label="v2.0"
      class="h-72 w-full max-w-2xl"
    />
  </Story>

  <Story
    title="Controlled slider"
    description="v-model binds the position (0–100). Pair with a range input for precise, keyboard-friendly control."
  >
    <div class="flex max-w-2xl flex-col gap-3">
      <ImageCompare
        v-model="pos"
        :before-src="photoBefore"
        :after-src="photoAfter"
        class="h-72 w-full"
      />
      <div class="flex items-center gap-3 text-sm">
        <span class="text-muted-foreground w-16 tabular-nums"
          >{{ pos.toFixed(0) }}%</span
        >
        <input
          v-model.number="pos"
          type="range"
          min="0"
          max="100"
          class="flex-1"
        />
      </div>
    </div>
  </Story>

  <Story
    title="Orientation & labels"
    description="Vertical divider and hidden captions for minimalist layouts."
  >
    <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
      <ImageCompare
        :before-src="photoBefore"
        :after-src="photoAfter"
        orientation="vertical"
        class="h-80 w-full"
      />
      <ImageCompare
        :before-src="uiBefore"
        :after-src="uiAfter"
        :show-labels="false"
        class="h-80 w-full"
      />
    </div>
  </Story>

  <Story
    title="Custom handle"
    description="Replace the default arrow icon with a grip — or hide the handle entirely for a clean divider line."
  >
    <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
      <ImageCompare
        :before-src="photoBefore"
        :after-src="photoAfter"
        class="h-72 w-full"
      >
        <template #handle>
          <GripHorizontal class="text-primary size-5" />
        </template>
      </ImageCompare>
      <ImageCompare
        :before-src="uiBefore"
        :after-src="uiAfter"
        :show-handle="false"
        class="h-72 w-full"
      />
    </div>
  </Story>

  <Story
    title="Disabled & initial position"
    description="disabled locks the slider; set an initial modelValue to start the comparison at a specific point."
  >
    <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
      <ImageCompare
        :before-src="photoBefore"
        :after-src="photoAfter"
        :model-value="30"
        disabled
        class="h-72 w-full"
      />
      <ImageCompare
        :before-src="uiBefore"
        :after-src="uiAfter"
        :model-value="25"
        class="h-72 w-full"
      />
    </div>
  </Story>

  <Story
    title="In a product card"
    description="Before/after comparison embedded in a card with context — the pattern for case studies and portfolios."
  >
    <Card class="max-w-2xl">
      <CardHeader>
        <CardTitle>Beach retouch</CardTitle>
        <CardDescription
          >Color grade applied in Lightroom — drag to compare.</CardDescription
        >
      </CardHeader>
      <CardContent>
        <ImageCompare
          :before-src="photoBefore"
          :after-src="photoAfter"
          before-label="SOOC"
          after-label="Graded"
          class="h-72 w-full"
        />
      </CardContent>
    </Card>
  </Story>
</template>
