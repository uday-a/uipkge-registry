<script setup lang="ts">
import { Skeleton, SkeletonLoader, SkeletonText } from '@/components/ui/skeleton'
</script>

<template>
  <Story title="Profile placeholder" description="Hand-composed skeleton row using the base Skeleton primitive.">
    <div class="max-w-md space-y-4">
      <div class="flex items-center gap-3">
        <Skeleton class="size-10 rounded-full" />
        <div class="flex-1 space-y-2">
          <Skeleton class="h-3 w-1/2" />
          <Skeleton class="h-3 w-3/4" />
        </div>
      </div>
      <Skeleton class="h-32 w-full" />
    </div>
  </Story>

  <Story title="Card placeholder" description="Stack of muted blocks for card-sized loading content.">
    <div class="grid max-w-sm gap-3">
      <Skeleton class="h-3 w-1/3" />
      <Skeleton class="h-7 w-full" />
      <Skeleton class="h-7 w-full" />
      <Skeleton class="h-3 w-1/2" />
    </div>
  </Story>

  <Story
    title="SkeletonText paragraph"
    description="SkeletonText paints N lines with first/last line width tweaks for a natural paragraph shape."
  >
    <SkeletonText :lines="4" first-line-width="100%" last-line-width="60%" class="max-w-md" />
  </Story>

  <Story
    title="SkeletonLoader presets"
    description="SkeletonLoader has 24 variants — bigger compositions like article, card-avatar, and list-item-three-line are pre-baked."
  >
    <div class="grid max-w-3xl gap-6 md:grid-cols-2">
      <div class="space-y-2">
        <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">article</p>
        <div class="rounded-lg border p-4">
          <SkeletonLoader variant="article" :rows="3" />
        </div>
      </div>
      <div class="space-y-2">
        <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">card-avatar</p>
        <div class="rounded-lg border p-4">
          <SkeletonLoader variant="card-avatar" :rows="2" />
        </div>
      </div>
      <div class="space-y-2">
        <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">list-item-three-line</p>
        <div class="rounded-lg border p-4">
          <SkeletonLoader variant="list-item-three-line" :rows="3" />
        </div>
      </div>
      <div class="space-y-2">
        <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">table</p>
        <div class="rounded-lg border p-4">
          <SkeletonLoader variant="table" :rows="4" />
        </div>
      </div>
    </div>
  </Story>

  <Story
    title="SkeletonLoader atoms"
    description="Single-shape variants — avatar, image, button, badge, chip — for finer-grained placeholders inside hand-composed layouts."
  >
    <div class="flex flex-wrap items-center gap-4">
      <SkeletonLoader variant="avatar-small" />
      <SkeletonLoader variant="avatar" />
      <SkeletonLoader variant="avatar-large" />
      <SkeletonLoader variant="button" />
      <SkeletonLoader variant="badge" />
      <SkeletonLoader variant="chip" />
      <SkeletonLoader variant="chip-icon" />
    </div>
  </Story>

  <Story
    title="Image placeholders"
    description="Three image-shaped variants for thumbnails, hero images, and aspect-locked media."
  >
    <div class="grid max-w-3xl gap-4 md:grid-cols-3">
      <SkeletonLoader variant="image-small" />
      <SkeletonLoader variant="image" />
      <SkeletonLoader variant="image-large" />
    </div>
  </Story>
</template>
