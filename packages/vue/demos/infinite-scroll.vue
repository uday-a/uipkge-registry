<script setup lang="ts">
import { ref } from "vue";
import { Loader2 } from "lucide-vue-next";
import { InfiniteScroll } from "@/components/ui/infinite-scroll";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FeedItem {
  id: number;
  title: string;
  author: string;
  time: string;
}

const titles = [
  "Shipping rate cards v2",
  "New onboarding flow is live",
  "Q3 retention deep-dive",
  "Design system tokens audit",
  "Customer feedback summary",
  "Pricing experiment results",
  "Mobile app crash report",
  "Hiring pipeline update",
];
const authors = [
  "Sarah Chen",
  "Marcus Webb",
  "Priya Patel",
  "Tom Garcia",
  "Lisa Wong",
];

function makePage(n: number): FeedItem[] {
  return Array.from({ length: 6 }, (_, i) => {
    const id = (n - 1) * 6 + i + 1;
    return {
      id,
      title: titles[(id - 1) % titles.length],
      author: authors[(id - 1) % authors.length],
      time: `${2 + ((id * 7) % 50)} min ago`,
    };
  });
}

const items = ref<FeedItem[]>(makePage(1));
const loading = ref(false);
const hasMore = ref(true);
const page = ref(1);

async function load() {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  await new Promise((r) => setTimeout(r, 800));
  page.value += 1;
  items.value.push(...makePage(page.value));
  if (page.value >= 5) hasMore.value = false;
  loading.value = false;
}

function reset() {
  page.value = 1;
  items.value = makePage(1);
  hasMore.value = true;
  loading.value = false;
}

// Reverse-mode chat demo
interface ChatMsg {
  id: number;
  author: string;
  text: string;
}
const messages = ref<ChatMsg[]>(
  Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    author: i % 2 === 0 ? "You" : "Maya",
    text: [
      "Hey, did you see the new deploy?",
      "Yeah, looks great!",
      "Pushing the fix now",
      "LGTM 👍",
    ][i % 4],
  })),
);
const reverseLoading = ref(false);
const reverseHasMore = ref(true);
let reverseCount = 8;

async function loadReverse() {
  if (reverseLoading.value || !reverseHasMore.value) return;
  reverseLoading.value = true;
  await new Promise((r) => setTimeout(r, 800));
  const next = Array.from({ length: 4 }, (_, i) => ({
    id: reverseCount + i + 1,
    author: (reverseCount + i) % 2 === 0 ? "You" : "Maya",
    text: ["Older message", "From earlier today", "Re: the deploy", "Got it"][
      i % 4
    ],
  }));
  reverseCount += 4;
  messages.value.unshift(...next);
  if (reverseCount >= 20) reverseHasMore.value = false;
  reverseLoading.value = false;
}
</script>

<template>
  <Story
    title="Activity feed"
    description="A realistic notification feed that loads more pages as you scroll the page downward."
  >
    <div class="w-full max-w-md">
      <div
        v-for="item in items"
        :key="item.id"
        class="border-border/60 flex items-start justify-between gap-3 border-b px-4 py-3"
      >
        <div class="space-y-0.5">
          <p class="text-sm font-medium">{{ item.title }}</p>
          <p class="text-muted-foreground text-xs">
            {{ item.author }} · {{ item.time }}
          </p>
        </div>
        <span
          class="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs tabular-nums"
          >#{{ item.id }}</span
        >
      </div>
      <InfiniteScroll
        :has-more="hasMore"
        :loading="loading"
        :distance="200"
        @load="load"
      />
      <Button
        v-if="!hasMore"
        size="sm"
        variant="ghost"
        class="mt-2"
        @click="reset"
        >Reset feed</Button
      >
    </div>
  </Story>

  <Story
    title="Custom loading & end slots"
    description="Replace the default spinner with branded text, and show a custom end message when data runs out."
  >
    <div class="w-full max-w-md">
      <div
        v-for="item in items"
        :key="`c-${item.id}`"
        class="border-border/60 flex items-start justify-between gap-3 border-b px-4 py-3"
      >
        <div class="space-y-0.5">
          <p class="text-sm font-medium">{{ item.title }}</p>
          <p class="text-muted-foreground text-xs">{{ item.author }}</p>
        </div>
      </div>
      <InfiniteScroll
        :has-more="hasMore"
        :loading="loading"
        :distance="200"
        @load="load"
      >
        <template #loading>
          <div
            class="text-primary flex w-full items-center justify-center gap-2 py-3 text-xs"
          >
            <Loader2 class="size-4 animate-spin" /> Fetching more…
          </div>
        </template>
        <template #end>
          <div class="text-muted-foreground w-full py-3 text-center text-xs">
            🎉 You're all caught up
          </div>
        </template>
      </InfiniteScroll>
    </div>
  </Story>

  <Story
    title="Chat timeline (reverse)"
    description="Sentinel at the top; new older messages prepend — the pattern for chat apps loading history upward."
  >
    <div
      class="border-border/60 max-h-80 w-full max-w-md overflow-y-auto rounded-md border"
    >
      <InfiniteScroll
        :has-more="reverseHasMore"
        :loading="reverseLoading"
        :distance="50"
        reverse
        @load="loadReverse"
      >
        <div
          v-for="msg in messages"
          :key="`r-${msg.id}`"
          class="border-border/60 flex gap-2 border-b px-4 py-2.5 text-sm"
        >
          <span class="text-muted-foreground w-12 shrink-0 text-xs">{{
            msg.author
          }}</span>
          <span>{{ msg.text }}</span>
        </div>
      </InfiniteScroll>
    </div>
  </Story>

  <Story
    title="Scrollable container target"
    description="scrollTarget pins the listener to a specific element instead of the window — useful for panels and drawers."
  >
    <div
      id="inf-scroll-box"
      class="border-border/60 max-h-64 w-full max-w-md overflow-y-auto rounded-md border"
    >
      <div
        v-for="item in items"
        :key="`el-${item.id}`"
        class="border-border/60 flex items-start justify-between gap-3 border-b px-4 py-3"
      >
        <div class="space-y-0.5">
          <p class="text-sm font-medium">{{ item.title }}</p>
          <p class="text-muted-foreground text-xs">{{ item.author }}</p>
        </div>
      </div>
      <InfiniteScroll
        :has-more="hasMore"
        :loading="loading"
        :distance="50"
        scroll-target="#inf-scroll-box"
        @load="load"
      />
    </div>
  </Story>

  <Story
    title="In a card"
    description="Infinite scroll embedded in a card with a header — the pattern for dashboards and activity panels."
  >
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Updates from your team this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          v-for="item in items"
          :key="`card-${item.id}`"
          class="border-border/60 flex items-start justify-between gap-3 border-b py-2.5 last:border-0"
        >
          <div class="space-y-0.5">
            <p class="text-sm font-medium">{{ item.title }}</p>
            <p class="text-muted-foreground text-xs">
              {{ item.author }} · {{ item.time }}
            </p>
          </div>
        </div>
        <InfiniteScroll
          :has-more="hasMore"
          :loading="loading"
          :distance="100"
          @load="load"
        />
      </CardContent>
    </Card>
  </Story>
</template>
