<script setup lang="ts">
import { Transfer } from "@/components/ui/transfer";
import { ref } from "vue";
import type { TransferItem } from "@/components/ui/transfer";

const data: TransferItem[] = Array.from({ length: 15 }, (_, i) => ({
  key: `k-${i + 1}`,
  label: `Item ${i + 1}`,
  description: i % 3 === 0 ? `Group A` : `Group B`,
  disabled: i === 2,
}));

const big: TransferItem[] = Array.from({ length: 200 }, (_, i) => ({
  key: `big-${i}`,
  label: `Record ${i + 1}`,
}));

const target1 = ref<string[]>([]);
const target2 = ref<string[]>(["k-5", "k-7"]);
const target3 = ref<string[]>([]);
const target4 = ref<string[]>([]);
const target5 = ref<string[]>([]);
const target6 = ref<string[]>(["k-1", "k-4", "k-6"]);
const target7 = ref<string[]>([]);
</script>

<template>
  <Story
    title="Basic"
    description="Pick from the source, click the right arrow to move."
  >
    <Transfer v-model:target-keys="target1" :data-source="data" />
  </Story>

  <Story
    title="With search"
    description="Search input filters each side independently."
  >
    <Transfer v-model:target-keys="target2" :data-source="data" show-search />
  </Story>

  <Story
    title="With pagination"
    description="pagination=true uses page size 10. Pass {pageSize} to override."
  >
    <Transfer
      v-model:target-keys="target3"
      :data-source="big"
      :pagination="{ pageSize: 8 }"
      show-search
    />
  </Story>

  <Story title="One-way" description="oneWay hides the right-to-left button.">
    <Transfer v-model:target-keys="target4" :data-source="data" one-way />
  </Story>

  <Story
    title="Drag and drop"
    description="draggable enables HTML5 drag between lists and reordering inside the target. Drag a selected row to drag the whole selection."
  >
    <Transfer
      v-model:target-keys="target6"
      :data-source="data"
      draggable
      show-search
    />
  </Story>

  <Story
    title="Selectable=false (no checkboxes)"
    description="Hides checkboxes; row click uses desktop pattern — plain=replace, cmd/ctrl+click=toggle, shift+click=range. Combine with draggable for pure drag UX."
  >
    <Transfer
      v-model:target-keys="target7"
      :data-source="data"
      :selectable="false"
      draggable
    />
  </Story>

  <Story
    title="Custom titles + footer"
    description="titles prop labels each side; footer slots add per-side actions."
  >
    <Transfer
      v-model:target-keys="target5"
      :data-source="data"
      :titles="['Available', 'Selected']"
    >
      <template #footer-left>
        <span class="text-muted-foreground text-xs"
          >Tip: enable `draggable` for DnD.</span
        >
      </template>
    </Transfer>
  </Story>
</template>
