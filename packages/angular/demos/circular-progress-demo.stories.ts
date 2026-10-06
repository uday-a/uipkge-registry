import type { AngularStory } from './stories'

/** Story cards for the circular-progress Angular demo (titles mirror demos/react/circular-progress.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Dashboard stat card',
    description: 'A KPI tile in a metrics dashboard — the ring makes the headline number scannable at a glance.',
  },
  {
    title: 'File upload progress',
    description: 'A live upload indicator — the ring fills as bytes transfer, then swaps to a check on completion.',
  },
  {
    title: 'Size variants',
    description: 'sm (40px), default (56px), and lg (80px) — pick the size that fits the surrounding density.',
  },
  {
    title: 'Status colors',
    description: 'Color the arc to match the outcome — green for success, red for warning, blue for info.',
  },
  {
    title: 'Indeterminate spinner',
    description:
      'When the total is unknown, indeterminate mode spins a partial arc — useful while waiting on a server.',
  },
  {
    title: 'Task checklist',
    description: 'Use the default slot to render a fraction label instead of a percentage — great for step counters.',
  },
]
