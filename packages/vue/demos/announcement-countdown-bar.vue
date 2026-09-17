<script setup lang="ts">
import AnnouncementCountdownBar from '@/components/blocks/announcement-countdown-bar/AnnouncementCountdownBar.vue'
// AnnouncementCountdownBar is the block file the user installs. Open
// `components/blocks/AnnouncementCountdownBar.vue` after install and set
// `deadline` to a real date. The timer starts only after mount, so server
// and client first paint agree.
</script>

<template>
  <Story
    title="Announcement — Countdown Bar"
    description="Top strip counting down to a deadline. The timer ticks in place without relaying out the bar, and dismissing it keeps it closed for the session."
  >
    <AnnouncementCountdownBar />
  </Story>
</template>
