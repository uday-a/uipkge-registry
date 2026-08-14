<script setup lang="ts">
import AnnouncementBannerSplit from '@/components/blocks/announcement-banner-split/AnnouncementBannerSplit.vue'
// AnnouncementBannerSplit is the block file the user installs. Open
// `components/blocks/AnnouncementBannerSplit.vue` after install to change the
// `tone` between neutral and attention.
</script>

<template>
  <Story
    title="Announcement — Split Banner"
    description="Full-width band split between a labelled message column and an action column — sized for release notes and maintenance notices rather than promotions."
  >
    <AnnouncementBannerSplit />
  </Story>
</template>
