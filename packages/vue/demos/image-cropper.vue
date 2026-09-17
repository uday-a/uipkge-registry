<script setup lang="ts">
import { ImageCropper } from "@/components/ui/image-cropper";

const src =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop&q=80";
const portrait =
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=1200&fit=crop&q=80";
</script>

<template>
  <Story
    title="Default"
    description="Square viewport. Drag to pan, scroll to zoom."
  >
    <ImageCropper :src="src" alt="Coast" />
  </Story>

  <Story
    title="Show zoom"
    description="showZoom adds the range control. Same component, one prop."
  >
    <ImageCropper :src="src" alt="Coast" show-zoom />
  </Story>

  <Story title="16 / 9" description="aspectRatio=16/9.">
    <ImageCropper :src="src" alt="Coast" :aspect-ratio="16 / 9" show-zoom />
  </Story>

  <Story title="4 / 3" description="aspectRatio=4/3.">
    <ImageCropper :src="src" alt="Coast" :aspect-ratio="4 / 3" show-zoom />
  </Story>

  <Story title="Portrait" description="aspectRatio=3/4 on a tall source.">
    <ImageCropper :src="portrait" alt="City" :aspect-ratio="3 / 4" show-zoom />
  </Story>

  <Story title="Circle" description="rounded=full for an avatar crop.">
    <ImageCropper
      :src="src"
      alt="Coast"
      rounded="full"
      class="max-w-xs"
      show-zoom
    />
  </Story>

  <Story title="Banner" description="aspectRatio=21/9.">
    <ImageCropper :src="src" alt="Coast" :aspect-ratio="21 / 9" show-zoom />
  </Story>

  <Story
    title="Zoom limits"
    description="minZoom and maxZoom clamp the slider and wheel."
  >
    <ImageCropper
      :src="src"
      alt="Coast"
      :min-zoom="1"
      :max-zoom="2"
      show-zoom
    />
  </Story>

  <Story title="Disabled" description="disabled ignores pointer and keyboard.">
    <ImageCropper :src="src" alt="Coast" disabled show-zoom />
  </Story>

  <Story
    title="No zoom control"
    description="Wheel and + / − still work when showZoom is omitted."
  >
    <ImageCropper :src="src" alt="Coast" />
  </Story>
</template>
