'use client'

import * as React from 'react'
import { Clock } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { DataList, DataListItem } from '@/components/ui/data-list'
import { Badge } from '@/components/ui/badge'

export interface EventItem {
  id: string | number
  title: string
  date: string
  status?: string
  statusVariant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

export interface EventListProps {
  title?: string
  description?: string
  events: EventItem[]
  className?: string
}

export function EventList({ title, description, events, className }: EventListProps) {
  return (
    <SectionCard
      data-slot="event-list"
      title={title ?? 'Upcoming Events'}
      description={description}
      className={className}
    >
      <DataList>
        {events.map((event) => (
          <DataListItem key={event.id} className="flex-col items-stretch">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{event.title}</p>
              {event.status && <Badge variant={event.statusVariant ?? 'secondary'}>{event.status}</Badge>}
            </div>
            <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
              <Clock className="size-3" />
              <span>{event.date}</span>
            </div>
          </DataListItem>
        ))}
      </DataList>
    </SectionCard>
  )
}
