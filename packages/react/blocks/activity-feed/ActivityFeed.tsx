'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { RelativeTime } from '@/components/ui/relative-time'
import { SectionCard } from '@/components/ui/section-card'
import { Timeline, TimelineContent, TimelineItem, TimelineMedia } from '@/components/ui/timeline'

const now = new Date('2026-08-14T12:00:00.000Z')

export function ActivityFeed() {
  return (
    <SectionCard data-slot="activity-feed" title="Activity" description="Latest changes on this record.">
      <Timeline>
        <TimelineItem status="success">
          <TimelineMedia variant="avatar">
            <Avatar size="sm">
              <AvatarFallback size="sm" className="text-foreground">MC</AvatarFallback>
            </Avatar>
          </TimelineMedia>
          <TimelineContent>
            <p className="text-sm">
              <span className="font-medium">Maya Chen</span>
              <span className="text-muted-foreground"> approved the leave request</span>
            </p>
            <RelativeTime date="2026-08-14T11:18:00.000Z" now={now} locale="en" className="mt-0.5 block text-xs" />
          </TimelineContent>
        </TimelineItem>

        <TimelineItem status="info">
          <TimelineMedia variant="avatar">
            <Avatar size="sm">
              <AvatarFallback size="sm" className="text-foreground">OF</AvatarFallback>
            </Avatar>
          </TimelineMedia>
          <TimelineContent>
            <p className="text-sm">
              <span className="font-medium">Omar Farid</span>
              <span className="text-muted-foreground"> added a comment</span>
            </p>
            <p className="text-muted-foreground mt-1 text-sm">Coverage is confirmed for Thursday and Friday.</p>
            <RelativeTime date="2026-08-14T10:04:00.000Z" now={now} locale="en" className="mt-0.5 block text-xs" />
          </TimelineContent>
        </TimelineItem>

        <TimelineItem status="muted">
          <TimelineMedia variant="avatar">
            <Avatar size="sm">
              <AvatarFallback size="sm" className="text-foreground">PS</AvatarFallback>
            </Avatar>
          </TimelineMedia>
          <TimelineContent>
            <p className="text-sm">
              <span className="font-medium">Priya Shah</span>
              <span className="text-muted-foreground"> updated the title to “Q3 planning offsite”</span>
            </p>
            <RelativeTime date="2026-08-13T16:40:00.000Z" now={now} locale="en" className="mt-0.5 block text-xs" />
          </TimelineContent>
        </TimelineItem>

        <TimelineItem status="muted">
          <TimelineMedia variant="avatar">
            <Avatar size="sm">
              <AvatarFallback size="sm" className="text-foreground">LP</AvatarFallback>
            </Avatar>
          </TimelineMedia>
          <TimelineContent>
            <p className="text-sm">
              <span className="font-medium">Leo Park</span>
              <span className="text-muted-foreground"> opened this request</span>
            </p>
            <RelativeTime date="2026-08-13T09:12:00.000Z" now={now} locale="en" className="mt-0.5 block text-xs" />
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </SectionCard>
  )
}
