<script setup lang="ts">
import NotificationsPopover from '@/components/blocks/notifications-popover/NotificationsPopover.vue'
import { Bell } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
// Slot-trigger Popover: consumers wrap their own Bell button. The
// default slot exposes `unreadCount` so the trigger can show a badge.
</script>

<template>
  <Story
    title="Notifications Popover"
    description="Header-grade notifications panel. Filter tabs (All/Unread), Today/Earlier groups, category-coloured accent bars, hover-dismiss, mark-all-read, slide-in animation. Wrap your own trigger button — the default slot exposes `unreadCount` for the badge."
  >
    <NotificationsPopover>
      <template #default="{ unreadCount }">
        <Button
          variant="ghost"
          size="icon"
          class="text-muted-foreground hover:text-foreground relative size-9 rounded-lg"
          aria-label="Notifications"
        >
          <Bell class="size-4" />
          <span
            v-if="unreadCount > 0"
            class="bg-primary ring-background absolute top-1.5 right-1.5 size-2 rounded-full ring-2"
          />
        </Button>
      </template>
    </NotificationsPopover>
  </Story>
</template>
