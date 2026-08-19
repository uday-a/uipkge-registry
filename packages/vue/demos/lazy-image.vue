<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Img } from "@/components/ui/lazy-image";
import { ref } from "vue";

const galleryItems = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  src: `https://picsum.photos/seed/uipkge-${i}/600/400`,
  alt: `Stock photo ${i + 1}`,
}));

const swapSrc = ref("https://picsum.photos/seed/uipkge-swap-a/800/450");
function swap() {
  swapSrc.value = swapSrc.value.includes("swap-a")
    ? "https://picsum.photos/seed/uipkge-swap-b/800/450"
    : "https://picsum.photos/seed/uipkge-swap-a/800/450";
}
</script>

<template>
  <Story
    title="Default"
    description="loading='lazy' plus IntersectionObserver hold. Skeleton placeholder fades to image on load. Aspect ratio reserved up front to avoid layout shift."
  >
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <Img
        v-for="item in galleryItems.slice(0, 6)"
        :key="item.id"
        :src="item.src"
        :alt="item.alt"
        aspect-ratio="3/2"
        class="rounded-md"
      />
    </div>
  </Story>

  <Story
    title="Aspect ratios"
    description="Pass aspectRatio as a string (16/9, 1/1, etc.) or a number. Container reserves the slot before the image arrives."
  >
    <div class="flex flex-wrap gap-3">
      <Img
        src="https://picsum.photos/seed/uipkge-square/400/400"
        alt="Square"
        aspect-ratio="1/1"
        class="w-40 rounded-md"
      />
      <Img
        src="https://picsum.photos/seed/uipkge-wide/800/450"
        alt="Wide"
        aspect-ratio="16/9"
        class="w-72 rounded-md"
      />
      <Img
        src="https://picsum.photos/seed/uipkge-portrait/400/600"
        alt="Portrait"
        aspect-ratio="2/3"
        class="w-36 rounded-md"
      />
    </div>
  </Story>

  <Story
    title="Cover vs contain"
    description="cover (default) crops to fill, contain letterboxes. Useful when the image aspect ratio doesn't match the container."
  >
    <div class="grid grid-cols-2 gap-3">
      <div>
        <p class="text-muted-foreground mb-2 text-xs">cover (default)</p>
        <Img
          src="https://picsum.photos/seed/uipkge-cover/400/600"
          alt="Cover example"
          aspect-ratio="16/9"
          class="rounded-md"
        />
      </div>
      <div>
        <p class="text-muted-foreground mb-2 text-xs">contain</p>
        <Img
          src="https://picsum.photos/seed/uipkge-cover/400/600"
          alt="Contain example"
          aspect-ratio="16/9"
          :cover="false"
          class="rounded-md"
        />
      </div>
    </div>
  </Story>

  <Story
    title="Error fallback (slot + URL)"
    description="On error: render the fallback slot if provided, else the fallback URL, else a 'Image unavailable' placeholder."
  >
    <div class="grid grid-cols-3 gap-3">
      <div>
        <p class="text-muted-foreground mb-2 text-xs">No fallback</p>
        <Img
          src="https://example.invalid/missing.jpg"
          alt="Broken"
          aspect-ratio="1/1"
          class="rounded-md"
        />
      </div>
      <div>
        <p class="text-muted-foreground mb-2 text-xs">Fallback URL</p>
        <Img
          src="https://example.invalid/missing.jpg"
          alt="Broken with URL fallback"
          aspect-ratio="1/1"
          fallback="https://picsum.photos/seed/uipkge-fallback/400/400"
          class="rounded-md"
        />
      </div>
      <div>
        <p class="text-muted-foreground mb-2 text-xs">Slot fallback</p>
        <Img
          src="https://example.invalid/missing.jpg"
          alt="Broken with slot"
          aspect-ratio="1/1"
          class="rounded-md"
        >
          <template #fallback>
            <div
              class="bg-destructive/10 text-destructive flex h-full items-center justify-center text-xs font-medium"
            >
              Failed
            </div>
          </template>
        </Img>
      </div>
    </div>
  </Story>

  <Story
    title="Eager"
    description="eager skips the IntersectionObserver hold and uses loading='eager' + decoding='sync'. Use for above-the-fold hero images."
  >
    <Img
      src="https://picsum.photos/seed/uipkge-hero/1200/600"
      alt="Hero"
      aspect-ratio="2/1"
      eager
      class="rounded-md"
    />
  </Story>

  <Story
    title="Swap src"
    description="Updating the src resets state to loading and re-runs the placeholder + fade flow."
  >
    <div class="space-y-3">
      <div class="flex gap-2">
        <Button size="sm" @click="swap">Swap image</Button>
        <span class="text-muted-foreground self-center text-xs">{{
          swapSrc.split("/").slice(-3).join("/")
        }}</span>
      </div>
      <Img
        :src="swapSrc"
        alt="Swappable"
        aspect-ratio="16/9"
        class="rounded-md"
      />
    </div>
  </Story>
</template>
