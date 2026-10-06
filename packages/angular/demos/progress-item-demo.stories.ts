import type { AngularStory } from './stories'

/** Story cards for the progress-item Angular demo (titles mirror demos/react/progress-item.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Stacked rows with label, value, secondary label, and per-row colorIndex (chart-1..5).',
  },
  { title: 'Single item', description: 'One progress row — label on the left, percent on the right by default.' },
  {
    title: 'Custom barClass',
    description: 'Override the indicator color with any utility — barClass takes precedence over colorIndex.',
  },
  {
    title: 'Custom secondary labels',
    description: 'Use secondaryLabel for non-percentage units like counts, time, or fractions.',
  },
  { title: 'Compact stack', description: 'Multiple progress rows in a denser two-column grid for dashboards.' },
]
