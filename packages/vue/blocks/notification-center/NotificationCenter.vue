<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component, HTMLAttributes } from 'vue'
import { BellOff, Check, CheckCheck, MessageSquare, ShieldAlert, UserPlus, X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RelativeTime } from '@/components/ui/relative-time'
import { SectionCard } from '@/components/ui/section-card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type NotificationCategory = 'mention' | 'comment' | 'system' | 'security'

interface Notification {
  id: string
  category: NotificationCategory
  title: string
  body: string
  date: Date
  read: boolean
}

const props = withDefaults(
  defineProps<{
    notifications?: Notification[]
    class?: HTMLAttributes['class']
  }>(),
  {},
)

const categoryConfig: Record<NotificationCategory, { icon: Component; tileClass: string }> = {
  mention: { icon: UserPlus, tileClass: 'bg-primary/10 text-primary' },
  comment: { icon: MessageSquare, tileClass: 'bg-chart-3/10 text-chart-3' },
  system: { icon: BellOff, tileClass: 'bg-muted text-muted-foreground' },
  security: { icon: ShieldAlert, tileClass: 'bg-warning/10 text-warning' },
}

const now = new Date()
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000)
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000)
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000)

const stubNotifications: Notification[] = [
  {
    id: 'n1',
    category: 'mention',
    title: 'Priya mentioned you',
    body: '@amara can you review the onboarding flow?',
    date: minutesAgo(6),
    read: false,
  },
  {
    id: 'n2',
    category: 'security',
    title: 'New sign-in from Berlin',
    body: 'Chrome on macOS · 84.190.201.3',
    date: minutesAgo(52),
    read: false,
  },
  {
    id: 'n3',
    category: 'comment',
    title: 'Jonas commented',
    body: 'Shipped the fix — closing the ticket.',
    date: hoursAgo(2),
    read: false,
  },
  {
    id: 'n4',
    category: 'system',
    title: 'Weekly digest ready',
    body: 'Your workspace summary for last week.',
    date: hoursAgo(20),
    read: true,
  },
  {
    id: 'n5',
    category: 'mention',
    title: 'Marcus mentioned you',
    body: 'Design review moved to 15:00, @amara.',
    date: daysAgo(1),
    read: false,
  },
  {
    id: 'n6',
    category: 'comment',
    title: 'Amara commented',
    body: 'Copy updated per legal review.',
    date: daysAgo(1),
    read: true,
  },
  {
    id: 'n7',
    category: 'security',
    title: 'API key rotated',
    body: 'uipkge_live_…4f2a was rotated automatically.',
    date: daysAgo(2),
    read: true,
  },
]

const notifications = computed(() => props.notifications ?? stubNotifications)
const filter = ref<'all' | 'unread' | 'mentions'>('all')

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

const filtered = computed(() =>
  notifications.value.filter((n) => {
    if (filter.value === 'unread') return !n.read
    if (filter.value === 'mentions') return n.category === 'mention'
    return true
  }),
)

const groups = computed(() => {
  const today: Notification[] = []
  const earlier: Notification[] = []
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  for (const notification of filtered.value) {
    ;(notification.date >= startOfToday ? today : earlier).push(notification)
  }
  return [
    { label: 'Today', items: today },
    { label: 'Earlier', items: earlier },
  ].filter((group) => group.items.length > 0)
})

function markAllRead() {
  for (const notification of notifications.value) notification.read = true
}
</script>

<template>
  <SectionCard
    data-slot="notification-center"
    title="Notifications"
    description="Everything that needs your attention."
    :class="props.class"
  >
    <template #header-action>
      <div class="flex flex-wrap items-center gap-2">
        <Badge v-if="unreadCount > 0" variant="default">{{ unreadCount }} new</Badge>
        <Button variant="ghost" size="sm" :disabled="unreadCount === 0" @click="markAllRead">
          <CheckCheck aria-hidden="true" />
          Mark all read
        </Button>
      </div>
    </template>

    <Tabs v-model="filter" class="mb-2">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="unread">Unread</TabsTrigger>
        <TabsTrigger value="mentions">Mentions</TabsTrigger>
      </TabsList>
    </Tabs>

    <div v-if="groups.length === 0" class="text-muted-foreground flex flex-col items-center gap-2 py-12 text-sm">
      <BellOff class="size-6 opacity-50" aria-hidden="true" />
      <template v-if="filter === 'mentions'">No mentions — you're all caught up.</template>
      <template v-else-if="filter === 'unread'">Nothing unread. Nice work.</template>
      <template v-else>Your inbox is empty.</template>
    </div>

    <div v-for="group in groups" :key="group.label" class="mb-2">
      <p class="text-muted-foreground py-1.5 text-xs font-medium tracking-widest uppercase">{{ group.label }}</p>
      <ul class="divide-y">
        <li
          v-for="notification in group.items"
          :key="notification.id"
          class="group hover:bg-accent/40 -mx-2 flex cursor-pointer items-start gap-3 rounded-md px-2 py-3 transition-colors"
          @click="notification.read = true"
        >
          <span
            :class="
              cn(
                'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md',
                categoryConfig[notification.category].tileClass,
              )
            "
            aria-hidden="true"
          >
            <component :is="categoryConfig[notification.category].icon" class="size-4" />
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="truncate text-sm" :class="notification.read ? 'font-normal' : 'font-medium'">
                {{ notification.title }}
              </p>
              <span v-if="!notification.read" class="bg-primary size-1.5 shrink-0 rounded-full" aria-label="Unread" />
            </div>
            <p class="text-muted-foreground truncate text-xs">{{ notification.body }}</p>
          </div>
          <div class="flex shrink-0 items-center gap-1">
            <RelativeTime :date="notification.date" class="text-muted-foreground text-xs" />
            <span class="flex opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                v-if="!notification.read"
                variant="ghost"
                size="icon-sm"
                aria-label="Mark as read"
                @click.stop="notification.read = true"
              >
                <Check aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Dismiss" @click.stop>
                <X aria-hidden="true" />
              </Button>
            </span>
          </div>
        </li>
      </ul>
    </div>
  </SectionCard>
</template>
