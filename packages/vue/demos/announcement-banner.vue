<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import AnnouncementBanner from '@/components/blocks/announcement-banner/AnnouncementBanner.vue'

const solidKey = ref(0)
const softKey = ref(0)
const gradientKey = ref(0)
</script>

<template>
  <Story
    title="Solid"
    description="Primary pill with short copy, arrow link, and inline dismiss. Dismiss it, then reset to bring it back."
  >
    <div class="flex flex-col items-center gap-3">
      <AnnouncementBanner :key="solidKey" variant="solid" />
      <Button variant="outline" size="sm" @click="solidKey++">Reset banner</Button>
    </div>
  </Story>

  <Story
    title="Soft"
    description="Muted strip with sparkle icon, version badge, supporting copy, Read more link, and dismiss."
  >
    <div class="flex flex-col items-center gap-3">
      <AnnouncementBanner :key="softKey" variant="soft" class="w-full" />
      <Button variant="outline" size="sm" @click="softKey++">Reset banner</Button>
    </div>
  </Story>

  <Story
    title="Gradient"
    description="Subtle left-to-right primary tint with centered content. Flip the theme toggle to check the alpha gradient in dark mode."
  >
    <div class="flex flex-col items-center gap-3">
      <AnnouncementBanner :key="gradientKey" variant="gradient" class="w-full" />
      <Button variant="outline" size="sm" @click="gradientKey++">Reset banner</Button>
    </div>
  </Story>
</template>
