<script setup lang="ts">
import DeploymentPipeline from '@/components/blocks/deployment-pipeline/DeploymentPipeline.vue'
</script>

<template>
  <Story
    title="Default"
    description="CI/CD deployment pipeline dashboard with active environment status, execution stepper, interactive build log terminal, and filterable history table."
  >
    <DeploymentPipeline />
  </Story>

  <Story title="Production only" description="Pre-filtered deployment history table showing production releases.">
    <DeploymentPipeline initial-env="production" />
  </Story>

  <Story title="Collapsed logs" description="Compact hero card overview with build terminal collapsed by default.">
    <DeploymentPipeline :initial-logs-open="false" />
  </Story>
</template>
