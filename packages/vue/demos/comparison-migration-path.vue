<script setup lang="ts">
import ComparisonMigrationPath from '@/components/blocks/comparison-migration-path/ComparisonMigrationPath.vue'
// ComparisonMigrationPath is the block file the user installs. Open\n// `components/blocks/ComparisonMigrationPath.vue` after install to edit the\n// `rows` array for the tool you are actually replacing.
</script>

<template>
  <Story
    title="Comparison — Migration Path"
    description="What a team keeps, changes, and retires when migrating from an existing tool, with an effort estimate on every row."
  >
    <ComparisonMigrationPath />
  </Story>
</template>
