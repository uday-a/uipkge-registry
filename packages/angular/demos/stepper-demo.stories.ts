import type { AngularStory } from './stories'

/** Story cards for the stepper Angular demo (titles mirror demos/react/stepper.tsx). */
export const stories: AngularStory[] = [
  { title: 'Default', description: 'Horizontal stepper with icon indicators, titles, and connectors between steps.' },
  {
    title: 'Vertical orientation',
    description: "orientation='vertical' stacks indicators top-to-bottom with connectors running between them.",
  },
  { title: 'Error state', description: 'A step with error: true switches its indicator to the destructive style.' },
  { title: 'Disabled step', description: 'A step with disabled: true is non-clickable and skipped during navigation.' },
  {
    title: 'With descriptions',
    description: "Each step's description prop renders below the title in muted small text.",
  },
  {
    title: 'Programmatic v-model',
    description: 'Drive currentStep with external buttons; the stepper updates in lock-step with the model.',
  },
]
