<script setup lang="ts">
import EnvironmentVariablesManager from '@/components/blocks/environment-variables-manager/EnvironmentVariablesManager.vue'
</script>

<template>
  <Story
    title="Default"
    description="Full-featured environment variables manager with encrypted secrets, environment scoping (Production, Preview, Development), mask/reveal toggles, copy actions, and bulk import."
  >
    <EnvironmentVariablesManager />
  </Story>

  <Story
    title="Add Variable Form Open"
    description="The environment variable manager with the inline creation form opened by default."
  >
    <EnvironmentVariablesManager initial-add-open />
  </Story>

  <Story title="Production Scope Filtered" description="Initialized with the active environment tab set to Production.">
    <EnvironmentVariablesManager default-environment="production" />
  </Story>

  <Story
    title="Empty State"
    description="Zero-state view prompting the user to add their first secret or import an existing .env file."
  >
    <EnvironmentVariablesManager :initial-variables="[]" />
  </Story>
</template>
