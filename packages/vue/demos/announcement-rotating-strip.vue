<script setup lang="ts">
import AnnouncementRotatingStrip from '@/components/blocks/announcement-rotating-strip/AnnouncementRotatingStrip.vue'
// AnnouncementRotatingStrip is the block file the user installs. Open
// `components/blocks/AnnouncementRotatingStrip.vue` after install to edit the
// `messages` array; rotation pauses whenever the bar has focus.
</script>

<template>
  <Story
    title="Announcement — Rotating Strip"
    description="Announcement bar cycling through several messages on a timer. Hover or focus pauses the rotation; dot controls step between messages manually."
  >
    <AnnouncementRotatingStrip />
  </Story>
</template>
