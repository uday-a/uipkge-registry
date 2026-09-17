<script setup lang="ts">
import AnnouncementCornerToast from '@/components/blocks/announcement-corner-toast/AnnouncementCornerToast.vue'
// AnnouncementCornerToast is the block file the user installs. Open
// `components/blocks/AnnouncementCornerToast.vue` after install to change the
// `delay` or the copy. Dismissal is session-scoped.
</script>

<template>
  <Story
    title="Announcement — Corner Card"
    description="Corner card that slides in after a short delay with a thumbnail, headline, supporting line, and two actions — announcement weight without taking page space."
  >
    <AnnouncementCornerToast />
  </Story>
</template>
