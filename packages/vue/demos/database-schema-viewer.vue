<script setup lang="ts">
import DatabaseSchemaViewer from '@/components/blocks/database-schema-viewer/DatabaseSchemaViewer.vue'
</script>

<template>
  <Story
    title="Default"
    description="Visual database schema inspector and SQL query previewer with table navigation, column types, relationships, indexes, and DDL code generator."
  >
    <DatabaseSchemaViewer />
  </Story>
</template>
