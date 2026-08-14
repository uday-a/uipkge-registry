<script setup lang="ts">
import CodeInstallCommand from '@/components/blocks/code-install-command/CodeInstallCommand.vue'
// CodeInstallCommand is the block file the user installs. Open
// `components/blocks/CodeInstallCommand.vue` after install to change the
// package name; each manager's command is derived from it.
</script>

<template>
  <Story
    title="Code — Install Command"
    description="Package-manager tabs over one install command, with copy, a resolved-version line, and a note on what the command writes to disk."
  >
    <CodeInstallCommand />
  </Story>
</template>
