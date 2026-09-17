<script setup lang="ts">
import { SecurityComplianceBadges } from '@/components/blocks/security-compliance-badges'
import Story from '@/components/story/Story.vue'
</script>

<template>
  <Story title="Default" description="Enterprise security compliance workbench with interactive audit inspector">
    <div class="w-full">
      <SecurityComplianceBadges />
    </div>
  </Story>
</template>
