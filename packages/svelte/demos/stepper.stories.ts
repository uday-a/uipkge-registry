import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default',
    description: 'Horizontal stepper with icon indicators, titles, and connectors between steps.',
  },
  {
    title: 'Vertical orientation',
    description: "orientation='vertical' stacks indicators top-to-bottom with connectors running between them.",
  },
  {
    title: 'Error state',
    description: 'A step with error: true switches its indicator to the destructive style.',
  },
  {
    title: 'Disabled step',
    description: 'A step with disabled: true is non-clickable and skipped during navigation.',
  },
  {
    title: 'With descriptions',
    description: "Each step's description prop renders below the title in muted small text.",
  },
  {
    title: 'Programmatic binding',
    description: 'Drive the value with external buttons; the stepper updates in lock-step with the model.',
  },
]
