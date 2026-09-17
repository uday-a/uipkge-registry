<script setup lang="ts">
import FileManager from '@/components/blocks/file-manager/FileManager.vue'
</script>

<template>
  <Story
    title="Grid"
    description="Default grid view: breadcrumb path, search, view toggle, upload action, storage meter, and amber-tinted folder tiles beside file tiles."
  >
    <FileManager />
  </Story>

  <Story
    title="List"
    description="List variant via the variant prop: table-like rows with icon, name, size, modified, and a kebab menu per row. The toggle still switches views live."
  >
    <FileManager variant="list" />
  </Story>
</template>
