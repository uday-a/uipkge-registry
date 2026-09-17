<script setup lang="ts">
import { ref } from "vue";
import {
  Calendar,
  Camera,
  Cloud,
  FileText,
  Folder,
  Mail,
  MessageCircle,
  Music,
  Search,
  Settings,
  Terminal,
} from "lucide-vue-next";
import { Dock, type DockItem } from "@/components/ui/dock";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const activeId = ref("finder");
const lastLaunched = ref("—");

const apps: DockItem[] = [
  {
    id: "finder",
    label: "Finder",
    icon: Folder,
    active: true,
    handler: () => (activeId.value = "finder"),
  },
  {
    id: "mail",
    label: "Mail",
    icon: Mail,
    handler: () => (activeId.value = "mail"),
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
    handler: () => (activeId.value = "calendar"),
  },
  {
    id: "notes",
    label: "Notes",
    icon: FileText,
    handler: () => (activeId.value = "notes"),
  },
  {
    id: "terminal",
    label: "Terminal",
    icon: Terminal,
    handler: () => (activeId.value = "terminal"),
  },
  {
    id: "music",
    label: "Music",
    icon: Music,
    handler: () => (activeId.value = "music"),
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    handler: () => (activeId.value = "settings"),
  },
];

const tools: DockItem[] = [
  {
    id: "search",
    label: "Search",
    icon: Search,
    handler: () => (lastLaunched.value = "Search"),
  },
  {
    id: "camera",
    label: "Camera",
    icon: Camera,
    handler: () => (lastLaunched.value = "Camera"),
  },
  {
    id: "chat",
    label: "Messages",
    icon: MessageCircle,
    handler: () => (lastLaunched.value = "Messages"),
  },
  {
    id: "cloud",
    label: "Cloud",
    icon: Cloud,
    handler: () => (lastLaunched.value = "Cloud"),
  },
];
</script>

<template>
  <Story
    title="App launcher"
    description="A desktop-style app dock with magnification on hover. Click an icon to mark it active — the indicator dot and tint track the selection."
  >
    <div
      class="flex h-56 flex-col justify-between rounded-lg bg-gradient-to-b from-sky-100 to-indigo-200 p-6 dark:from-sky-950 dark:to-indigo-950"
    >
      <p class="text-sm text-slate-700 dark:text-slate-200">
        Active app: <span class="font-medium">{{ activeId }}</span>
      </p>
      <div class="flex justify-center">
        <Dock :items="apps" />
      </div>
    </div>
  </Story>

  <Story
    title="In a desktop shell"
    description="The dock pinned to the bottom of a faux desktop wallpaper — the canonical macOS-style placement."
  >
    <div
      class="border-border/60 relative flex h-64 items-end justify-center overflow-hidden rounded-lg border bg-gradient-to-b from-zinc-800 to-zinc-950"
    >
      <div class="absolute top-4 left-4 text-sm font-medium text-white/90">
        My Desktop
      </div>
      <Dock :items="apps" class="mb-3" />
    </div>
  </Story>

  <Story
    title="Click handlers"
    description="Each item carries a handler — the panel below records the last launched tool."
  >
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Quick tools</CardTitle>
        <CardDescription>Click a dock icon to launch it.</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-muted-foreground text-sm">
          Last launched:
          <span class="text-foreground font-medium">{{ lastLaunched }}</span>
        </p>
      </CardContent>
    </Card>
    <div class="bg-muted/30 mt-4 flex items-end justify-center rounded-lg py-6">
      <Dock :items="tools" />
    </div>
  </Story>

  <Story
    title="Magnification tuning"
    description="Compact base size (36px) on the left; a dramatic 2x peak with a wider 150px falloff on the right."
  >
    <div class="grid gap-4">
      <div class="bg-muted/30 flex items-end justify-center rounded-lg py-6">
        <Dock :items="apps" :base-size="36" />
      </div>
      <div
        class="border-border/60 bg-muted/40 flex items-end justify-center rounded-lg border py-6"
      >
        <Dock :items="apps" :magnification="2" :distance="150" />
      </div>
    </div>
  </Story>

  <Story
    title="Custom styling"
    description="The dock inherits border and backdrop styling — pass a class to match a dark theme or brand surface."
  >
    <div class="flex items-end justify-center rounded-lg bg-zinc-900 py-6">
      <Dock
        :items="apps"
        class="border-zinc-700 bg-zinc-800/80 text-zinc-100"
      />
    </div>
  </Story>

  <Story
    title="Tooltips off"
    description="Hide the hover tooltip labels for a minimal, icon-only dock."
  >
    <div class="bg-muted/30 flex items-end justify-center rounded-lg py-6">
      <Dock :items="apps" :show-tooltips="false" />
    </div>
  </Story>
</template>
