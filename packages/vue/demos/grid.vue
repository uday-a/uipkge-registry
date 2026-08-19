<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
// Explicit import — without it, Vue's SFC name resolution (the demo file
// is `grid.vue`) shadows the registry component, so `<Grid>` would refer
// recursively to this very file and crash the page with a stack overflow.
import { Grid } from "@/components/ui/grid";
</script>

<template>
  <Story title="3 columns" description="Three-column grid with a small gap.">
    <Grid :cols="3" :gap="3">
      <Card v-for="i in 6" :key="i"
        ><CardContent class="p-4 text-center text-sm">{{
          i
        }}</CardContent></Card
      >
    </Grid>
  </Story>

  <Story title="4 columns" description="Four-column grid with a larger gap.">
    <Grid :cols="4" :gap="6">
      <Card v-for="i in 8" :key="i"
        ><CardContent class="p-3 text-center text-sm">{{
          i
        }}</CardContent></Card
      >
    </Grid>
  </Story>

  <Story
    title="Responsive"
    description="Pass a breakpoint map for a layout that adapts: 1 column on phones, 2 on small tablets, 4 on desktop."
  >
    <Grid :cols="{ base: 1, sm: 2, lg: 4 }" :gap="4">
      <Card v-for="i in 8" :key="i"
        ><CardContent class="p-3 text-center text-sm">{{
          i
        }}</CardContent></Card
      >
    </Grid>
  </Story>
</template>
