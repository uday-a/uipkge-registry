<script setup lang="ts">
import FormLayouts from '@/components/blocks/form-layouts/FormLayouts.vue'
</script>

<template>
  <Story title="Default" description="Full create-project form with slug preview, char counter and sticky footer.">
    <FormLayouts />
  </Story>

  <Story title="Compact" description="The same form constrained to a narrow column.">
    <div class="max-w-sm">
      <FormLayouts />
    </div>
  </Story>
</template>
