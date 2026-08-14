<script setup lang="ts">
import DatabaseMigrationSchemaDiff from '@/components/blocks/database-migration-schema-diff/DatabaseMigrationSchemaDiff.vue'
</script>

<template>
  <Story
    title="Default"
    description="Prisma / Flyway / Liquibase database migration runner with target cluster status, pending DDL visual diffs, rollback scripts, schema integrity telemetry, and execution history."
  >
    <DatabaseMigrationSchemaDiff />
  </Story>
</template>
