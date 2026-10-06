<script lang="ts">
  import { EventCalendar, type CalendarEvent } from '@svelte-registry/event-calendar'

  let { story }: { story: string } = $props()

  // Base reference date for predictable demo presentation
  let selectedDate = $state('2026-05-18')

  const demoEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Q2 Product Roadmap Review',
      start: '2026-05-18 09:00',
      end: '2026-05-18 10:30',
      color: 'primary',
      location: 'Conference Room A',
      category: 'room-alpha',
    },
    {
      id: '2',
      title: 'Design System Polish',
      start: '2026-05-18 10:00',
      end: '2026-05-18 11:30',
      color: 'purple',
      location: 'Design Studio',
      category: 'room-beta',
    },
    {
      id: '3',
      title: 'Customer Onboarding Sync',
      start: '2026-05-18 14:00',
      end: '2026-05-18 15:00',
      color: 'info',
      location: 'Zoom',
      category: 'room-alpha',
    },
    {
      id: '4',
      title: 'Company Hackathon 2026',
      start: '2026-05-18',
      allDay: true,
      color: 'success',
    },
    {
      id: '5',
      title: 'Infrastructure Maintenance',
      start: '2026-05-19 11:00',
      end: '2026-05-19 12:30',
      color: 'warning',
      location: 'DevOps War Room',
      category: 'boardroom',
    },
    {
      id: '6',
      title: 'Sprint Retrospective',
      start: '2026-05-20 15:00',
      end: '2026-05-20 16:00',
      color: 'rose',
      category: 'room-beta',
    },
    {
      id: '7',
      title: 'Weekly Leadership Sync',
      start: '2026-05-18 16:30',
      end: '2026-05-18 17:30',
      color: 'destructive',
      category: 'boardroom',
    },
    {
      id: '8',
      title: 'Architecture Review',
      start: '2026-05-18 10:45',
      end: '2026-05-18 11:45',
      color: 'secondary',
      category: 'room-alpha',
    },
  ]

  const demoCategories = [
    { id: 'room-alpha', name: 'Room Alpha', color: 'rgb(59, 130, 246)' },
    { id: 'room-beta', name: 'Studio Beta', color: 'rgb(168, 85, 247)' },
    { id: 'boardroom', name: 'Executive Boardroom', color: 'rgb(245, 158, 11)' },
  ]
</script>

{#if story === 'Month View'}
  <EventCalendar bind:value={selectedDate} view="month" events={demoEvents} maxEventsPerDay={3} />
{/if}

{#if story === 'Week View with Intervals'}
  <EventCalendar
    bind:value={selectedDate}
    view="week"
    events={demoEvents}
    firstInterval={8}
    intervalCount={11}
  />
{/if}

{#if story === 'Day View'}
  <EventCalendar
    bind:value={selectedDate}
    view="day"
    events={demoEvents}
    firstInterval={8}
    intervalCount={11}
  />
{/if}

{#if story === 'Category / Resource View'}
  <EventCalendar
    bind:value={selectedDate}
    view="category"
    events={demoEvents}
    categories={demoCategories}
    firstInterval={8}
    intervalCount={11}
  />
{/if}

{#if story === 'Custom Event Template'}
  <EventCalendar bind:value={selectedDate} view="month" events={demoEvents}>
    {#snippet event({ event })}
      <div
        class="border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors"
      >
        <span class="bg-primary size-1.5 shrink-0 rounded-full"></span>
        <span class="truncate font-semibold">{event.title}</span>
        {#if event.location}
          <span class="ml-auto hidden text-[10px] opacity-75 sm:inline">
            {event.location}
          </span>
        {/if}
      </div>
    {/snippet}
  </EventCalendar>
{/if}
