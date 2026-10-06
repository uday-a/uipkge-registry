import type { AngularStory } from './stories'

/** Story cards for the timeline Angular demo (titles + descriptions mirror demos/react/timeline.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Chronological event rail with minimalist dot markers and dynamic connector lines.',
  },
  {
    title: 'Icon markers',
    description: 'Framed icon markers for categorical event feeds such as deployment and release workflows.',
  },
  {
    title: 'Status indicators',
    description: 'Semantic status markers (success, current, muted) with subtle tonal accents for CI/CD pipelines.',
  },
  {
    title: 'Status colors',
    description:
      'Set status on TimelineItem (or TimelineMedia) to color the marker per token: success, info, warning, error, muted.',
  },
  {
    title: 'Side: right',
    description: "Move the rail to the right side with side='right' on Timeline.",
  },
  {
    title: 'Alternating sides',
    description: "align='center' alternates milestone entries across a centered thread.",
  },
  {
    title: 'Horizontal',
    description: "direction='horizontal' lays out lifecycle stages left-to-right for fulfillment and order tracking.",
  },
  {
    title: 'Avatar markers',
    description: "variant='avatar' on TimelineMedia embeds team member avatars for collaboration audit feeds.",
  },
  {
    title: 'Compact density',
    description: "density='compact' tightens row height for dense audit logs and security telemetry feeds.",
  },
  {
    title: 'Comfortable density',
    description: "density='comfortable' adds breathing room for sparse milestone-style timelines.",
  },
  {
    title: 'Outline marker & dashed connector',
    description:
      "Combine TimelineHeader for aligned titles/badges with variant='outline' markers and line-style='dashed' connectors.",
  },
  {
    title: 'Checklist (done / pending)',
    description:
      "Map a boolean state to status: done items use status='success' with a Check icon, pending items use status='muted' with an outlined Circle. Opt in to colored-connector on TimelineMedia so the connector line adopts the item status color.",
  },
  {
    title: 'Mixed content',
    description: 'Rich event entries combining title, paragraph, and inline action buttons.',
  },
  {
    title: 'Activity feed (day-grouped)',
    description:
      'Day-grouped feed with filter tabs and heterogeneous entry types (text event, task with badge + assignees, file list, image gallery, notification with CTA). Each day is its own Timeline so the connector line breaks cleanly under each header.',
  },
  {
    title: 'Rich content cards',
    description:
      'Nest cards and action triggers inside timeline items for detailed changelogs or incident post-mortems.',
  },
]
