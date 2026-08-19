<script setup lang="ts">
import { OverlayScroll } from "@/components/ui/overlay-scroll";
import { onUnmounted, ref } from "vue";
import { Button } from "@/components/ui/button";

const messages = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  author: ["Sarah", "Marcus", "Priya", "Diego", "Yuki", "Aditya"][i % 6],
  text: [
    "Pushed the migration. Logs look clean on staging.",
    "Bumping this — anyone reviewing the auth PR?",
    "Standup notes from yesterday are in the doc.",
    "Mobile build green. Cutting RC1 now.",
    "Q3 OKR draft ready for feedback.",
    "Fixed the off-by-one. New build deploying.",
    "Anyone seeing slowdowns on /dashboard? Looking into it.",
    "Closed P-1342. Was a Redis cache miss.",
  ][i % 8],
  time: `${(i * 7) % 60}m`,
}));

const files = Array.from({ length: 18 }, (_, i) => ({
  name: [
    "src/auth/middleware.ts",
    "src/db/migrations/0042.sql",
    "app/routes/dashboard.vue",
    "lib/utils.ts",
    "tests/auth.spec.ts",
  ][i % 5],
  status: ["M", "A", "D", "M", "M"][i % 5],
}));

const navItems = [
  "Inbox",
  "Sent",
  "Drafts",
  "Spam",
  "Trash",
  "All Mail",
  "Important",
  "Starred",
  "Snoozed",
  "Scheduled",
  "Outbox",
  "Categories",
  "Social",
  "Updates",
  "Forums",
  "Promotions",
  "Archive",
  "Templates",
  "Tasks",
  "Notes",
  "Calendar",
  "Contacts",
];

const externalRef = ref<{ scrollerEl: HTMLElement | null } | null>(null);
function scrollToBottom() {
  const el = externalRef.value?.scrollerEl;
  if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
}
function scrollToTop() {
  const el = externalRef.value?.scrollerEl;
  if (el) el.scrollTo({ top: 0, behavior: "smooth" });
}

// Dynamic-growth demo. Starts with 20 rows. Manual button appends 20
// more; auto-grow appends 1 row every 250ms. The thumb shrinks as the
// content grows (ResizeObserver + MutationObserver inside OverlayScroll
// pick up both the inner-element resize and the DOM insertions).
const dynamicRows = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i,
    title: `Row ${i + 1}`,
    detail: ["queued", "in-flight", "done", "retrying"][i % 4],
  })),
);
function appendRows(n = 20) {
  const start = dynamicRows.value.length;
  for (let i = 0; i < n; i++) {
    dynamicRows.value.push({
      id: start + i,
      title: `Row ${start + i + 1}`,
      detail: ["queued", "in-flight", "done", "retrying"][(start + i) % 4],
    });
  }
}
const autoGrow = ref(false);
let autoTimer: ReturnType<typeof setInterval> | null = null;
function toggleAutoGrow() {
  autoGrow.value = !autoGrow.value;
  if (autoGrow.value) {
    autoTimer = setInterval(() => {
      if (dynamicRows.value.length >= 500) {
        autoGrow.value = false;
        if (autoTimer) clearInterval(autoTimer);
        return;
      }
      appendRows(1);
    }, 250);
  } else if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}
onUnmounted(() => {
  if (autoTimer) clearInterval(autoTimer);
});
</script>

