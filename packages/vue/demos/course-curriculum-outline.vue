<script setup lang="ts">
import CourseCurriculumOutline from '@/components/blocks/course-curriculum-outline/CourseCurriculumOutline.vue'
</script>

<template>
  <Story
    title="In Progress (33% Complete)"
    description="Interactive video course curriculum with progress tracking, completed modules, active lesson indicator, locked sections, certificate preview, and downloadable resources."
  >
    <CourseCurriculumOutline />
  </Story>

  <Story
    title="Course Completed & Certificate Unlocked"
    description="Full syllabus with 100% completion state (24/24 lessons), verified badge status, and downloadable PDF certificate."
  >
    <CourseCurriculumOutline initial-complete />
  </Story>
</template>
