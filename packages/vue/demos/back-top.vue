<script setup lang="ts">
import { ref } from "vue";
import { ArrowUp, ChevronUp } from "lucide-vue-next";
import { BackTop } from "@/components/ui/back-top";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const feed = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: `Release notes v0.${i + 12}.0`,
  excerpt:
    "Bug fixes, performance improvements, and a few new primitives shipped this week.",
}));
const visibleLog = ref<string[]>([]);

function onVisible(v: boolean) {
  visibleLog.value.unshift(
    `${v ? "shown" : "hidden"} at ${new Date().toLocaleTimeString()}`,
  );
  if (visibleLog.value.length > 3) visibleLog.value.pop();
}
</script>

<template>
  <Story
    title="In a long article"
    description="A realistic reading surface — scroll the card and the button fades in at the bottom-right once you pass the threshold."
  >
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Changelog</CardTitle>
        <CardDescription
          >Scroll the list below to reveal the back-to-top
          button.</CardDescription
        >
      </CardHeader>
      <CardContent>
        <div
          class="back-top-feed border-border relative max-h-64 space-y-2 overflow-y-auto rounded-md border p-3"
        >
          <div
            v-for="item in feed"
            :key="item.id"
            class="bg-muted/40 rounded-md p-3"
          >
            <p class="text-sm font-medium">{{ item.title }}</p>
            <p class="text-muted-foreground mt-1 text-xs">{{ item.excerpt }}</p>
          </div>
          <BackTop
            target=".back-top-feed"
            :offset="8"
            :threshold="40"
            position="bottom-right"
            absolute
          />
        </div>
      </CardContent>
    </Card>
  </Story>

  <Story
    title="Page-level (live)"
    description="One live instance bound to the window. Scroll the whole page down past 200px and the button appears in the corner."
  >
    <p class="text-muted-foreground max-w-md text-sm">
      Scroll the page itself to reveal the floating button. It smooth-scrolls
      back to the top on click.
    </p>
    <BackTop
      :threshold="200"
      :offset="24"
      position="bottom-right"
      @visible="onVisible"
    />
  </Story>

  <Story
    title="Visibility events"
    description="The @visible event fires whenever the button toggles. Scroll the page above to populate the log."
  >
    <div class="max-w-md space-y-1 text-xs">
      <p
        v-for="log in visibleLog"
        :key="log"
        class="text-muted-foreground tabular-nums"
      >
        {{ log }}
      </p>
      <p v-if="!visibleLog.length" class="text-muted-foreground">
        Scroll the page to fire @visible events.
      </p>
    </div>
  </Story>

  <Story
    title="Size variants"
    description="sm, default, and lg shown in matched containers so the relative scale reads at a glance."
  >
    <div class="flex items-end gap-4">
      <div
        class="border-border relative flex h-24 w-24 items-end justify-center rounded-md border"
      >
        <BackTop size="sm" :threshold="0" absolute :offset="4" />
        <span class="text-muted-foreground mb-1 text-xs">sm</span>
      </div>
      <div
        class="border-border relative flex h-24 w-24 items-end justify-center rounded-md border"
      >
        <BackTop size="default" :threshold="0" absolute :offset="4" />
        <span class="text-muted-foreground mb-1 text-xs">default</span>
      </div>
      <div
        class="border-border relative flex h-24 w-24 items-end justify-center rounded-md border"
      >
        <BackTop size="lg" :threshold="0" absolute :offset="4" />
        <span class="text-muted-foreground mb-1 text-xs">lg</span>
      </div>
    </div>
  </Story>

  <Story
    title="Custom icon"
    description="Override the default arrow via the #icon slot — useful when the action is 'jump to section' rather than 'to top'."
  >
    <div class="flex items-end gap-4">
      <div
        class="border-border relative flex h-24 w-24 items-end justify-center rounded-md border"
      >
        <BackTop :threshold="0" absolute :offset="4">
          <template #icon><ChevronUp /></template>
        </BackTop>
        <span class="text-muted-foreground mb-1 text-xs">ChevronUp</span>
      </div>
      <div
        class="border-border relative flex h-24 w-24 items-end justify-center rounded-md border"
      >
        <BackTop :threshold="0" absolute :offset="4">
          <template #icon><ArrowUp class="size-5" /></template>
        </BackTop>
        <span class="text-muted-foreground mb-1 text-xs">ArrowUp</span>
      </div>
    </div>
  </Story>

  <Story
    title="Edge anchors"
    description="Four corner positions for the floating button. Each preview box is a positioned container."
  >
    <div class="grid max-w-md grid-cols-2 gap-4">
      <div class="border-border relative h-28 rounded-md border p-3">
        <span class="text-muted-foreground text-xs">bottom-right</span>
        <BackTop :threshold="0" position="bottom-right" :offset="8" absolute />
      </div>
      <div class="border-border relative h-28 rounded-md border p-3">
        <span class="text-muted-foreground text-xs">bottom-left</span>
        <BackTop :threshold="0" position="bottom-left" :offset="8" absolute />
      </div>
      <div class="border-border relative h-28 rounded-md border p-3">
        <span class="text-muted-foreground text-xs">top-right</span>
        <BackTop :threshold="0" position="top-right" :offset="8" absolute />
      </div>
      <div class="border-border relative h-28 rounded-md border p-3">
        <span class="text-muted-foreground text-xs">top-left</span>
        <BackTop :threshold="0" position="top-left" :offset="8" absolute />
      </div>
    </div>
  </Story>

  <Story
    title="Threshold & behavior"
    description="threshold controls when the button appears (default 200px); behavior switches between smooth and instant scroll."
  >
    <p class="text-muted-foreground max-w-md text-sm">
      Use a higher <code class="text-foreground">threshold</code> like 600px to
      delay visibility until the user has scrolled significantly. Set
      <code class="text-foreground">behavior="auto"</code> for an instant jump
      instead of the default animated scroll.
    </p>
  </Story>
</template>