<template>
  <Story
    title="Default"
    description="No reserved gutter — content uses the full container width. Thumb fades in on scroll or hover and fades out after 800ms of inactivity. Drag the thumb to scroll."
  >
    <div class="bg-card h-[340px] w-full max-w-md rounded-lg border">
      <OverlayScroll class="h-full p-4">
        <div class="space-y-3">
          <div v-for="m in messages" :key="m.id" class="flex gap-3">
            <div
              class="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            >
              {{ m.author[0] }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-baseline gap-2">
                <span class="text-sm font-medium">{{ m.author }}</span>
                <span class="text-muted-foreground text-xs">{{ m.time }}</span>
              </div>
              <p class="text-foreground/90 text-sm">{{ m.text }}</p>
            </div>
          </div>
        </div>
      </OverlayScroll>
    </div>
  </Story>

  <Story
    title="Sidebar nav"
    description="Long vertical list inside a fixed-height nav. The thumb sits at the inner edge — useful when the content extends edge-to-edge and a reserved gutter would push items inward."
  >
    <div class="bg-card h-[300px] w-56 rounded-lg border">
      <OverlayScroll class="h-full">
        <ul class="p-2">
          <li v-for="item in navItems" :key="item">
            <a class="hover:bg-accent block rounded-md px-3 py-1.5 text-sm">{{
              item
            }}</a>
          </li>
        </ul>
      </OverlayScroll>
    </div>
  </Story>

  <Story
    title="Compact file list"
    description="`:thumb-width` / `:thumb-offset` shrink the thumb for dense surfaces. Status pill on the left, monospace path on the right."
  >
    <div class="bg-card h-[260px] w-full max-w-lg rounded-lg border">
      <OverlayScroll :thumb-width="3" :thumb-offset="1" class="h-full">
        <ul class="divide-y">
          <li
            v-for="(f, i) in files"
            :key="i"
            class="flex items-center gap-3 px-3 py-2 text-sm"
          >
            <span
              class="inline-flex size-5 items-center justify-center rounded font-mono text-xs font-semibold"
              :class="{
                'bg-blue-500/15 text-blue-600 dark:text-blue-400':
                  f.status === 'M',
                'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400':
                  f.status === 'A',
                'bg-red-500/15 text-red-600 dark:text-red-400':
                  f.status === 'D',
              }"
              >{{ f.status }}</span
            >
            <code class="text-foreground/90 truncate font-mono text-xs">{{
              f.name
            }}</code>
          </li>
        </ul>
      </OverlayScroll>
    </div>
  </Story>

  <Story
    title="Programmatic scroll"
    description="The component exposes its scroller element via `defineExpose` — bind a ref and call `.scrollTo()` to drive scroll from outside."
  >
    <div class="space-y-3">
      <div class="flex gap-2">
        <Button size="sm" variant="outline" @click="scrollToTop"
          >Scroll to top</Button
        >
        <Button size="sm" variant="outline" @click="scrollToBottom"
          >Scroll to bottom</Button
        >
      </div>
      <div class="bg-card h-[240px] w-full max-w-md rounded-lg border">
        <OverlayScroll ref="externalRef" class="h-full p-4">
          <p v-for="i in 30" :key="i" class="text-foreground/90 mb-3 text-sm">
            Paragraph {{ i }}. The parent controls scroll position via the
            exposed `scrollerEl`.
          </p>
        </OverlayScroll>
      </div>
    </div>
  </Story>

  <Story
    title="Dynamic growth (infinite scroll)"
    description="Rows append at runtime. The thumb shrinks and re-positions automatically because OverlayScroll wires a `ResizeObserver` on the inner element and a `MutationObserver` (`childList: true, subtree: true`) on the same node — so any DOM insertion or height change triggers thumb recalculation. Note: the registry's `virtual-list` primitive ships its own scroll container, so wrapping it in OverlayScroll would nest two scrollers. For windowed lists, use `virtual-list` directly; reach for OverlayScroll when you want overlay-style scrolling on real, dynamically-appended DOM."
  >
    <div class="space-y-3">
      <div class="flex items-center gap-2">
        <Button size="sm" variant="outline" @click="appendRows(20)"
          >+20 rows</Button
        >
        <Button
          size="sm"
          :variant="autoGrow ? 'default' : 'outline'"
          @click="toggleAutoGrow"
        >
          {{ autoGrow ? "Stop auto-grow" : "Start auto-grow" }}
        </Button>
        <span class="text-muted-foreground text-xs"
          >{{ dynamicRows.length }} rows</span
        >
      </div>
      <div class="bg-card h-[280px] w-full max-w-lg rounded-lg border">
        <OverlayScroll class="h-full">
          <ul class="divide-y">
            <li
              v-for="row in dynamicRows"
              :key="row.id"
              class="flex items-center justify-between px-3 py-2 text-sm"
            >
              <span>{{ row.title }}</span>
              <span
                class="rounded px-2 py-0.5 font-mono text-xs font-semibold"
                :class="{
                  'bg-amber-500/15 text-amber-600 dark:text-amber-400':
                    row.detail === 'queued',
                  'bg-blue-500/15 text-blue-600 dark:text-blue-400':
                    row.detail === 'in-flight',
                  'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400':
                    row.detail === 'done',
                  'bg-red-500/15 text-red-600 dark:text-red-400':
                    row.detail === 'retrying',
                }"
                >{{ row.detail }}</span
              >
            </li>
          </ul>
        </OverlayScroll>
      </div>
    </div>
  </Story>

  <Story
    title="Non-draggable thumb"
    description='Pass `:draggable="false"` to turn the thumb into a pure indicator. Wheel and trackpad still scroll; the user just can&apos;t drag the thumb itself.'
  >
    <div class="bg-card h-[220px] w-full max-w-md rounded-lg border">
      <OverlayScroll :draggable="false" class="h-full p-4">
        <p v-for="i in 24" :key="i" class="text-foreground/90 mb-3 text-sm">
          Line {{ i }} — thumb shown but not draggable.
        </p>
      </OverlayScroll>
    </div>
  </Story>
</template>
