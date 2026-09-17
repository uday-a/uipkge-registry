<script setup lang="ts">
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Play } from "lucide-vue-next";
</script>

<template>
  <Story
    title="Common ratios"
    description="16:9, 4:3, and 1:1 — the three workhorses for media and avatars."
  >
    <div class="grid gap-3 sm:grid-cols-3">
      <div>
        <AspectRatio
          :ratio="16 / 9"
          class="bg-muted grid place-items-center rounded-md"
        >
          <span class="text-muted-foreground font-mono text-xs">16 : 9</span>
        </AspectRatio>
      </div>
      <div>
        <AspectRatio
          :ratio="4 / 3"
          class="bg-muted grid place-items-center rounded-md"
        >
          <span class="text-muted-foreground font-mono text-xs">4 : 3</span>
        </AspectRatio>
      </div>
      <div>
        <AspectRatio
          :ratio="1"
          class="bg-muted grid place-items-center rounded-md"
        >
          <span class="text-muted-foreground font-mono text-xs">1 : 1</span>
        </AspectRatio>
      </div>
    </div>
  </Story>

  <Story
    title="Portrait"
    description="Tall ratios for phone-shaped media: 3:4 and 9:16 (Stories / Reels)."
  >
    <div class="grid max-w-md gap-3 sm:grid-cols-2">
      <AspectRatio
        :ratio="3 / 4"
        class="bg-muted grid place-items-center rounded-md"
      >
        <span class="text-muted-foreground font-mono text-xs">3 : 4</span>
      </AspectRatio>
      <AspectRatio
        :ratio="9 / 16"
        class="bg-muted grid place-items-center rounded-md"
      >
        <span class="text-muted-foreground font-mono text-xs">9 : 16</span>
      </AspectRatio>
    </div>
  </Story>

  <Story
    title="Ultrawide"
    description="Very wide ratios for hero banners and cinematic crops."
  >
    <div class="space-y-3">
      <AspectRatio
        :ratio="21 / 9"
        class="bg-muted grid place-items-center rounded-md"
      >
        <span class="text-muted-foreground font-mono text-xs">21 : 9</span>
      </AspectRatio>
      <AspectRatio
        :ratio="32 / 9"
        class="bg-muted grid place-items-center rounded-md"
      >
        <span class="text-muted-foreground font-mono text-xs">32 : 9</span>
      </AspectRatio>
    </div>
  </Story>

  <Story
    title="With image fill"
    description="An <img> inside fills the box — combine with object-cover to crop without distortion."
  >
    <div class="max-w-md">
      <AspectRatio :ratio="16 / 9" class="bg-muted overflow-hidden rounded-md">
        <img
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=800&dpr=2&q=80"
          alt="Drew beach at sunset"
          class="size-full object-cover"
        />
      </AspectRatio>
    </div>
  </Story>

  <Story
    title="Video placeholder"
    description="Reserve cinematic space before the player loads to avoid layout shift."
  >
    <div class="max-w-md">
      <AspectRatio
        :ratio="16 / 9"
        class="bg-muted/50 grid place-items-center rounded-md border border-dashed"
      >
        <div class="text-muted-foreground flex flex-col items-center gap-2">
          <Play class="size-8" aria-hidden="true" />
          <span class="text-xs">Video player (16:9)</span>
        </div>
      </AspectRatio>
    </div>
  </Story>
</template>
