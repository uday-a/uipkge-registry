<script setup lang="ts">
import { ref } from "vue";
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from "@/components/ui/pagination";
const page = ref(3);
</script>

<template>
  <Story
    title="Default"
    description="Pagination with prev/next, edge pages, ellipses, and an active page indicator."
  >
    <Pagination
      v-slot="{ page }"
      :items-per-page="10"
      :total="100"
      :sibling-count="1"
      show-edges
      :default-page="3"
    >
      <PaginationList v-slot="{ items }" class="flex items-center gap-1">
        <PaginationFirst
          class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
        />
        <PaginationPrev
          class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
        />
        <template v-for="(item, index) in items" :key="index">
          <PaginationListItem
            v-if="item.type === 'page'"
            :value="item.value"
            :class="[
              'inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium',
              item.value === page
                ? 'bg-primary text-primary-foreground border-primary'
                : 'hover:bg-accent',
            ]"
          >
            {{ item.value }}
          </PaginationListItem>
          <PaginationEllipsis
            v-else
            :index="index"
            class="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm"
          >
            …
          </PaginationEllipsis>
        </template>
        <PaginationNext
          class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
        />
        <PaginationLast
          class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
        />
      </PaginationList>
    </Pagination>
  </Story>

  <Story
    title="Compact (no siblings)"
    description="sibling-count=0 keeps only the current page between ellipses for a tighter footprint."
  >
    <Pagination
      v-slot="{ page }"
      :items-per-page="10"
      :total="200"
      :sibling-count="0"
      show-edges
      :default-page="10"
    >
      <PaginationList v-slot="{ items }" class="flex items-center gap-1">
        <PaginationPrev
          class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
        />
        <template v-for="(item, index) in items" :key="index">
          <PaginationListItem
            v-if="item.type === 'page'"
            :value="item.value"
            :class="[
              'inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium',
              item.value === page
                ? 'bg-primary text-primary-foreground border-primary'
                : 'hover:bg-accent',
            ]"
          >
            {{ item.value }}
          </PaginationListItem>
          <PaginationEllipsis
            v-else
            :index="index"
            class="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm"
          >
            …
          </PaginationEllipsis>
        </template>
        <PaginationNext
          class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
        />
      </PaginationList>
    </Pagination>
  </Story>

  <Story
    title="Without first/last edges"
    description="Drop PaginationFirst and PaginationLast when only ±1 navigation is needed."
  >
    <Pagination
      v-slot="{ page }"
      :items-per-page="10"
      :total="100"
      :sibling-count="1"
      :default-page="5"
    >
      <PaginationList v-slot="{ items }" class="flex items-center gap-1">
        <PaginationPrev
          class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
        />
        <template v-for="(item, index) in items" :key="index">
          <PaginationListItem
            v-if="item.type === 'page'"
            :value="item.value"
            :class="[
              'inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium',
              item.value === page
                ? 'bg-primary text-primary-foreground border-primary'
                : 'hover:bg-accent',
            ]"
          >
            {{ item.value }}
          </PaginationListItem>
          <PaginationEllipsis
            v-else
            :index="index"
            class="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm"
          >
            …
          </PaginationEllipsis>
        </template>
        <PaginationNext
          class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
        />
      </PaginationList>
    </Pagination>
  </Story>

  <Story
    title="With edges (boundary 1)"
    description="show-edges keeps the first and last page visible regardless of the current selection."
  >
    <Pagination
      v-slot="{ page }"
      :items-per-page="10"
      :total="500"
      :sibling-count="1"
      show-edges
      :default-page="25"
    >
      <PaginationList
        v-slot="{ items }"
        class="flex flex-wrap items-center gap-1"
      >
        <PaginationPrev
          class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
        />
        <template v-for="(item, index) in items" :key="index">
          <PaginationListItem
            v-if="item.type === 'page'"
            :value="item.value"
            :class="[
              'inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium',
              item.value === page
                ? 'bg-primary text-primary-foreground border-primary'
                : 'hover:bg-accent',
            ]"
          >
            {{ item.value }}
          </PaginationListItem>
          <PaginationEllipsis
            v-else
            :index="index"
            class="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm"
          >
            …
          </PaginationEllipsis>
        </template>
        <PaginationNext
          class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
        />
      </PaginationList>
    </Pagination>
  </Story>

  <Story
    title="Many pages with v-model"
    description="Two-way bind v-model:page to react to page changes outside the component."
  >
    <div class="space-y-3">
      <Pagination
        v-slot="{ page: current }"
        v-model:page="page"
        :items-per-page="10"
        :total="1000"
        :sibling-count="1"
        show-edges
      >
        <PaginationList
          v-slot="{ items }"
          class="flex flex-wrap items-center gap-1"
        >
          <PaginationFirst
            class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
          />
          <PaginationPrev
            class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
          />
          <template v-for="(item, index) in items" :key="index">
            <PaginationListItem
              v-if="item.type === 'page'"
              :value="item.value"
              :class="[
                'inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium',
                item.value === current
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'hover:bg-accent',
              ]"
            >
              {{ item.value }}
            </PaginationListItem>
            <PaginationEllipsis
              v-else
              :index="index"
              class="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm"
            >
              …
            </PaginationEllipsis>
          </template>
          <PaginationNext
            class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
          />
          <PaginationLast
            class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
          />
        </PaginationList>
      </Pagination>
      <p class="text-muted-foreground text-xs">Page {{ page }} of 100</p>
    </div>
  </Story>

  <Story
    title="Disabled"
    description="Setting :disabled on Pagination greys out every control and blocks navigation."
  >
    <Pagination
      v-slot="{ page }"
      :items-per-page="10"
      :total="100"
      :sibling-count="1"
      show-edges
      :default-page="3"
      disabled
    >
      <PaginationList
        v-slot="{ items }"
        class="flex items-center gap-1 opacity-50"
      >
        <PaginationFirst
          class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
        />
        <PaginationPrev
          class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
        />
        <template v-for="(item, index) in items" :key="index">
          <PaginationListItem
            v-if="item.type === 'page'"
            :value="item.value"
            :class="[
              'inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium',
              item.value === page
                ? 'bg-primary text-primary-foreground border-primary'
                : 'hover:bg-accent',
            ]"
          >
            {{ item.value }}
          </PaginationListItem>
          <PaginationEllipsis
            v-else
            :index="index"
            class="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm"
          >
            …
          </PaginationEllipsis>
        </template>
        <PaginationNext
          class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
        />
        <PaginationLast
          class="hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-md border"
        />
      </PaginationList>
    </Pagination>
  </Story>
</template>
