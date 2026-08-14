<script setup lang="ts">
import ChangelogReleaseNotesTimeline from '@/components/blocks/changelog-release-notes-timeline/ChangelogReleaseNotesTimeline.vue'
import Story from '@/components/story/Story.vue'
</script>

<template>
  <Story title="Default" description="Developer changelog timeline with version filter tabs and categorical changes">
    <div class="w-full">
      <ChangelogReleaseNotesTimeline />
    </div>
  </Story>
</template>
