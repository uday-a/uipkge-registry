<script setup lang="ts">
import ImportWizard from '@/components/blocks/import-wizard/ImportWizard.vue'
</script>

<template>
  <Story title="Upload" description="Empty dropzone — click it to simulate selecting a parsed file.">
    <ImportWizard />
  </Story>

  <Story title="File selected" description="Post-parse summary card with row/column counts and a Parsed badge.">
    <ImportWizard :initial-step="1" initial-file-selected />
  </Story>

  <Story title="Mapping auto-filled" description="Columns auto-guessed with confidence badges; manager column skipped.">
    <ImportWizard :initial-step="2" />
  </Story>

  <Story title="Unmapped required" description="Email left unmapped — warning alert appears and Review is disabled.">
    <ImportWizard
      :initial-step="2"
      :initial-mapping="{
        full_name: 'Full name',
        email_address: 'Skip',
        dept: 'Department',
        job_title: 'Job title',
        start_date: 'Start date',
        manager: 'Skip',
      }"
    />
  </Story>

  <Story title="Preview clean" description="First five rows rendered through the mapped fields — nothing flagged.">
    <ImportWizard :initial-step="3" />
  </Story>

  <Story title="Preview with flags" description="Missing name and malformed email highlight destructively in place.">
    <ImportWizard
      :initial-step="3"
      :initial-mapping="{
        full_name: 'Full name',
        email_address: 'Email',
        dept: 'Department',
        job_title: 'Job title',
        start_date: 'Skip',
        manager: 'Skip',
      }"
    />
  </Story>

  <Story title="Result success" description="All rows committed; reset affordance returns to step one.">
    <ImportWizard :initial-step="4" />
  </Story>

  <Story title="Wide dataset" description="Six mapped columns force horizontal scroll inside narrow containers.">
    <div class="max-w-md">
      <ImportWizard :initial-step="3" />
    </div>
  </Story>

  <Story title="Compact" description="The same flow at phone-card width.">
    <div class="max-w-sm">
      <ImportWizard :initial-step="2" />
    </div>
  </Story>
</template>
