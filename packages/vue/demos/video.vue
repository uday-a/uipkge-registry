<script setup lang="ts">
import { Video } from '@/components/ui/video'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const sampleMp4 = '/media/flower.mp4'
const samplePoster = '/media/flower.jpg'
</script>

<template>
  <Story
    title="Feature player"
    description="Custom controls with play/pause, seek, skip ±10s, volume, and fullscreen — the default hero video experience."
  >
    <Video :src="sampleMp4" :poster="samplePoster" class="max-w-2xl" />
  </Story>

  <Story
    title="Autoplay (muted)"
    description="Autoplay starts muted to satisfy browser policies — ideal for background reels and silent promos."
  >
    <Video :src="sampleMp4" :poster="samplePoster" :autoplay="true" :muted="true" :loop="true" class="max-w-2xl" />
  </Story>

  <Story
    title="Native controls"
    description="Drop in the browser's built-in controls when you don't need a branded overlay."
  >
    <Video :src="sampleMp4" :poster="samplePoster" :native-controls="true" class="max-w-2xl" />
  </Story>

  <Story
    title="Aspect ratio variants"
    description="16/9 (default), 4/3 classic, 1/1 square, and 9/16 portrait — match the player to your source."
  >
    <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
      <div class="space-y-1.5">
        <p class="text-muted-foreground text-xs">4/3 — classic TV</p>
        <Video :src="sampleMp4" :poster="samplePoster" aspect-ratio="4/3" />
      </div>
      <div class="space-y-1.5">
        <p class="text-muted-foreground text-xs">1/1 — square</p>
        <Video :src="sampleMp4" :poster="samplePoster" aspect-ratio="1/1" />
      </div>
      <div class="space-y-1.5">
        <p class="text-muted-foreground text-xs">9/16 — portrait</p>
        <Video :src="sampleMp4" :poster="samplePoster" aspect-ratio="9/16" class="max-w-xs" />
      </div>
      <div class="space-y-1.5">
        <p class="text-muted-foreground text-xs">16/9 — widescreen</p>
        <Video :src="sampleMp4" :poster="samplePoster" aspect-ratio="16/9" />
      </div>
    </div>
  </Story>

  <Story title="Without poster" description="No poster image — the player area is black until playback starts.">
    <Video :src="sampleMp4" class="max-w-2xl" />
  </Story>

  <Story
    title="Custom playback rate"
    description="Set an initial playback rate — 1.5× for tutorials, 0.5× for slow-motion analysis."
  >
    <Video :src="sampleMp4" :poster="samplePoster" :playback-rate="1.5" class="max-w-2xl" />
  </Story>

  <Story
    title="In a content card"
    description="Video embedded in a card with a title and description — the pattern for course lessons and media libraries."
  >
    <Card class="max-w-2xl">
      <CardHeader>
        <CardTitle>Lesson 3 — Composition basics</CardTitle>
        <CardDescription>5 min · 1.5× speed recommended</CardDescription>
      </CardHeader>
      <CardContent>
        <Video :src="sampleMp4" :poster="samplePoster" :playback-rate="1.5" />
      </CardContent>
    </Card>
  </Story>
</template>
