<script setup lang="ts">
import {
  ChevronRight,
  Loader2,
  Mail,
  Plus,
  Trash2,
  ChevronDown,
  Copy,
  Share2,
  Download,
} from "lucide-vue-next";
import { Button, ButtonGroup } from "@/components/ui/button";
</script>

<template>
  <Story
    title="Variants"
    description="Six visual styles. Default is the primary action; ghost and link blend into surrounding text."
  >
    <div class="flex flex-wrap gap-2">
      <Button>Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  </Story>

  <Story title="Sizes" description="Four text sizes for inline buttons.">
    <div class="flex flex-wrap items-center gap-2">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
    </div>
  </Story>

  <Story
    title="Icon-only"
    description="Square icon buttons in three sizes. Use aria-label for accessibility."
  >
    <div class="flex flex-wrap items-center gap-2">
      <Button size="icon-sm" aria-label="icon"><Mail /></Button>
      <Button size="icon" aria-label="icon"><Mail /></Button>
      <Button size="icon-lg" aria-label="icon"><Mail /></Button>
    </div>
  </Story>

  <Story
    title="With icon"
    description="Place icons before or after the label. Auto-spaced."
  >
    <div class="flex flex-wrap gap-2">
      <Button><Mail /> Email me</Button>
      <Button>Continue <ChevronRight /></Button>
      <Button variant="outline"><Plus /> New item</Button>
      <Button variant="destructive"><Trash2 /> Delete</Button>
    </div>
  </Story>

  <Story
    title="States"
    description="Disabled keeps the variant style. Add a spinner for loading."
  >
    <div class="flex flex-wrap gap-2">
      <Button disabled>Disabled</Button>
      <Button variant="outline" disabled>Outline disabled</Button>
      <Button disabled><Loader2 class="animate-spin" /> Loading…</Button>
    </div>
  </Story>

  <Story
    title="Button Group & Split Buttons"
    description="Segmented toolbars and split action buttons with shared borders."
  >
    <div class="flex flex-wrap items-center gap-4">
      <ButtonGroup>
        <Button variant="outline" size="sm">Years</Button>
        <Button variant="outline" size="sm">Months</Button>
        <Button variant="outline" size="sm">Days</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="default" size="sm">Save changes</Button>
        <Button variant="default" size="icon-sm" aria-label="More options">
          <ChevronDown class="size-3.5" />
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="secondary" size="xs"
          ><Copy class="size-3" /> Copy</Button
        >
        <Button variant="secondary" size="xs"
          ><Share2 class="size-3" /> Share</Button
        >
        <Button variant="secondary" size="xs"
          ><Download class="size-3" /> Export</Button
        >
      </ButtonGroup>
    </div>
  </Story>
</template>
