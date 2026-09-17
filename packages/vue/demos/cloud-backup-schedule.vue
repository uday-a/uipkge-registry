<script setup lang="ts">
import CloudBackupSchedule from "@/components/blocks/cloud-backup-schedule/CloudBackupSchedule.vue";
</script>

<template>
  <Story
    title="Default Schedule"
    description="Automated daily backup schedule with vault quota gauge and AES-256 encryption status."
  >
    <CloudBackupSchedule />
  </Story>

  <Story
    title="High Storage Utilization"
    description="Backup scheduler showing near-capacity storage quota requiring retention adjustment."
  >
    <CloudBackupSchedule
      :storage-used-gb="92.4"
      :storage-total-gb="100"
      :retention-days="14"
      frequency="Every 6 hours"
    />
  </Story>

  <Story
    title="Manual Only Mode"
    description="Daily automation disabled with long-term retention policy for enterprise archiving."
  >
    <CloudBackupSchedule
      :initial-auto-backup="false"
      :storage-used-gb="34.8"
      :storage-total-gb="250"
      :retention-days="90"
      frequency="On demand only"
    />
  </Story>
</template>
