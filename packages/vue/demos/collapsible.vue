<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Plus, Minus } from "lucide-vue-next";

const open = ref(true);
</script>

<template>
  <Story
    title="Controlled"
    description="Two-way bound open state with the current value rendered alongside."
  >
    <div class="space-y-3">
      <Collapsible v-model:open="open" class="max-w-md">
        <div
          class="flex items-center justify-between gap-3 rounded-md border px-4 py-2"
        >
          <h4 class="text-sm font-medium">@uipkge starred 3 repositories</h4>
          <CollapsibleTrigger as-child>
            <Button variant="ghost" size="icon-sm">
              <ChevronsUpDown class="size-4" aria-hidden="true" />
              <span class="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div class="mt-1 rounded-md border px-4 py-2 font-mono text-sm">
          @radix-ui/primitives
        </div>
        <CollapsibleContent class="mt-1 space-y-1">
          <div class="rounded-md border px-4 py-2 font-mono text-sm">
            @stitches/react
          </div>
          <div class="rounded-md border px-4 py-2 font-mono text-sm">
            @vueuse/core
          </div>
        </CollapsibleContent>
      </Collapsible>
      <p class="text-muted-foreground text-xs">
        Open: <code class="text-foreground">{{ open }}</code>
      </p>
    </div>
  </Story>

  <Story
    title="Uncontrolled"
    description="defaultOpen sets the initial state — the component manages it internally."
  >
    <Collapsible default-open class="max-w-md">
      <div
        class="flex items-center justify-between gap-3 rounded-md border px-4 py-2"
      >
        <h4 class="text-sm font-medium">Today's reminders</h4>
        <CollapsibleTrigger as-child>
          <Button variant="ghost" size="icon-sm">
            <ChevronsUpDown class="size-4" aria-hidden="true" />
            <span class="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent class="mt-1 space-y-1">
        <div class="rounded-md border px-4 py-2 text-sm">Stand-up at 10:00</div>
        <div class="rounded-md border px-4 py-2 text-sm">
          Design review at 14:30
        </div>
        <div class="rounded-md border px-4 py-2 text-sm">Submit timesheet</div>
      </CollapsibleContent>
    </Collapsible>
  </Story>

  <Story
    title="Button trigger"
    description="Using asChild lets the trigger forward props onto a custom Button."
  >
    <Collapsible v-slot="{ open: isOpen }" class="max-w-md">
      <CollapsibleTrigger as-child>
        <Button variant="outline" size="sm">
          <component
            :is="isOpen ? Minus : Plus"
            class="size-4"
            aria-hidden="true"
          />
          {{ isOpen ? "Hide details" : "Show details" }}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent class="mt-2 rounded-md border px-4 py-3 text-sm">
        <p class="font-medium">Order #18412</p>
        <p class="text-muted-foreground mt-1">
          Shipped via UPS Ground · Estimated delivery May 12.
        </p>
      </CollapsibleContent>
    </Collapsible>
  </Story>

  <Story
    title="Long content"
    description="Wraps a larger block of nested rows that toggle as one unit."
  >
    <Collapsible default-open class="max-w-md">
      <div
        class="flex items-center justify-between gap-3 rounded-md border px-4 py-2"
      >
        <h4 class="text-sm font-medium">Recent commits (12)</h4>
        <CollapsibleTrigger as-child>
          <Button variant="ghost" size="icon-sm">
            <ChevronsUpDown class="size-4" aria-hidden="true" />
            <span class="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent class="mt-1 space-y-1">
        <div
          v-for="i in 8"
          :key="i"
          class="rounded-md border px-4 py-2 font-mono text-xs"
        >
          <span class="text-muted-foreground"
            >{{ "0a1b2c".slice(0, 6) }}{{ i }}</span
          >
          <span class="ml-2"
            >refactor: extract use{{
              [
                "Auth",
                "Theme",
                "Toast",
                "Form",
                "Query",
                "Cache",
                "Sidebar",
                "Modal",
              ][i - 1]
            }}
            composable</span
          >
        </div>
      </CollapsibleContent>
    </Collapsible>
  </Story>

  <Story
    title="Animated chevron rotation"
    description="The default slot exposes the open state, so the trigger icon can rotate as the content reveals. Pure CSS transition on a single class."
  >
    <Collapsible v-slot="{ open: isOpen }" class="max-w-md">
      <CollapsibleTrigger as-child>
        <Button variant="ghost" class="w-full justify-between">
          <span class="font-medium">Advanced options</span>
          <ChevronsUpDown
            :class="[
              'size-4 transition-transform duration-200',
              isOpen && 'rotate-180',
            ]"
            aria-hidden="true"
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent class="mt-2 space-y-1.5">
        <div class="rounded-md border px-4 py-2 text-sm">
          <span class="text-muted-foreground">Webhook URL</span>
          <code class="text-foreground/90 ml-2 font-mono text-xs"
            >https://api.example.com/hooks</code
          >
        </div>
        <div class="rounded-md border px-4 py-2 text-sm">
          <span class="text-muted-foreground">Retry policy</span>
          <span class="ml-2">Exponential backoff, max 5</span>
        </div>
        <div class="rounded-md border px-4 py-2 text-sm">
          <span class="text-muted-foreground">Timeout</span>
          <span class="ml-2">30s</span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </Story>
</template>
