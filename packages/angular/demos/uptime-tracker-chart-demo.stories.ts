import type { AngularStory } from './stories'

/** Story cards for the uptime-tracker-chart Angular demo (titles mirror the React demo). */
export const stories: AngularStory[] = [
  {
    title: 'Healthy quarter',
    description: '90 daily bars; uptime % computes from the data.',
  },
  {
    title: 'With incidents',
    description: 'Degraded stretches and a full outage day. Hover any bar for its date.',
  },
]
