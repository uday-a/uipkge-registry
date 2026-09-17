<script setup lang="ts">
import { Marquee } from "@/components/ui/marquee";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
</script>

<template>
  <Story
    title="Horizontal (default)"
    description="Content scrolls leftward. The slot is duplicated for a seamless loop."
  >
    <Marquee class="bg-muted/40 rounded-md py-3">
      <span
        v-for="t in ['Vue', 'React', 'Astro', 'Tailwind', 'Reka UI', 'Vite']"
        :key="t"
        class="px-2 text-sm font-medium"
      >
        {{ t }}
      </span>
    </Marquee>
  </Story>

  <Story
    title="Direction right"
    description="direction='right' reverses the travel direction."
  >
    <Marquee direction="right" class="bg-muted/40 rounded-md py-3">
      <span
        v-for="t in ['Vue', 'React', 'Astro', 'Tailwind', 'Reka UI', 'Vite']"
        :key="t"
        class="px-2 text-sm font-medium"
      >
        {{ t }}
      </span>
    </Marquee>
  </Story>

  <Story
    title="Speed"
    description="speed is the animation duration in seconds. Lower = faster."
  >
    <Marquee :speed="8" class="bg-muted/40 rounded-md py-3">
      <span
        v-for="t in ['Fast', 'Fast', 'Fast', 'Fast', 'Fast', 'Fast']"
        :key="t + Math.random()"
        class="px-2 text-sm font-medium"
      >
        {{ t }}
      </span>
    </Marquee>
  </Story>

  <Story
    title="Slow"
    description="A high speed value produces a slow, ambient scroll."
  >
    <Marquee :speed="40" class="bg-muted/40 rounded-md py-3">
      <span
        v-for="t in ['Slow', 'Slow', 'Slow', 'Slow', 'Slow', 'Slow']"
        :key="t + Math.random()"
        class="px-2 text-sm font-medium"
      >
        {{ t }}
      </span>
    </Marquee>
  </Story>

  <Story
    title="Pause on hover"
    description="Hover the row to freeze the animation."
  >
    <Marquee pause-on-hover class="bg-muted/40 rounded-md py-3">
      <span
        v-for="t in ['Hover', 'me', 'to', 'pause', 'the', 'scroll']"
        :key="t"
        class="px-2 text-sm font-medium"
      >
        {{ t }}
      </span>
    </Marquee>
  </Story>

  <Story title="Paused" description="paused=true hard-stops the animation.">
    <Marquee paused class="bg-muted/40 rounded-md py-3">
      <span
        v-for="t in ['Frozen', 'Frozen', 'Frozen', 'Frozen']"
        :key="t"
        class="px-2 text-sm font-medium"
      >
        {{ t }}
      </span>
    </Marquee>
  </Story>

  <Story
    title="Gap"
    description="gap controls spacing between repeated groups (px)."
  >
    <Marquee :gap="48" class="bg-muted/40 rounded-md py-3">
      <Badge v-for="t in ['A', 'B', 'C', 'D']" :key="t" variant="secondary">{{
        t
      }}</Badge>
    </Marquee>
  </Story>

  <Story
    title="Repeat"
    description="repeat sets how many copies of the slot are rendered."
  >
    <Marquee :repeat="3" class="bg-muted/40 rounded-md py-3">
      <span
        v-for="t in ['x3', 'x3', 'x3']"
        :key="t"
        class="px-2 text-sm font-medium"
      >
        {{ t }}
      </span>
    </Marquee>
  </Story>

  <Story
    title="Vertical"
    description="orientation='vertical' scrolls content upward."
  >
    <Marquee
      orientation="vertical"
      direction="up"
      :speed="12"
      class="bg-muted/40 h-48 w-48 rounded-md"
    >
      <div v-for="n in 8" :key="n" class="flex items-center gap-2 py-2">
        <Avatar class="size-6"
          ><AvatarFallback class="text-xs">{{ n }}</AvatarFallback></Avatar
        >
        <span class="text-sm">User {{ n }}</span>
      </div>
    </Marquee>
  </Story>

  <Story
    title="Vertical down"
    description="direction='down' reverses the vertical travel."
  >
    <Marquee
      orientation="vertical"
      direction="down"
      :speed="12"
      class="bg-muted/40 h-48 w-48 rounded-md"
    >
      <div v-for="n in 8" :key="n" class="flex items-center gap-2 py-2">
        <Avatar class="size-6"
          ><AvatarFallback class="text-xs">{{ n }}</AvatarFallback></Avatar
        >
        <span class="text-sm">User {{ n }}</span>
      </div>
    </Marquee>
  </Story>

  <Story
    title="Avatars row"
    description="A common use case: an infinite logo / avatar strip."
  >
    <Marquee :speed="15" :gap="24" class="py-2">
      <Avatar v-for="n in 10" :key="n" class="ring-background size-10 ring-2">
        <AvatarFallback>U{{ n }}</AvatarFallback>
      </Avatar>
    </Marquee>
  </Story>
</template>
