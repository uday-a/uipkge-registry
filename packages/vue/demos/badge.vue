<script setup lang="ts">
import { Bell, Check, Clock, Inbox, Mail, X, Zap } from "lucide-vue-next";
</script>

<template>
  <Story
    title="Variants"
    description="Seven visual styles. default + secondary for neutral pills; outline for subtle chips; destructive / success / warning / info for tone."
  >
    <div class="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  </Story>

  <Story
    title="With icon"
    description="Combine with lucide icons for status pills."
  >
    <div class="flex flex-wrap gap-2">
      <Badge variant="success"><Check class="size-3" /> Verified</Badge>
      <Badge variant="warning"><Clock class="size-3" /> Pending</Badge>
      <Badge variant="info"><Zap class="size-3" /> Pro</Badge>
      <Badge variant="destructive"><X class="size-3" /> Failed</Badge>
    </div>
  </Story>

  <Story
    title="In context"
    description="Inline with text and counts — the most common badge usage."
  >
    <div class="flex flex-wrap items-center gap-3 text-sm">
      <span>Notifications</span>
      <Badge>3 new</Badge>
      <span>·</span>
      <span>Status</span>
      <Badge variant="success">Active</Badge>
      <span>·</span>
      <span>Plan</span>
      <Badge variant="info">Pro</Badge>
    </div>
  </Story>

  <Story
    title="Notification dots on icons"
    description="Position a small Badge over a button to indicate unread or pending state."
  >
    <div class="flex items-center gap-4">
      <div class="relative">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell />
        </Button>
        <Badge
          variant="destructive"
          class="absolute -top-1 -right-1 size-4 rounded-full p-0 text-xs"
          >5</Badge
        >
      </div>

      <div class="relative">
        <Button variant="ghost" size="icon" aria-label="Inbox">
          <Inbox />
        </Button>
        <Badge
          variant="success"
          class="absolute -top-1 -right-1 size-2.5 rounded-full p-0"
          aria-hidden="true"
        />
      </div>

      <div class="relative">
        <Button variant="ghost" size="icon" aria-label="Mail">
          <Mail />
        </Button>
        <Badge
          class="absolute -top-1 -right-1 h-4 min-w-4 rounded-full px-1 text-xs"
          >99+</Badge
        >
      </div>
    </div>
  </Story>

  <Story
    title="Truncation"
    description="Badges clip long labels. For an ellipsis, wrap the label in a span with truncate — the badge lets it shrink."
  >
    <div class="flex flex-wrap items-center gap-2">
      <Badge variant="outline"
        ><span class="max-w-40 truncate"
          >production-eu-west-1-cluster</span
        ></Badge
      >
      <Badge variant="secondary"
        ><span class="max-w-32 truncate"
          >kubernetes-deployment-status</span
        ></Badge
      >
    </div>
  </Story>

  <Story
    title="Wrapped labels"
    description="Use wrap to let long labels flow onto multiple lines instead of clipping. Geometry switches to rounded-lg so the pill stays readable."
  >
    <div class="max-w-xs space-y-2">
      <Badge variant="warning" wrap
        >Deployment paused — pending approval from the platform team</Badge
      >
      <Badge variant="success" wrap
        >All 14 checks passed across build, test, and security gates</Badge
      >
    </div>
  </Story>

  <Story
    title="Sizes via class override"
    description="Badge ships one size — use Tailwind utilities to scale up or down for hero or list-density placements."
  >
    <div class="flex flex-wrap items-center gap-2">
      <Badge class="px-1.5 py-0 text-xs">XS</Badge>
      <Badge>Default</Badge>
      <Badge class="px-3 py-1 text-sm">Large</Badge>
      <Badge class="px-4 py-1.5 text-base">Extra-large</Badge>
    </div>
  </Story>
</template>
