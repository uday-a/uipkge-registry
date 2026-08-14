<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { RelativeTime } from '@/components/ui/relative-time'
import { SectionCard } from '@/components/ui/section-card'
import { Timeline, TimelineContent, TimelineItem, TimelineMedia } from '@/components/ui/timeline'

const now = new Date('2026-08-14T12:00:00.000Z')
</script>

<template>
  <SectionCard data-slot="activity-feed" title="Activity" description="Latest changes on this record.">
    <Timeline>
      <TimelineItem status="success">
        <TimelineMedia variant="avatar">
          <Avatar size="sm">
            <AvatarFallback size="sm" class="text-foreground">MC</AvatarFallback>
          </Avatar>
        </TimelineMedia>
        <TimelineContent>
          <p class="text-sm">
            <span class="font-medium">Maya Chen</span>
            <span class="text-muted-foreground"> approved the leave request</span>
          </p>
          <RelativeTime date="2026-08-14T11:18:00.000Z" :now="now" locale="en" class="mt-0.5 block text-xs" />
        </TimelineContent>
      </TimelineItem>

      <TimelineItem status="info">
        <TimelineMedia variant="avatar">
          <Avatar size="sm">
            <AvatarFallback size="sm" class="text-foreground">OF</AvatarFallback>
          </Avatar>
        </TimelineMedia>
        <TimelineContent>
          <p class="text-sm">
            <span class="font-medium">Omar Farid</span>
            <span class="text-muted-foreground"> added a comment</span>
          </p>
          <p class="text-muted-foreground mt-1 text-sm">Coverage is confirmed for Thursday and Friday.</p>
          <RelativeTime date="2026-08-14T10:04:00.000Z" :now="now" locale="en" class="mt-0.5 block text-xs" />
        </TimelineContent>
      </TimelineItem>

      <TimelineItem status="muted">
        <TimelineMedia variant="avatar">
          <Avatar size="sm">
            <AvatarFallback size="sm" class="text-foreground">PS</AvatarFallback>
          </Avatar>
        </TimelineMedia>
        <TimelineContent>
          <p class="text-sm">
            <span class="font-medium">Priya Shah</span>
            <span class="text-muted-foreground"> updated the title to “Q3 planning offsite”</span>
          </p>
          <RelativeTime date="2026-08-13T16:40:00.000Z" :now="now" locale="en" class="mt-0.5 block text-xs" />
        </TimelineContent>
      </TimelineItem>

      <TimelineItem status="muted">
        <TimelineMedia variant="avatar">
          <Avatar size="sm">
            <AvatarFallback size="sm" class="text-foreground">LP</AvatarFallback>
          </Avatar>
        </TimelineMedia>
        <TimelineContent>
          <p class="text-sm">
            <span class="font-medium">Leo Park</span>
            <span class="text-muted-foreground"> opened this request</span>
          </p>
          <RelativeTime date="2026-08-13T09:12:00.000Z" :now="now" locale="en" class="mt-0.5 block text-xs" />
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  </SectionCard>
</template>
