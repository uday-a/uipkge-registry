<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { VirtualList } from "@/components/ui/virtual-list";
import { ref } from "vue";

const fixed = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Row ${i + 1}`,
}));

const dynamic = Array.from({ length: 5000 }, (_, i) => {
  const size = 32 + (i % 7) * 12;
  return { id: i, name: `Row ${i + 1} (h=${size})`, size };
});

const horizontal = Array.from({ length: 2000 }, (_, i) => ({
  id: i,
  name: `Col ${i + 1}`,
}));

const listRef = ref<{
  scrollToIndex: (
    i: number,
    opts?: { align?: "start" | "center" | "end" },
  ) => void;
} | null>(null);

function jumpTo(i: number) {
  listRef.value?.scrollToIndex(i, { align: "center" });
}
</script>

<template>
  <Story
    title="Fixed size, 10k rows"
    description="Each row is exactly 40px tall. Renders only the visible window plus overscan."
  >
    <VirtualList
      :items="fixed"
      :item-size="40"
      :height="400"
      class="rounded-md border"
    >
      <template #default="{ item }">
        <div class="flex h-10 items-center border-b px-4 text-sm">
          {{ item.name }}
        </div>
      </template>
    </VirtualList>
  </Story>

  <Story
    title="Dynamic size"
    description="itemSize as a function returns per-item heights from the data."
  >
    <VirtualList
      :items="dynamic"
      :item-size="(item) => item.size"
      :height="400"
      class="rounded-md border"
    >
      <template #default="{ item }">
        <div
          class="flex items-center border-b px-4 text-sm"
          :style="{ height: item.size + 'px' }"
        >
          {{ item.name }}
        </div>
      </template>
    </VirtualList>
  </Story>

  <Story
    title="Imperative scrollToIndex"
    description="Use a template ref to jump to any index, with align options."
  >
    <div class="space-y-2">
      <div class="flex gap-2">
        <Button size="sm" @click="jumpTo(0)">Top</Button>
        <Button size="sm" @click="jumpTo(2500)">2500</Button>
        <Button size="sm" @click="jumpTo(7500)">7500</Button>
        <Button size="sm" @click="jumpTo(9999)">End</Button>
      </div>
      <VirtualList
        ref="listRef"
        :items="fixed"
        :item-size="32"
        :height="320"
        class="rounded-md border"
      >
        <template #default="{ item, index }">
          <div class="flex h-8 items-center border-b px-4 text-xs">
            <span class="text-muted-foreground w-12">{{ index }}</span>
            {{ item.name }}
          </div>
        </template>
      </VirtualList>
    </div>
  </Story>

  <Story
    title="Horizontal"
    description="direction='horizontal' switches to a horizontal viewport."
  >
    <VirtualList
      :items="horizontal"
      :item-size="80"
      :height="120"
      direction="horizontal"
      class="rounded-md border"
    >
      <template #default="{ item }">
        <div
          class="flex h-full w-20 items-center justify-center border-r text-xs"
        >
          {{ item.name }}
        </div>
      </template>
    </VirtualList>
  </Story>
</template>
