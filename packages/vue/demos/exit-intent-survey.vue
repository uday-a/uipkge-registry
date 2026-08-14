<script setup lang="ts">
import ExitIntentSurvey from '@/components/blocks/exit-intent-survey/ExitIntentSurvey.vue'
// ExitIntentSurvey is the block file the user installs. Open
// `components/blocks/ExitIntentSurvey.vue` after install to change the
// options and post the response to your endpoint.
</script>

<template>
  <Story
    title="Exit Intent — Survey"
    description="A one-question exit survey with preset answers and an optional free-text field, closing on a thank-you state rather than staying open."
  >
    <ExitIntentSurvey />
  </Story>
</template>
